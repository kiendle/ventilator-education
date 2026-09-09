import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'quiet'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  loading?: boolean
  children: ReactNode
}

const base =
  'raise inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-button)] px-4 py-3 font-sans text-sm font-bold leading-5 tracking-normal select-none disabled:cursor-not-allowed'

const variants: Record<ButtonVariant, string> = {
  primary:
    'border-2 border-ember-400 bg-ember-500 text-space-950 shadow-[var(--shadow-raise-ember)] hover:border-ember-300 hover:bg-ember-400 active:border-ember-400 active:bg-ember-400 disabled:border-hull-300 disabled:bg-hull-300 disabled:text-hull-600 disabled:shadow-none',
  secondary:
    'border-2 border-ember-200 bg-pastel-cream text-ember-700 shadow-[var(--shadow-raise-card)] hover:border-ember-300 hover:bg-ember-100 active:border-ember-300 active:bg-ember-100 disabled:border-hull-300 disabled:bg-hull-200 disabled:text-hull-600 disabled:shadow-none',
  quiet:
    'border border-transparent bg-hull-100 text-space-800 shadow-none hover:border-hull-300 hover:bg-hull-200 active:border-hull-300 active:bg-hull-200 disabled:border-hull-200 disabled:bg-hull-200 disabled:text-hull-500 disabled:shadow-none',
}

function Spinner() {
  return (
    <svg
      className="size-4 animate-spin motion-reduce:animate-none"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
      <path
        d="M14.5 8a6.5 6.5 0 0 0-6.5-6.5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function Button({
  variant = 'primary',
  loading = false,
  disabled,
  children,
  className = '',
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
  )
}
