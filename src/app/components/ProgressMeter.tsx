import type { HTMLAttributes } from 'react'

/* Accessible progress indicator with a clamped value and tabular percentage. */

export type ProgressMeterProps = HTMLAttributes<HTMLDivElement> & {
  value: number // 0-100
  label?: string
  showValue?: boolean
}

export function ProgressMeter({
  value,
  label = 'Progress',
  showValue = true,
  className = '',
  ...rest
}: ProgressMeterProps) {
  const numericValue = Number.isNaN(value) ? 0 : value
  const clamped = Math.min(100, Math.max(0, numericValue))
  const displayValue = Math.round(clamped)

  return (
    <div className={`progress-meter w-full ${className}`} {...rest}>
      <div className="mb-2 flex items-baseline justify-between font-sans text-xs font-medium leading-4">
        <span className="text-hull-200">{label}</span>
        {showValue && (
          <span className="font-mono font-bold tabular-nums text-ember-300">{displayValue}%</span>
        )}
      </div>
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={`${displayValue}%`}
        aria-label={label}
        className="h-3 w-full overflow-hidden rounded-[var(--radius-capsule)] border border-hull-600/60 bg-space-800"
      >
        <div
          className="h-full rounded-[var(--radius-capsule)] bg-ember-400 motion-safe:transition-[width] motion-safe:duration-300"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}
