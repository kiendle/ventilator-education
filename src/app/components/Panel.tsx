import type { HTMLAttributes, ReactNode } from "react";

type PanelVariant = "hud" | "surface" | "outline";

export type PanelProps = HTMLAttributes<HTMLDivElement> & {
  variant?: PanelVariant;
  children: ReactNode;
};

const variants: Record<PanelVariant, string> = {
  // Figma HUD container 193:692 — slate gradient, #334155 border, r=14
  hud: "rounded-[var(--radius-panel)] border border-space-600 bg-gradient-to-b from-space-700 to-space-800 shadow-[var(--shadow-panel)] text-hull-100",
  // Light surface capsule (Figma pills 193:664-667)
  surface: "rounded-[var(--radius-panel)] border border-hull-400 bg-hull-50 text-hull-900",
  // Transparent frame with slate hairline
  outline: "rounded-[var(--radius-panel)] border border-space-600 bg-transparent text-hull-100",
};

export function Panel({ variant = "hud", children, className = "", ...rest }: PanelProps) {
  return (
    <div className={`${variants[variant]} ${className}`} {...rest}>
      {children}
    </div>
  );
}

/* Activity card — Figma Shared Components 206:69-71, 206:85.
   Ember face (#FD9610) over darker edge (#D87B01), r=16, with icon tile,
   title, PEEP points and duration metadata. */
export type ActivityCardProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  points: number;
  minutes: number;
  completed?: boolean;
  icon?: ReactNode;
};

export function ActivityCard({
  title,
  points,
  minutes,
  completed = false,
  icon,
  className = "",
  ...rest
}: ActivityCardProps) {
  return (
    <div
      className={`raise relative rounded-[var(--radius-card)] bg-ember-400 p-3 pr-4 text-white shadow-[var(--shadow-raise-card)] ${
        completed ? "" : "saturate-75"
      } ${className}`}
      {...rest}
    >
      <div className="flex items-center gap-3">
        <span
          className="grid size-9 shrink-0 place-items-center rounded-[var(--radius-icon)] bg-solar-500 text-hull-900"
          aria-hidden="true"
        >
          {icon ?? "▶"}
        </span>
        <span className="min-w-0 flex-1 truncate font-mono text-sm font-bold">{title}</span>
        <span className="flex shrink-0 flex-col items-end font-mono text-[10px] font-bold leading-tight">
          <span className="text-hull-100">+{points} PEEP</span>
          <span className="text-ember-200">~{minutes} min</span>
        </span>
      </div>
      {completed && (
        <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-signal-success text-[10px] font-bold text-space-950" aria-label="Completed">
          ✓
        </span>
      )}
    </div>
  );
}
