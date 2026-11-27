/**
 * Switching accounts in the browser: admin "Open as customer", agent "Customize card", and the
 * banner's "Back to admin / Back to agent panel".
 *
 * A switch changes the session cookie. Any API call the page still has in flight was sent with
 * the old session; when it answers after the switch, its Set-Cookie puts the old session back.
 * That signed admins out after "Back to admin", and could open the admin's own (empty) dashboard
 * instead of the customer's. So every switch:
 *   1. holds new /api/bff calls (they wait behind a gate; on failure the gate reopens),
 *   2. waits (max 4 s) until the calls already running have answered,
 *   3. switches, then leaves the page (the held calls never start on the old session).
 */

type Tracked = Window & { __dgFetchTracked?: boolean };

let inFlight = 0;
let gate: Promise<void> | null = null;
let openGate: (() => void) | null = null;
let rawFetch: typeof fetch = (...args) => fetch(...args);

function trackApiCalls(): void {
  if (typeof window === "undefined" || (window as Tracked).__dgFetchTracked) return;
  (window as Tracked).__dgFetchTracked = true;
  const original = window.fetch.bind(window);
  rawFetch = original;
  const tracked = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    if (!url.includes("/api/bff/")) return original(input, init);
    // A switch is running: wait behind the gate (it only reopens if the switch fails).
    if (gate) return gate.then(() => tracked(input, init));
    inFlight++;
    return original(input, init).finally(() => {
      inFlight--;
    });
  };
  window.fetch = tracked;
}

// Install as soon as this module loads in the browser (imported by the dashboard and console shells).
trackApiCalls();

/** Closes the gate and waits for running API calls. Returns a function that reopens it. */
async function holdApiCalls(): Promise<() => void> {
  if (!gate) gate = new Promise<void>((resolve) => (openGate = resolve));
  const deadline = Date.now() + 4000;
  while (inFlight > 0 && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  return () => {
    openGate?.();
    gate = null;
    openGate = null;
  };
}

function setImpersonationFlags(role: "admin" | "agent" | "franchise" | "franchise_owner" | null): void {
  try {
    if (role) {
      localStorage.setItem("digicardo_impersonating", "true");
      localStorage.setItem("digicardo_impersonator_role", role);
    } else {
      localStorage.removeItem("digicardo_impersonating");
      localStorage.removeItem("digicardo_impersonator_role");
    }
  } catch {
    // storage may be unavailable; the banner also reads the server's user flags
  }
  document.cookie = role ? "digicardo_impersonating=true; path=/; max-age=86400; SameSite=Lax" : "digicardo_impersonating=; path=/; max-age=0;";
}

/**
 * Admin "Open as customer" / agent "Customize card": signs in as the customer and opens their
 * dashboard. Throws with a readable message when the server refuses (the page stays usable).
 */
export async function startImpersonation(path: string, role: "admin" | "agent" | "franchise" | "franchise_owner"): Promise<void> {
  const release = await holdApiCalls();
  try {
    const res = await rawFetch(path, { method: "POST", credentials: "include", headers: { Accept: "application/json" } });
    const json = await res.json().catch(() => null);
    if (!res.ok || json?.success === false) {
      throw new Error(json?.error?.message || json?.message || "Couldn't open this customer's account.");
    }
    setImpersonationFlags(role);
    window.location.href = json?.data?.redirect_url || "/dashboard";
  } catch (e) {
    release();
    throw e instanceof Error ? e : new Error("Couldn't open this customer's account.");
  }
}

/**
 * "Back to admin / agent panel": a full-page form POST (the BFF answers with a 303 to the right
 * console, carrying the restored session cookie).
 */
export async function stopImpersonationAndLeave(): Promise<void> {
  await holdApiCalls();
  setImpersonationFlags(null);
  const form = document.createElement("form");
  form.method = "POST";
  form.action = "/api/bff/v1/auth/stop-impersonation";
  form.style.display = "none";
  document.body.appendChild(form);
  form.submit();
}
