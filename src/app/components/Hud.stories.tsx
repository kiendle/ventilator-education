import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HudProfile, HudStat } from "./Hud";
import { BottomNav } from "./BottomNav";

const meta = {
  title: "Design System/HUD & Navigation",
  component: HudProfile,
  args: { username: "learner_nurse", streakDays: 12, points: 2450 },
  parameters: {
    docs: {
      description: {
        component:
          "Gamification HUD (Figma 193:692: indigo avatar, username, streak badge, PEEP points chip), the compact stat row from home frame 236:356, and the cream capsule bottom navigation (menu component 321:117).",
      },
    },
  },
} satisfies Meta<typeof HudProfile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ProfileHud: Story = {
  args: { username: "learner_nurse", streakDays: 12, points: 2450 },
  render: (args) => (
    <div className="max-w-sm bg-space-900 p-6">
      <HudProfile {...args} />
    </div>
  ),
};

export const StatChips: Story = {
  render: () => (
    <div className="flex gap-2 bg-space-900 p-6">
      <HudStat icon="map">3/6</HudStat>
      <HudStat icon="flame">7</HudStat>
      <HudStat icon="star">120</HudStat>
    </div>
  ),
};

export const Navigation: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-6 bg-space-900 p-6">
      <BottomNav activeId="home" />
      <BottomNav activeId="profile" />
      <BottomNav activeId="settings" />
    </div>
  ),
};
