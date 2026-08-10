import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "nebula";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  loading?: boolean;
  children: ReactNode;
};

const base =
  "raise inline-flex min-h-9 items-center justify-center gap-2 rounded-[var(--radius-button)] px-4 py-2 font-mono text-xs font-bold tracking-wide select-none disabled:cursor-not-allowed";

const variants: Record<ButtonVariant, string> = {
  // Figma button component 236:334 — #FF7400 face over #A74C00 underside
  primary:
    "bg-ember-500 text-white shadow-[var(--shadow-raise-ember)] hover:bg-ember-400 active:bg-ember-400 disabled:bg-hull-500 disabled:text-hull-300 disabled:shadow-none",
  // Secondary — light capsule with hairline border (Figma pills 193:664-667)
  secondary:
    "bg-hull-50 text-hull-900 border border-hull-400 shadow-none hover:bg-hull-200 disabled:bg-hull-200 disabled:text-hull-500",
  // Nebula — indigo gradient action (Figma feedback FAB 193:707)
  nebula:
    "bg-gradient-to-br from-nebula-400 to-nebula-600 text-white shadow-[var(--shadow-fab)] hover:from-nebula-300 hover:to-nebula-500 disabled:from-hull-500 disabled:to-hull-600 disabled:shadow-none",
};

function Spinner() {
  return (
    <svg
      className="size-3.5 animate-spin motion-reduce:animate-none"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
      <path d="M14.5 8a6.5 6.5 0 0 0-6.5-6.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function Button({
  variant = "primary",
  loading = false,
  disabled,
  children,
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
