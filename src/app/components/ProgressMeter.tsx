import type { HTMLAttributes } from "react";

/* Progress meter — Figma "iPhone 17 - 11" track (193:670) and
   Shared Components Frame 5 (linear bar with percentage label). */

export type ProgressMeterProps = HTMLAttributes<HTMLDivElement> & {
  value: number; // 0-100
  label?: string;
  showValue?: boolean;
};

export function ProgressMeter({
  value,
  label = "Progress",
  showValue = true,
  className = "",
  ...rest
}: ProgressMeterProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={`progress-meter w-full ${className}`} {...rest}>
      <div className="mb-1.5 flex items-baseline justify-between font-sans text-[11px] font-medium">
        <span className="text-hull-100">{label}</span>
        {showValue && (
          <span className="text-white">
            <span className="font-bold text-ember-300">{clamped}%</span>
          </span>
        )}
      </div>
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className="h-3 w-full overflow-hidden rounded-[var(--radius-capsule)] border-2 border-ember-200/60 bg-hull-50/30"
      >
        <div
          className="h-full rounded-[var(--radius-capsule)] bg-gradient-to-r from-ember-500 via-ember-400 to-solar-400 motion-safe:transition-[width] motion-safe:duration-500"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
