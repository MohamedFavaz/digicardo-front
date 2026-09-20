import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border-border text-foreground bg-card/80",
        purple:
          "border-brand-200/80 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 dark:border-brand-700/40",
        coral:
          "border-coral/20 bg-coral-50 text-coral-700 dark:bg-coral-900/30 dark:text-coral-300 dark:border-coral/40",
        mint:
          "border-mint/25 bg-mint-50 text-mint-700 dark:bg-mint-900/30 dark:text-mint-300 dark:border-mint/40",
        amber:
          "border-amber/30 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber/40",
        sky:
          "border-sky/25 bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky/40",
      },
      size: {
        default: "px-3 py-1 text-xs",
        sm: "px-2.5 py-0.5 text-[11px]",
        lg: "px-4 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

