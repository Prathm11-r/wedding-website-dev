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
        /** Solid gold — primary call-to-action */
        primary: [
          "bg-primary text-white shadow-soft-sm",
          "hover:bg-primary-dark hover:shadow-soft-md",
          "active:scale-[0.98]",
        ],
        /** Outlined gold — secondary actions */
        secondary: [
          "border-2 border-primary text-primary bg-transparent",
          "hover:bg-primary hover:text-white",
          "active:scale-[0.98]",
        ],
        /** No background — tertiary / navigation links */
        ghost: [
          "bg-transparent text-neutral-dark",
          "hover:bg-neutral-light hover:text-neutral-dark",
          "active:scale-[0.98]",
        ],
        /** Outlined with neutral colour — less prominent action */
        outline: [
          "border border-border bg-transparent text-neutral-dark",
          "hover:bg-neutral-light",
          "active:scale-[0.98]",
        ],
        /** Destructive actions (delete, cancel subscription, etc.) */
        destructive: [
          "bg-red-600 text-white shadow-soft-sm",
          "hover:bg-red-700 hover:shadow-soft-md",
          "active:scale-[0.98]",
        ],
        /** Looks like a hyperlink */
        link: [
          "text-primary underline-offset-4",
          "hover:underline",
          "p-0 h-auto",
        ],
      },
      size: {
        sm: "h-8 px-3 text-sm rounded-md gap-1.5",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg",
        icon: "h-10 w-10 p-0",
        "icon-sm": "h-8 w-8 p-0 rounded-md",
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
