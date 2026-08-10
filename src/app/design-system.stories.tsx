import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/* Design-language reference inventory. Every swatch/ramp value is grounded in
   the Figma file "Ventilator Education App" (see globals.css header for the
   node-by-node evidence). */

function Foundations({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-space-900 p-6 text-hull-100">{children}</div>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-ember-300">{children}</h2>;
}

const meta = {
  title: "Design System/Foundations",
  parameters: {
    docs: {
      description: {
        component:
          "Token inventory: colors, typography, spacing, radii and shadows extracted from the Figma sections Shared Components, System and Dashboard (home frame iPhone 17 - 11).",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const ramps: { name: string; note: string; swatches: [string, string][] }[] = [
  {
    name: "Space (surfaces)",
    note: "map background #00253F, HUD gradient #1E293B→#0F172A, border #334155",
    swatches: [
      ["space-950", "#020D18"],
      ["space-900", "#00253F"],
      ["space-800", "#0F172A"],
      ["space-700", "#1E293B"],
      ["space-600", "#334155"],
    ],
  },
  {
    name: "Ember (primary / island)",
    note: "button #FF7400 on #A74C00, cards #FD9610 on #D87B01, nav active #FF9318",
    swatches: [
      ["ember-700", "#A74C00"],
      ["ember-600", "#D87B01"],
      ["ember-500", "#FF7400"],
      ["ember-400", "#FD9610"],
      ["ember-300", "#FF9318"],
      ["ember-200", "#FED59F"],
      ["ember-100", "#FFEAB8"],
    ],
  },
  {
    name: "Solar (streaks & highlights)",
    note: "quiz tile #FFCC00, island path #F1C049, nav tabs #FFD87D, streak #FDBA74",
    swatches: [
      ["solar-500", "#FFCC00"],
      ["solar-400", "#F1C049"],
      ["solar-300", "#FFD87D"],
      ["solar-200", "#FDBA74"],
    ],
  },
  {
    name: "Nebula (HUD / feedback)",
    note: "avatar #818CF8→#4F46E5, feedback FAB #6366F1→#4338CA, border #A5B4FC",
    swatches: [
      ["nebula-600", "#4338CA"],
      ["nebula-500", "#4F46E5"],
      ["nebula-400", "#6366F1"],
      ["nebula-300", "#818CF8"],
      ["nebula-200", "#A5B4FC"],
    ],
  },
  {
    name: "Signal (feedback)",
    note: "video tile #FB6F6F plus success/info for toasts",
    swatches: [
      ["danger", "#FB6F6F"],
      ["success", "#4ADE80"],
      ["info", "#38BDF8"],
    ],
  },
  {
    name: "Hull (neutrals)",
    note: "home-frame pills #F8F8F8/#E6E6E6/#D9D9D9/#CCCCCC/#B5B0B0/#676666, ink #1E1E1E / #1D1B20, muted #89738A",
    swatches: [
      ["hull-50", "#F8F8F8"],
      ["hull-100", "#F1F5F9"],
      ["hull-200", "#E6E6E6"],
      ["hull-300", "#D9D9D9"],
      ["hull-350", "#CCCCCC"],
      ["hull-400", "#B5B0B0"],
      ["hull-500", "#868686"],
      ["hull-600", "#676666"],
      ["hull-700", "#89738A"],
      ["hull-900", "#1E1E1E"],
      ["ink", "#1D1B20"],
    ],
  },
  {
    name: "Warm (home highlight)",
    note: "warm accent visible on home frame 193:661 — streaks and glow",
    swatches: [["warm", "#FFAF6D"]],
  },
];

export const Colors: Story = {
  render: () => (
    <Foundations>
      <SectionTitle>Color ramps</SectionTitle>
      <div className="flex flex-col gap-6">
        {ramps.map((ramp) => (
          <div key={ramp.name}>
            <p className="mb-1 text-sm font-bold">{ramp.name}</p>
            <p className="mb-2 text-xs text-hull-400">{ramp.note}</p>
            <div className="flex flex-wrap gap-2">
              {ramp.swatches.map(([name, hex]) => (
                <div key={name} className="w-24">
                  <div
                    className="h-12 rounded-[var(--radius-icon)] border border-white/10"
                    style={{ backgroundColor: hex }}
                  />
                  <p className="mt-1 font-mono text-[10px] font-bold">{name}</p>
                  <p className="font-mono text-[10px] text-hull-400">{hex}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Foundations>
  ),
};

export const Typography: Story = {
  render: () => (
    <Foundations>
      <SectionTitle>Typography</SectionTitle>
      <div className="flex max-w-md flex-col gap-5">
        <div>
          <p className="text-[15px] font-extrabold text-white">PEEP points value — Inter/Geist 800, 15px (193:704)</p>
          <p className="text-[13px] font-bold text-hull-100">learner_nurse — username, 700, 13px (193:697)</p>
          <p className="text-[11px] font-semibold text-solar-200">12-day streak — 600, 11px (193:700)</p>
          <p className="text-[11px] font-medium text-white">Progress: 75% — Instrument Sans 500, 11px (193:668)</p>
          <p className="text-[9px] text-hull-200">PEEP Points — caption 400, 9px (193:706)</p>
        </div>
        <div className="font-mono font-bold">
          <p className="text-sm text-white">Prone positioning basics — Cascadia Mono 700 (206:69)</p>
          <p className="text-xs text-white">Mark complete — button label 700, 12px (236:334)</p>
          <p className="text-[11px] text-white">3/6 · 7 · 120 — HUD stats 700, 10-11px (317:616)</p>
          <p className="text-[9px] lowercase text-ember-400">homepage · profile · settings — nav labels 700, 8-9px (321:117)</p>
        </div>
      </div>
    </Foundations>
  ),
};

export const Spacing: Story = {
  render: () => (
    <Foundations>
      <SectionTitle>Spacing rhythm</SectionTitle>
      <div className="flex flex-col gap-3">
        {[4, 8, 12, 16, 20, 24, 32].map((px) => (
          <div key={px} className="flex items-center gap-3">
            <span className="w-14 font-mono text-[10px] text-hull-400">{px}px</span>
            <span className="block h-3 rounded-sm bg-ember-500" style={{ width: px }} />
          </div>
        ))}
        <p className="mt-2 max-w-md text-xs text-hull-400">
          4px base rhythm; 12-16px card padding (206:69), ~20px side gutters and 24px section gaps measured on the
          375-402px frames (59:13, 193:656).
        </p>
      </div>
    </Foundations>
  ),
};

export const RadiiAndShadows: Story = {
  render: () => (
    <Foundations>
      <SectionTitle>Shapes, radii & shadows</SectionTitle>
      <div className="flex flex-wrap items-end gap-6">
        {[
          ["chip 7px", "rounded-[var(--radius-chip)]", "PEEP chip 193:702"],
          ["icon 10px", "rounded-[var(--radius-icon)]", "avatar / badge tile"],
          ["button 12px", "rounded-[var(--radius-button)]", "button 236:334"],
          ["panel 14px", "rounded-[var(--radius-panel)]", "HUD 193:692"],
          ["card 16px", "rounded-[var(--radius-card)]", "activity cards"],
          ["capsule 60px", "rounded-[var(--radius-capsule)]", "bottom nav 320:106"],
        ].map(([label, cls, note]) => (
          <div key={label} className="flex flex-col items-center gap-2">
            <div className={`size-16 border border-ember-400/50 bg-space-700 ${cls}`} />
            <p className="font-mono text-[10px] font-bold">{label}</p>
            <p className="font-mono text-[9px] text-hull-400">{note}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-8">
        <div className="flex flex-col items-center gap-3">
          <div className="grid h-12 w-32 place-items-center rounded-[var(--radius-button)] bg-ember-500 font-mono text-xs font-bold text-white shadow-[var(--shadow-raise-ember)]">
            raise-ember
          </div>
          <p className="font-mono text-[9px] text-hull-400">0 4px 0 #A74C00</p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="grid h-12 w-32 place-items-center rounded-[var(--radius-card)] bg-ember-400 font-mono text-xs font-bold text-white shadow-[var(--shadow-raise-card)]">
            raise-card
          </div>
          <p className="font-mono text-[9px] text-hull-400">0 4px 0 #D87B01</p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="grid h-12 w-32 place-items-center rounded-[var(--radius-panel)] border border-space-600 bg-gradient-to-b from-space-700 to-space-800 font-mono text-xs font-bold text-white shadow-[var(--shadow-panel)]">
            panel
          </div>
          <p className="font-mono text-[9px] text-hull-400">soft drop, space-950/55</p>
        </div>
      </div>
    </Foundations>
  ),
};
