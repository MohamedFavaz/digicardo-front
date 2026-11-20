import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Design system v6 buttons (docs/editor-redesign-plan.md §3.5).
 * One brand-coloured action per screen (`default`); everything else is `outline`,
 * `secondary` or `ghost`. Legacy variant names are kept so older screens still compile;
 * `pill`/`gradient`/`subtle` now render in the standard style. `coral`/`mint`/`amber`
 * are landing-page only until its restyle (Phase 6).
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-[#4A32C0] active:bg-[#3D2AAD]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-card text-foreground hover:bg-muted",
        secondary: "bg-secondary text-secondary-foreground hover:bg-[#E9E9EC]",
        ghost: "hover:bg-muted hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        pill: "rounded-full bg-primary text-primary-foreground hover:bg-[#4A32C0] active:bg-[#3D2AAD]",
        gradient: "rounded-full bg-primary text-primary-foreground hover:bg-[#4A32C0] active:bg-[#3D2AAD]",
        subtle: "bg-[#EFECFD] text-[#3D2AAD] hover:bg-[#E4DFFB]",
        coral:
          "rounded-full bg-coral text-white shadow-sm hover:bg-coral-600 font-bold",
        mint:
          "rounded-full bg-mint text-white shadow-sm hover:bg-mint-600 font-bold",
        amber:
          "rounded-full bg-amber text-slate-950 font-bold shadow-sm hover:bg-amber-600",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 px-6 text-base",
        pill: "h-11 rounded-full px-6",
        "pill-lg": "h-12 rounded-full px-8 text-base",
        "pill-sm": "h-8 rounded-full px-4 text-xs",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

