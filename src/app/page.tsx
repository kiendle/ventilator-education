import Image from "next/image";
import { Badge } from "./components/Badge";
import { BottomNav } from "./components/BottomNav";
import { HudProfile, HudStat } from "./components/Hud";
import { ProgressMeter } from "./components/ProgressMeter";
import { FlameIcon, MailIcon } from "./components/icons";

/* Productionized home dashboard derived from Figma "Ventilator Education App":
   Dashboard section (193:656) home frame "iPhone 17 - 11" (193:661) — full-bleed
   planet map, "Progress: 75%" / "Unlock in 3 weeks" pills, progress track —
   composed with the home frame HUD stats (236:356: map 3/6, flame 7, star 120),
   the gamification HUD (193:692), bottom navigation capsule (321:117) and the
   nebula feedback FAB (193:707). */

export default function Home() {
  return (
    <main className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden bg-space-900">
      {/* Planet map — exact Figma export (node 193:662) */}
      <Image
        src="/planet-map.png"
        alt="Planet map showing six islands on an orange volcanic world against a dark starfield"
        fill
        priority
        sizes="(max-width: 28rem) 100vw, 28rem"
        className="object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-space-950/70 via-transparent to-space-950/80" aria-hidden="true" />
      <h1 className="sr-only">Ventilator Education learning dashboard</h1>

      <header className="relative z-10 flex flex-col gap-3 px-5 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <HudStat icon="map" aria-label="Islands unlocked: 3 of 6">3/6</HudStat>
          <HudStat icon="flame" aria-label="Current streak: 7 days">7</HudStat>
          <HudStat icon="star" aria-label="Total stars: 120">120</HudStat>
        </div>
        <HudProfile username="learner_nurse" streakDays={7} points={2450} />
      </header>

      <section className="relative z-10 mt-auto flex flex-col gap-3 px-5 pb-28">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge tone="neutral" className="bg-hull-50/90 backdrop-blur-sm">
            Progress: <span className="text-ember-700">75%</span>
          </Badge>
          <Badge tone="neutral" className="bg-hull-50/90 backdrop-blur-sm">
            Unlock in <span className="text-ember-700">3 weeks</span>
          </Badge>
        </div>
        <ProgressMeter label="Island progress" value={75} className="rounded-[var(--radius-panel)] bg-space-950/50 p-3 backdrop-blur-sm" />
        <p className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-hull-200">
          <FlameIcon className="size-3 text-ember-300" />
          Next island: Interlobar Divides — keep the streak going.
        </p>
      </section>

      {/* Feedback FAB — Figma 193:707 */}
      <a
        href="https://forms.gle/feedback"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Send feedback (opens a form in a new tab)"
        className="absolute bottom-24 right-5 z-20 grid size-12 place-items-center rounded-full bg-gradient-to-br from-nebula-400 to-nebula-600 text-white shadow-[var(--shadow-fab)]"
      >
        <MailIcon className="size-5" />
      </a>

      <div className="absolute inset-x-0 bottom-5 z-20">
        <BottomNav />
      </div>
    </main>
  );
}
