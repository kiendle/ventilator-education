"use client";

import { useState } from "react";
import { HomeIcon, UserIcon, SettingsIcon } from "./icons";

/* Bottom navigation — Figma menu component 321:117 and "iPhone 17 - 11"
   (193:663-680). Cream capsule (#FFEAB8), rounded tab highlights
   (#FFD87D / active #FFB14B), orange icon + lowercase mono labels. */

export type NavItem = {
  id: string;
  label: string;
  icon: "home" | "profile" | "settings";
};

const iconMap = {
  home: HomeIcon,
  profile: UserIcon,
  settings: SettingsIcon,
} as const;

export const defaultNavItems: NavItem[] = [
  { id: "home", label: "homepage", icon: "home" },
  { id: "profile", label: "profile", icon: "profile" },
  { id: "settings", label: "settings", icon: "settings" },
];

export type BottomNavProps = {
  items?: NavItem[];
  activeId?: string;
  onNavigate?: (id: string) => void;
};

export function BottomNav({ items = defaultNavItems, activeId, onNavigate }: BottomNavProps) {
  const [internal, setInternal] = useState(activeId ?? items[0]?.id);
  const active = activeId ?? internal;

  return (
    <nav
      aria-label="Primary"
      className="mx-auto w-fit max-w-full rounded-[var(--radius-capsule)] bg-ember-100 px-2 py-1.5 shadow-[var(--shadow-panel)]"
    >
      <ul className="flex items-center gap-1">
        {items.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = item.id === active;
          return (
            <li key={item.id}>
              <button
                type="button"
                aria-current={isActive ? "page" : undefined}
                onClick={() => {
                  setInternal(item.id);
                  onNavigate?.(item.id);
                }}
                className={`flex flex-col items-center gap-0.5 rounded-[var(--radius-capsule)] px-3.5 py-1.5 font-mono text-[9px] font-bold lowercase ${
                  isActive ? "bg-ember-300 text-hull-900" : "bg-solar-300/60 text-hull-900 hover:bg-solar-300"
                }`}
              >
                <Icon className="size-4" />
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
