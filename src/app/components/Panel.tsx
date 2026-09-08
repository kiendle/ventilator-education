import type { HTMLAttributes, ReactNode } from 'react'

type PanelVariant = 'hud' | 'surface' | 'outline'

export type PanelProps = HTMLAttributes<HTMLDivElement> & {
  variant?: PanelVariant
  children: ReactNode
}

const variants: Record<PanelVariant, string> = {
  hud: 'pastel-card rounded-[var(--radius-panel)] border-2 border-ember-200 bg-pastel-cream text-space-950 shadow-[0_6px_0_#d87b01,0_14px_28px_rgb(2_13_24_/_0.16)]',
  surface:
    'pastel-card rounded-[var(--radius-panel)] border-2 border-ember-200 bg-hull-50 text-space-950 shadow-[0_4px_0_#d87b01]',
  outline:
    'pastel-card rounded-[var(--radius-panel)] border-2 border-aqua-400/60 bg-pastel-mint text-space-950 shadow-[0_5px_0_#5faea8]',
}

export function Panel({ variant = 'hud', children, className = '', ...rest }: PanelProps) {
  return (
    <div className={`${variants[variant]} ${className}`} {...rest}>
      {children}
    </div>
  )
}

/* Activity card — Figma Shared Components 206:69-71, 206:85.
   Ember face (#FD9610) over darker edge (#D87B01), r=16, with icon tile,
   title, PEEP points and duration metadata. */
export type ActivityCardProps = HTMLAttributes<HTMLDivElement> & {
  title: string
  points: number
  minutes: number
  completed?: boolean
  unavailable?: boolean
  icon?: ReactNode
}

export function ActivityCard({
  title,
  points,
  minutes,
  completed = false,
  unavailable = false,
  icon,
  className = '',
  ...rest
}: ActivityCardProps) {
  return (
    <div
      className={`raise relative rounded-[var(--radius-card)] border-2 p-3 pr-4 ${
        unavailable
          ? 'border-hull-400 bg-hull-300 text-space-700 shadow-[0_5px_0_#6e6e6e]'
          : completed
            ? 'border-signal-success bg-pastel-mint text-space-950 shadow-[0_5px_0_#5faea8]'
            : 'border-ember-200 bg-pastel-peach text-space-950 shadow-[0_5px_0_#d87b01]'
      } ${className}`}
      {...rest}
    >
      <div className="flex items-center gap-3">
        <span
          className={`grid size-9 shrink-0 place-items-center rounded-[var(--radius-icon)] border-2 ${
            unavailable
              ? 'border-hull-500/30 bg-hull-200 text-space-700'
              : 'border-space-900/10 bg-pastel-mint text-space-900'
          }`}
          aria-hidden="true"
        >
          {icon ?? '▶'}
        </span>
        <span className="min-w-0 flex-1 truncate font-mono text-sm font-bold">{title}</span>
        <span className="flex shrink-0 flex-col items-end font-mono text-[10px] font-bold leading-tight">
          <span className={unavailable ? 'text-space-700' : 'text-space-900'}>+{points} PEEP</span>
          <span className={unavailable ? 'text-hull-500' : 'text-ember-700'}>~{minutes} min</span>
        </span>
      </div>
      {completed && !unavailable && (
        <span
          className="absolute -right-1.5 -top-1.5 grid size-6 place-items-center rounded-full border-2 border-pastel-cream bg-signal-success text-xs font-extrabold text-space-950 shadow-[0_2px_0_rgb(2_13_24_/_0.22)]"
          aria-label="Completed"
        >
          ✓
        </span>
      )}
    </div>
  )
}
