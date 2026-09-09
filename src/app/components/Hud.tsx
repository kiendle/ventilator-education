import type { HTMLAttributes, ReactNode } from 'react'
import { Badge } from './Badge'
import { FlameIcon, StarIcon, MapIcon } from './icons'

/* Compact learner identity and progress stats for the navy application shell. */

export type HudProfileProps = HTMLAttributes<HTMLDivElement> & {
  username: string
  streakDays: number
  points: number
}

export function HudProfile({
  username,
  streakDays,
  points,
  className = '',
  ...rest
}: HudProfileProps) {
  return (
    <div
      className={`grid grid-cols-[4rem_minmax(0,1fr)] items-center gap-3 rounded-[var(--radius-card)] border-2 border-ember-300 bg-pastel-peach p-4 text-space-950 shadow-[var(--shadow-panel)] ${className}`}
      {...rest}
    >
      <span
        className="grid size-16 shrink-0 place-items-center rounded-full border-4 border-pastel-cream bg-space-900 font-sans text-xl font-extrabold text-ember-200 shadow-[var(--shadow-raise-ember)]"
        aria-hidden="true"
      >
        {username.slice(0, 2).toUpperCase()}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block break-words text-xl font-extrabold leading-tight text-space-900">
          {username}
        </span>
        <Badge tone="streak" icon={<FlameIcon className="size-3.5" />} className="mt-2">
          <span className="whitespace-nowrap tabular-nums">{streakDays}-day streak</span>
        </Badge>
      </span>
      <span className="col-span-2 flex items-center justify-between gap-3 rounded-[var(--radius-chip)] border border-ember-200 bg-pastel-cream px-3 py-3">
        <span className="block font-mono text-base font-extrabold leading-5 tabular-nums text-space-900">
          {points.toLocaleString()}
        </span>
        <span className="mt-0.5 block text-xs font-medium leading-4 text-hull-600">
          PEEP Points
        </span>
      </span>
    </div>
  )
}

/* Compact stat chip used in the shell's progress summary. */
export type HudStatProps = HTMLAttributes<HTMLSpanElement> & {
  icon?: 'map' | 'flame' | 'star'
  children: ReactNode
}

const statIcons = {
  map: MapIcon,
  flame: FlameIcon,
  star: StarIcon,
} as const

export function HudStat({ icon = 'star', children, className = '', ...rest }: HudStatProps) {
  const Icon = statIcons[icon]
  return (
    <span
      className={`inline-flex min-h-8 items-center gap-1.5 rounded-[var(--radius-capsule)] border border-space-600 bg-space-800 px-3 py-1 font-mono text-xs font-semibold leading-4 tabular-nums text-hull-100 shadow-[0_1px_3px_rgb(7_21_37_/_0.2)] ${className}`}
      {...rest}
    >
      <Icon className="size-4 text-ember-300" />
      {children}
    </span>
  )
}
