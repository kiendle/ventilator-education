import type { HTMLAttributes, ReactNode } from "react";
import { Badge } from "./Badge";
import { FlameIcon, StarIcon, MapIcon } from "./icons";

/* Gamification HUD — Figma 193:692 (avatar / username / streak / PEEP points)
   and the compact stat row from home frame 236:356 ("3/6", flame "7", star "120"). */

export type HudProfileProps = HTMLAttributes<HTMLDivElement> & {
  username: string;
  streakDays: number;
  points: number;
};

export function HudProfile({ username, streakDays, points, className = "", ...rest }: HudProfileProps) {
  return (
    <div
      className={`flex items-center gap-3 rounded-[var(--radius-panel)] border-2 border-ember-200 bg-pastel-cream p-3 text-space-950 shadow-[0_5px_0_#d87b01,0_12px_24px_rgb(2_13_24_/_0.18)] ${className}`}
      {...rest}
    >
      {/* Avatar — indigo gradient tile 193:693 */}
      <span
        className="grid size-10 shrink-0 place-items-center rounded-[var(--radius-icon)] border-2 border-aqua-400/50 bg-pastel-mint font-sans text-[10px] font-bold text-space-900"
        aria-hidden="true"
      >
        {username.slice(0, 2).toUpperCase()}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-bold text-space-900">{username}</span>
        <Badge tone="streak" icon={<FlameIcon className="size-3" />} className="mt-1">
          {streakDays}-day streak
        </Badge>
      </span>
      {/* PEEP points chip 193:702 */}
      <span className="shrink-0 rounded-[var(--radius-chip)] border-2 border-ember-200 bg-pastel-peach px-3 py-1.5 text-center">
        <span className="block text-[15px] font-extrabold leading-tight text-space-900">
          {points.toLocaleString()}
        </span>
        <span className="block text-[9px] leading-tight text-ember-700">PEEP Points</span>
      </span>
    </div>
  );
}

/* Compact stat chip used in the top HUD of the home frame (236:356) */
export type HudStatProps = HTMLAttributes<HTMLSpanElement> & {
  icon?: "map" | "flame" | "star";
  children: ReactNode;
};

const statIcons = {
  map: MapIcon,
  flame: FlameIcon,
  star: StarIcon,
} as const;

export function HudStat({ icon = "star", children, className = "", ...rest }: HudStatProps) {
  const Icon = statIcons[icon];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[var(--radius-capsule)] border-2 border-ember-200 bg-pastel-cream px-2.5 py-1 font-mono text-[11px] font-bold text-space-900 shadow-[0_2px_0_#d87b01] ${className}`}
      {...rest}
    >
      <Icon className="size-3.5 text-ember-500" />
      {children}
    </span>
  );
}
