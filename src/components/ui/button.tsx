import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-cta hover:bg-primary/90 hover:-translate-y-0.5 active:translate-y-0",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:-translate-y-0.5 active:translate-y-0",
        outline:
          "border border-input bg-card shadow-sm hover:bg-muted/60 hover:text-foreground hover:border-border",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-muted hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        pill:
          "rounded-full bg-primary text-primary-foreground shadow-cta hover:bg-primary/95 hover:shadow-hover hover:-translate-y-0.5 active:translate-y-0 font-bold",
        gradient:
          "rounded-full bg-gradient-to-r from-[#7047eb] via-[#8b5cf6] to-[#ff4b72] text-white shadow-cta hover:shadow-hover hover:-translate-y-0.5 active:translate-y-0 font-bold",
        subtle:
          "bg-brand-50 text-brand-700 hover:bg-brand-100 hover:text-brand-800 border border-brand-200/60",
        coral:
          "rounded-full bg-coral text-white shadow-sm hover:bg-coral-600 hover:shadow-hover-coral hover:-translate-y-0.5 active:translate-y-0 font-bold",
        mint:
          "rounded-full bg-mint text-white shadow-sm hover:bg-mint-600 hover:-translate-y-0.5 active:translate-y-0 font-bold",
        amber:
          "rounded-full bg-amber text-slate-950 font-bold shadow-sm hover:bg-amber-600 hover:-translate-y-0.5 active:translate-y-0",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-lg px-3.5 text-xs",
        lg: "h-12 rounded-2xl px-7 text-base",
        pill: "h-11 rounded-full px-6 text-sm",
        "pill-lg": "h-13 rounded-full px-8 text-base",
        "pill-sm": "h-8 rounded-full px-4 text-xs",
        icon: "h-10 w-10 rounded-xl",
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

