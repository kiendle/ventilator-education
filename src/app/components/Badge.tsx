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
  streak: "bg-space-700/80 text-warm border border-warm/40", // #FFAF6D warm streak (home 193:661) / #FDBA74 (193:700)
  points: "bg-space-700/80 text-white border border-nebula-300/40",
  quiz: "bg-solar-500 text-hull-900", // #FFCC00 quiz tile
  video: "bg-signal-danger text-white", // #FB6F6F video tile
  reading: "bg-nebula-400 text-white",
  neutral: "bg-hull-200 text-hull-900",
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
