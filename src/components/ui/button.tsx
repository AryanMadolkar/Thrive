import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium",
    "rounded-[var(--radius-control)] disabled:pointer-events-none disabled:opacity-50",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20",
    "pressable active:scale-[0.97]"
  ),
  {
    variants: {
      variant: {
        primary:
          "bg-foreground text-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] hover:bg-foreground/90",
        secondary:
          "border border-border bg-white/80 text-foreground shadow-[var(--glass-shadow-soft)] hover:bg-hover",
        ghost: "text-foreground hover:bg-hover",
        encourage:
          "bg-foreground px-4 text-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] hover:bg-foreground/90",
        danger: "bg-danger text-white hover:bg-danger/90",
        link: "px-0 text-muted underline-offset-4 hover:text-foreground hover:underline",
        glass:
          "glass-pill text-foreground hover:brightness-[1.02]",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-11 px-5",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
);
Button.displayName = "Button";
