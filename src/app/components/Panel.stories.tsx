import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Panel, ActivityCard } from "./Panel";
import { PlayIcon, BookIcon, QuizIcon } from "./icons";

const meta = {
  title: "Design System/Cards & Containers",
  component: Panel,
  args: { children: "Panel" },
  parameters: {
    docs: {
      description: {
        component:
          "Containers and cards: HUD panel (Figma 193:692 slate gradient), light surface pill (193:664-667), and the ember activity card (Shared Components 206:69-71).",
      },
    },
  },
} satisfies Meta<typeof Panel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HudPanel: Story = {
  args: { variant: "hud" },
  render: (args) => (
    <div className="bg-space-900 p-6">
      <Panel {...args} className="max-w-sm p-4">
        <p className="text-sm text-hull-100">
          HUD panel — slate gradient <code>#1E293B → #0F172A</code>, border <code>#334155</code>, radius 14px.
        </p>
      </Panel>
    </div>
  ),
};

export const SurfacePanel: Story = {
  args: { variant: "surface" },
  render: (args) => (
    <div className="bg-space-900 p-6">
      <Panel {...args} className="max-w-sm p-4">
        <p className="text-sm">Surface panel — light capsule treatment from the status pills.</p>
      </Panel>
    </div>
  ),
};

export const ActivityCards: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-3 bg-space-900 p-6">
      <ActivityCard
        title="ARDS pathophysiology overview"
        points={25}
        minutes={12}
        completed
        icon={<PlayIcon className="size-4" />}
      />
      <ActivityCard
        title="Ventilator settings reference card"
        points={15}
        minutes={8}
        icon={<BookIcon className="size-4" />}
      />
      <ActivityCard
        title="PEEP and recruitment checkpoints"
        points={15}
        minutes={8}
        icon={<QuizIcon className="size-4" />}
      />
    </div>
  ),
};
