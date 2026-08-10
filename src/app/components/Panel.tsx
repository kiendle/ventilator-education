import type { HTMLAttributes, ReactNode } from "react";

type PanelVariant = "hud" | "surface" | "outline";

export type PanelProps = HTMLAttributes<HTMLDivElement> & {
  variant?: PanelVariant;
  children: ReactNode;
};

const variants: Record<PanelVariant, string> = {
  hud: "pastel-card rounded-[var(--radius-panel)] border-2 border-ember-200 bg-pastel-cream text-space-950 shadow-[0_6px_0_#d87b01,0_14px_28px_rgb(2_13_24_/_0.16)]",
  surface: "pastel-card rounded-[var(--radius-panel)] border-2 border-ember-200 bg-hull-50 text-space-950 shadow-[0_4px_0_#d87b01]",
  outline: "pastel-card rounded-[var(--radius-panel)] border-2 border-aqua-400/60 bg-pastel-mint text-space-950 shadow-[0_5px_0_#5faea8]",
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
      className={`raise relative rounded-[var(--radius-card)] border-2 border-ember-200 bg-pastel-peach p-3 pr-4 text-space-950 shadow-[0_5px_0_#d87b01] ${
        completed ? "" : "opacity-80"
      } ${className}`}
      {...rest}
    >
      <div className="flex items-center gap-3">
        <span
          className="grid size-9 shrink-0 place-items-center rounded-[var(--radius-icon)] border-2 border-space-900/10 bg-pastel-mint text-space-900"
          aria-hidden="true"
        >
          {icon ?? "▶"}
        </span>
        <span className="min-w-0 flex-1 truncate font-mono text-sm font-bold">{title}</span>
        <span className="flex shrink-0 flex-col items-end font-mono text-[10px] font-bold leading-tight">
          <span className="text-space-900">+{points} PEEP</span>
          <span className="text-ember-700">~{minutes} min</span>
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
