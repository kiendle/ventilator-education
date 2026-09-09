import type { HTMLAttributes, ReactNode } from 'react'
import { BoxIcon, CheckIcon } from './icons'

type PanelVariant = 'hud' | 'surface' | 'outline'

export type PanelProps = HTMLAttributes<HTMLDivElement> & {
  variant?: PanelVariant
  children: ReactNode
}

const variants: Record<PanelVariant, string> = {
  hud: 'learning-surface rounded-[var(--radius-card)] border-2 border-ember-200 bg-pastel-cream text-space-950 shadow-[var(--shadow-panel)]',
  surface:
    'learning-surface rounded-[var(--radius-card)] border-2 border-ember-200 bg-hull-50 text-space-950 shadow-[var(--shadow-card)]',
  outline:
    'learning-surface rounded-[var(--radius-card)] border-2 border-ember-300 bg-pastel-peach text-space-950 shadow-[var(--shadow-raise-card)]',
}

export function Panel({ variant = 'hud', children, className = '', ...rest }: PanelProps) {
  return (
    <div className={`${variants[variant]} ${className}`} {...rest}>
      {children}
    </div>
  )
}

/* Activity card keeps title hierarchy intact while exposing type, points, duration, and state. */
export type ActivityCardProps = HTMLAttributes<HTMLDivElement> & {
  title: string
  kind?: string
  points: number
  minutes: number
  completed?: boolean
  unavailable?: boolean
  icon?: ReactNode
}

export function ActivityCard({
  title,
  kind,
  points,
  minutes,
  completed = false,
  unavailable = false,
  icon,
  className = '',
  ...rest
}: ActivityCardProps) {
  const isCompleted = completed && !unavailable

  return (
    <div
      className={`raise relative rounded-[var(--radius-card)] border p-4 ${
        unavailable
          ? 'border-hull-300 bg-hull-100 text-hull-600 shadow-none'
          : isCompleted
            ? 'learning-surface border-signal-success/60 bg-hull-50 text-space-950 shadow-[var(--shadow-card)]'
            : 'border-hull-200 bg-hull-50 text-space-950 shadow-[var(--shadow-card)]'
      } ${className}`}
      {...rest}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-1 grid size-10 shrink-0 place-items-center rounded-[var(--radius-icon)] border ${
            unavailable
              ? 'border-hull-300 bg-hull-200 text-hull-600'
              : isCompleted
                ? 'border-signal-success/30 bg-signal-success/10 text-signal-success'
                : 'border-ember-200 bg-ember-100 text-ember-700'
          }`}
          aria-hidden="true"
        >
          {icon ?? <BoxIcon className="size-4" />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="break-words text-sm font-semibold leading-5">{title}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-xs font-medium leading-4">
            {kind && <span className="capitalize text-space-700">{kind}</span>}
            <span className="font-mono tabular-nums text-space-800">+{points} PEEP</span>
            <span className="font-mono tabular-nums text-hull-600">{minutes} min</span>
          </div>
          {isCompleted && (
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-signal-success">
              <CheckIcon className="size-3.5" />
              Completed
            </span>
          )}
          {unavailable && (
            <span className="mt-2 inline-flex items-center text-xs font-semibold text-hull-600">
              Unavailable
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
