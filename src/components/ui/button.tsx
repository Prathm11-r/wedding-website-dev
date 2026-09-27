import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

// ─── Variant Definitions ─────────────────────────────────────────────────────

const buttonVariants = cva(
  // Base styles applied to every button variant
  [
    "inline-flex items-center justify-center gap-2",
    "rounded-lg font-medium",
    "transition-all duration-150 ease-in-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "select-none whitespace-nowrap",
  ],
  {
    variants: {
      variant: {
        /** Solid luxury gold gradient — primary call-to-action */
        primary: [
          "bg-gradient-to-r from-[#F0D59E] via-[#DDB872] to-[#B58A3E] text-[#1C150B] font-semibold shadow-soft-md shadow-[#C9A96E]/30",
          "hover:brightness-105 hover:shadow-lg hover:shadow-[#C9A96E]/40 hover:-translate-y-0.5",
          "active:scale-[0.98] active:translate-y-0",
          "border border-[#FFF4D4]/40",
        ],
        /** Luxury frosted pill — secondary actions */
        secondary: [
          "border border-[#C9A96E]/50 text-neutral-dark bg-white/90 backdrop-blur-md shadow-soft-sm",
          "hover:bg-white hover:border-[#C9A96E] hover:text-primary-deep hover:shadow-soft-md hover:-translate-y-0.5",
          "active:scale-[0.98] active:translate-y-0",
        ],
        /** No background — tertiary / navigation links */
        ghost: [
          "bg-transparent text-neutral-dark font-medium",
          "hover:bg-neutral-light/80 hover:text-primary-deep",
          "active:scale-[0.98]",
        ],
        /** Outlined with subtle gold tint */
        outline: [
          "border border-border/80 bg-white/80 backdrop-blur-sm text-neutral-dark font-medium shadow-soft-sm",
          "hover:bg-white hover:border-[#C9A96E]/60 hover:text-primary-deep hover:shadow-soft-md hover:-translate-y-0.5",
          "active:scale-[0.98] active:translate-y-0",
        ],
        /** Destructive actions (delete, cancel subscription, etc.) */
        destructive: [
          "bg-red-600 text-white shadow-soft-sm",
          "hover:bg-red-700 hover:shadow-soft-md",
          "active:scale-[0.98]",
        ],
        /** Looks like a hyperlink */
        link: [
          "text-primary-deep underline-offset-4 font-medium",
          "hover:underline",
          "p-0 h-auto",
        ],
      },
      size: {
        sm: "h-9 px-3.5 text-xs rounded-xl gap-1.5",
        md: "h-11 px-5 text-sm rounded-xl gap-2",
        lg: "h-13 px-8 text-sm sm:text-base rounded-2xl gap-2.5",
        xl: "h-14 px-9 text-base rounded-2xl gap-3",
        icon: "h-10 w-10 p-0 rounded-xl",
        "icon-sm": "h-8 w-8 p-0 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * When true, renders the button as a `Slot` — merging its props onto the
   * child element. Useful for wrapping Next.js `<Link>` with button styles:
   *
   * ```tsx
   * <Button asChild variant="primary">
   *   <Link href="/dashboard">Go to Dashboard</Link>
   * </Button>
   * ```
   */
  asChild?: boolean;
  /** Shows a loading spinner and disables interaction */
  isLoading?: boolean;
  /** Icon to render before the label */
  leftIcon?: React.ReactNode;
  /** Icon to render after the label */
  rightIcon?: React.ReactNode;
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Polymorphic Button component for EverAfter.
 *
 * Supports all CVA variants (primary, secondary, ghost, outline, destructive,
 * link) and sizes (sm, md, lg, xl, icon, icon-sm).
 *
 * @example
 * <Button variant="primary" size="lg">Save Changes</Button>
 * <Button variant="ghost" size="icon"><TrashIcon /></Button>
 * <Button asChild variant="secondary"><Link href="/pricing">See Plans</Link></Button>
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || isLoading}
        aria-disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
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
            <span className="sr-only">Loading…</span>
            {children}
          </>
        ) : (
          <>
            {leftIcon && (
              <span className="shrink-0" aria-hidden="true">
                {leftIcon}
              </span>
            )}
            {children}
            {rightIcon && (
              <span className="shrink-0" aria-hidden="true">
                {rightIcon}
              </span>
            )}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
