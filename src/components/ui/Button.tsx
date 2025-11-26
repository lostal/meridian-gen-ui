/**
 * MERIDIAN LIVING - Button Component
 * Elegant, refined button with multiple variants
 */

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "font-medium transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "select-none cursor-pointer",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-[--color-midnight] text-[--color-warm-white]",
          "hover:bg-[--color-midnight-soft]",
          "focus-visible:ring-[--color-midnight]",
          "shadow-sm hover:shadow-md",
        ],
        secondary: [
          "bg-[--color-sand] text-[--color-midnight]",
          "hover:bg-[--color-sand-warm]",
          "focus-visible:ring-[--color-sand-deep]",
          "border border-[--color-sand-deep]/20",
        ],
        ghost: [
          "bg-transparent text-[--color-midnight]",
          "hover:bg-[--color-sand]/50",
          "focus-visible:ring-[--color-midnight]/20",
        ],
        outline: [
          "bg-transparent text-[--color-midnight]",
          "border border-[--color-midnight]/20",
          "hover:bg-[--color-midnight] hover:text-[--color-warm-white]",
          "focus-visible:ring-[--color-midnight]",
        ],
      },
      size: {
        sm: "h-8 px-3 text-sm rounded-lg",
        md: "h-10 px-4 text-sm rounded-xl",
        lg: "h-12 px-6 text-base rounded-xl",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  readonly isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled ?? isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span>Cargando...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
