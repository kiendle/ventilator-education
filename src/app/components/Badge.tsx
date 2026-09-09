import type { HTMLAttributes, ReactNode } from 'react'

/* Warm type labels and orange rewards share the application's illustrated palette. */
type BadgeTone = 'streak' | 'points' | 'quiz' | 'video' | 'reading' | 'neutral'

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone
  icon?: ReactNode
  children: ReactNode
}

const neutralTone = 'border border-hull-300 bg-hull-100 text-space-800'

const tones: Record<BadgeTone, string> = {
  streak: 'border border-ember-300 bg-ember-100 text-ember-700',
  points: 'border border-ember-300 bg-pastel-peach text-space-950',
  quiz: 'border border-ember-300 bg-pastel-peach text-space-950',
  video: 'border border-ember-300 bg-pastel-peach text-space-950',
  reading: 'border border-ember-300 bg-ember-100 text-ember-700',
  neutral: neutralTone,
}

export function Badge({ tone = 'neutral', icon, children, className = '', ...rest }: BadgeProps) {
  return (
    <span
      data-tone={tone}
      className={`inline-flex min-h-7 items-center gap-1.5 rounded-[var(--radius-capsule)] px-3 py-1 font-sans text-xs font-semibold leading-4 ${tones[tone]} ${className}`}
      {...rest}
    >
      {icon && (
        <span className="grid size-4 shrink-0 place-items-center" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </span>
  )
}
