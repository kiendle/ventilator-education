import type { HTMLAttributes, ReactNode } from "react";

/* Badge — Figma Shared Components Frame 4 (type icons per activity type)
   and Gamification HUD streak/points chips (236:356 HUD group). */

type BadgeTone = "streak" | "points" | "quiz" | "video" | "reading" | "neutral";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
  icon?: ReactNode;
  children: ReactNode;
};

const tones: Record<BadgeTone, string> = {
  streak: "border-2 border-ember-200 bg-pastel-cream text-ember-700",
  points: "border-2 border-nebula-200 bg-pastel-lilac text-space-900",
  quiz: "border-2 border-solar-400 bg-solar-300 text-space-900",
  video: "border-2 border-signal-danger/40 bg-[#ffd0c8] text-space-900",
  reading: "border-2 border-nebula-200 bg-pastel-lilac text-space-900",
  neutral: "border-2 border-aqua-400/40 bg-pastel-mint text-space-900",
};

export function Badge({ tone = "neutral", icon, children, className = "", ...rest }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[var(--radius-capsule)] px-2.5 py-1 font-mono text-[11px] font-bold leading-none ${tones[tone]} ${className}`}
      {...rest}
    >
      {icon && (
        <span className="grid size-3.5 place-items-center" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </span>
  );
}
