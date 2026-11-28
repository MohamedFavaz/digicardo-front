"use client";
import { cn } from "@/lib/utils";
import { rupees } from "@/lib/franchise/api";

export type FranchisePayMode = "fee" | "per_card";

const input = "h-10 w-full rounded-xl border border-border bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#343C22]/20";

/**
 * How a franchise pays the admin: a one-time franchise fee (then ₹0 per card) or a price per card.
 */
export function FranchisePricing({
  mode,
  fee,
  price,
  onMode,
  onFee,
  onPrice,
  errors = {},
}: {
  mode: FranchisePayMode;
  fee: string;
  price: string;
  onMode: (m: FranchisePayMode) => void;
  onFee: (v: string) => void;
  onPrice: (v: string) => void;
  errors?: Record<string, string>;
}) {
  return (
    <div className="space-y-3 rounded-2xl bg-muted/60 p-4 sm:col-span-2">
      <p className="text-sm font-medium text-foreground">How the franchise pays you</p>
      <div role="radiogroup" aria-label="How the franchise pays" className="grid gap-2 sm:grid-cols-2">
        {(
          [
            ["fee", "One-time franchise fee", "A fixed amount. No charge for the cards they make."],
            ["per_card", "Per card", "A price for every card they make."],
          ] as [FranchisePayMode, string, string][]
        ).map(([id, title, text]) => (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={mode === id}
            onClick={() => onMode(id)}
            className={cn("rounded-xl border-2 px-3.5 py-2.5 text-left transition", mode === id ? "border-[#343C22] bg-white" : "border-transparent bg-white/60 hover:bg-white")}
          >
            <span className="block text-sm font-medium text-foreground">{title}</span>
            <span className="block text-xs text-muted-foreground">{text}</span>
          </button>
        ))}
      </div>
      {mode === "fee" ? (
        <label className="block space-y-1.5 text-sm">
          <span className="font-medium">Franchise fee (₹)</span>
          <input type="number" min={0} step="1" inputMode="decimal" className={input} value={fee} onChange={(e) => onFee(e.target.value)} placeholder="e.g. 50000" />
          {errors.franchise_fee ? <span className="block text-xs text-destructive">{errors.franchise_fee}</span> : <span className="block text-xs text-muted-foreground">Cards are then free: ₹0 per card.</span>}
        </label>
      ) : (
        <label className="block space-y-1.5 text-sm">
          <span className="font-medium">Price per card (₹)</span>
          <input type="number" min={0} step="1" inputMode="decimal" className={input} value={price} onChange={(e) => onPrice(e.target.value)} placeholder="e.g. 300" />
          {errors.card_price ? <span className="block text-xs text-destructive">{errors.card_price}</span> : <span className="block text-xs text-muted-foreground">What the franchise pays you for each card.</span>}
        </label>
      )}
    </div>
  );
}

/** "₹50,000 one-time" / "₹300 per card" for lists. */
export function franchisePaysLabel(cfg?: { card_price?: string | number | null; franchise_fee?: string | number | null } | null): string {
  if (!cfg) return "—";
  if (cfg.franchise_fee !== null && cfg.franchise_fee !== undefined) return `${rupees(cfg.franchise_fee)} one-time`;
  return `${rupees(cfg.card_price)} per card`;
}
