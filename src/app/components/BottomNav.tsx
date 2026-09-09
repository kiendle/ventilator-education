'use client'

import { useState } from 'react'
import { HomeIcon, UserIcon, SettingsIcon } from './icons'

/* Primary navigation keeps every destination visible and gives the active route
   one clear orange state against the navy shell. */

export type NavItem = {
  id: string
  label: string
  icon: 'home' | 'profile' | 'settings'
}

const iconMap = {
  home: HomeIcon,
  profile: UserIcon,
  settings: SettingsIcon,
} as const

export const defaultNavItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'profile', label: 'Profile', icon: 'profile' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
]

export type BottomNavProps = {
  items?: NavItem[]
  activeId?: string
  onNavigate?: (id: string) => void
}

export function BottomNav({ items = defaultNavItems, activeId, onNavigate }: BottomNavProps) {
  const [internal, setInternal] = useState(activeId ?? items[0]?.id)
  const active = activeId ?? internal

  return (
    <nav
      aria-label="Primary"
      className="mx-auto w-full max-w-md rounded-[var(--radius-card)] border border-space-600 bg-space-950/95 p-2"
    >
      <ul className="grid grid-flow-col auto-cols-fr gap-1">
        {items.map((item) => {
          const Icon = iconMap[item.icon]
          const isActive = item.id === active
          return (
            <li key={item.id} className="min-w-0">
              <button
                type="button"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => {
                  setInternal(item.id)
                  onNavigate?.(item.id)
                }}
                className={`flex min-h-11 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] px-3 py-2 font-sans text-xs font-semibold leading-4 ${
                  isActive
                    ? 'bg-ember-500 text-space-950 shadow-[var(--shadow-raise-ember)] hover:bg-ember-400'
                    : 'text-hull-300 hover:bg-space-800 hover:text-hull-100'
                }`}
              >
                <Icon className="size-5 shrink-0" />
                <span className="min-w-0 text-center">{item.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
