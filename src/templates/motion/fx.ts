"use client";

import * as React from "react";

/**
 * Motion effects for the "motion" card template. Everything here only adds polish: the card
 * reads and works the same without JavaScript, with reduced motion, and inside `inert`
 * thumbnails (template pickers), where every effect stays off.
 */

const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);

/**
 * The nearest ancestor that really scrolls (the editor's phone frame), or null for the window.
 * An element with only overflow-x hidden reports overflow-y "auto" too, so it must also have
 * content to scroll.
 */
export function findScroller(el: HTMLElement | null): HTMLElement | null {
  for (let node = el?.parentElement ?? null; node && node !== document.body && node !== document.documentElement; node = node.parentElement) {
    const { overflowY } = getComputedStyle(node);
    if (/(auto|scroll)/.test(overflowY) && node.scrollHeight > node.clientHeight + 1) return node;
  }
  return null;
}

/** True once mounted in a real, visible page where animation is welcome. */
export function useMotionAllowed(rootRef: React.RefObject<HTMLElement | null>): boolean {
  const [allowed, setAllowed] = React.useState(false);
  React.useEffect(() => {
    const root = rootRef.current;
    setAllowed(Boolean(root && !root.closest("[inert]") && !prefersReducedMotion() && "IntersectionObserver" in window));
  }, [rootRef]);
  return allowed;
}

/**
 * Scroll reveal: elements with `data-reveal` fade / slide / zoom in the first time they come
 * on screen. The root gets `data-motion="on"`, which is what hides not-yet-shown elements in
 * CSS, so without this hook everything is simply visible. State lives in a `data-shown`
 * attribute (React doesn't own it, so re-renders keep it).
 */
export function useReveal(rootRef: React.RefObject<HTMLElement | null>, enabled: boolean) {
  const ioRef = React.useRef<IntersectionObserver | null>(null);

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!enabled || !root) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).setAttribute("data-shown", "");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.06 }
    );
    ioRef.current = io;
    // What is already on screen shows at once (no flash); the rest waits for its turn.
    const scroller = findScroller(root);
    const box = scroller ? scroller.getBoundingClientRect() : { top: 0, bottom: window.innerHeight };
    root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < box.bottom && r.bottom > box.top) el.setAttribute("data-shown", "");
      else io.observe(el);
    });
    root.setAttribute("data-motion", "on");
    return () => {
      io.disconnect();
      ioRef.current = null;
      root.removeAttribute("data-motion");
    };
  }, [enabled, rootRef]);

  // Parts added later (owner edits in the editor) are watched too.
  React.useEffect(() => {
    const root = rootRef.current;
    const io = ioRef.current;
    if (!root || !io) return;
    root.querySelectorAll<HTMLElement>("[data-reveal]:not([data-shown])").forEach((el) => io.observe(el));
  });
}

/**
 * Writes scroll positions to CSS variables on the root (no re-renders):
 * `--mo-hero` 0 → 1 while the hero scrolls away (parallax), `--mo-progress` 0 → 1 over the page.
 * Returns whether the hero has scrolled away (shows the compact top bar).
 */
export function useScrollFx(rootRef: React.RefObject<HTMLElement | null>, heroRef: React.RefObject<HTMLElement | null>): boolean {
  const [compact, setCompact] = React.useState(false);

  React.useEffect(() => {
    const root = rootRef.current;
    const hero = heroRef.current;
    if (!root || !hero || root.closest("[inert]")) return;
    let scroller = findScroller(root);
    let frame = 0;
    let last = false;
    const update = () => {
      frame = 0;
      if (!scroller) scroller = findScroller(root);
      const top = scroller ? scroller.getBoundingClientRect().top : 0;
      const heroBox = hero.getBoundingClientRect();
      const heroP = Math.min(1, Math.max(0, (top - heroBox.top) / Math.max(1, heroBox.height)));
      const scrolled = scroller ? scroller.scrollTop : window.scrollY;
      const max = scroller ? scroller.scrollHeight - scroller.clientHeight : document.documentElement.scrollHeight - window.innerHeight;
      root.style.setProperty("--mo-hero", heroP.toFixed(4));
      root.style.setProperty("--mo-progress", (max > 0 ? Math.min(1, scrolled / max) : 0).toFixed(4));
      const next = heroBox.bottom < top + 64;
      if (next !== last) {
        last = next;
        setCompact(next);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      scroller = findScroller(root);
      onScroll();
    };
    // Capture catches both window scrolling and the editor frame's own scrolling.
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", onResize);
    update();
    return () => {
      document.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", onResize);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [rootRef, heroRef]);

  return compact;
}

/** Fires once when the element first comes on screen. */
export function useInView<T extends HTMLElement>(): [React.RefObject<T | null>, boolean] {
  const ref = React.useRef<T>(null);
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (!("IntersectionObserver" in window)) return setSeen(true);
    const io = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setSeen(true);
        io.disconnect();
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);
  return [ref, seen];
}

/** Material-style ripple from the tap point, for any element with `data-ripple` inside the root. */
export function rippleFrom(event: React.PointerEvent, root: HTMLElement | null) {
  const host = (event.target as HTMLElement).closest<HTMLElement>("[data-ripple]");
  if (!host || !root?.contains(host)) return;
  const box = host.getBoundingClientRect();
  const size = Math.max(box.width, box.height) * 2.2;
  const dot = document.createElement("span");
  dot.className = "mo-ripple";
  dot.setAttribute("aria-hidden", "true");
  dot.style.width = dot.style.height = `${size}px`;
  dot.style.left = `${event.clientX - box.left - size / 2}px`;
  dot.style.top = `${event.clientY - box.top - size / 2}px`;
  host.appendChild(dot);
  const remove = () => dot.remove();
  dot.addEventListener("animationend", remove);
  window.setTimeout(remove, 900);
}

/** 3D tilt + glare that follows a mouse pointer (touch and pen are ignored). */
export function tiltHandlers(enabled: boolean) {
  if (!enabled) return {};
  return {
    onPointerMove(event: React.PointerEvent<HTMLElement>) {
      if (event.pointerType !== "mouse") return;
      const el = event.currentTarget;
      const box = el.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width;
      const y = (event.clientY - box.top) / box.height;
      el.setAttribute("data-tilting", "");
      el.style.setProperty("--tx", `${((x - 0.5) * 16).toFixed(2)}deg`);
      el.style.setProperty("--ty", `${((0.5 - y) * 12).toFixed(2)}deg`);
      el.style.setProperty("--gx", `${(x * 100).toFixed(1)}%`);
      el.style.setProperty("--gy", `${(y * 100).toFixed(1)}%`);
    },
    onPointerLeave(event: React.PointerEvent<HTMLElement>) {
      const el = event.currentTarget;
      el.removeAttribute("data-tilting");
      el.style.setProperty("--tx", "0deg");
      el.style.setProperty("--ty", "0deg");
    },
  };
}
