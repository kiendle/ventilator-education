import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./Button";

const meta = {
  title: "Design System/Buttons",
  component: Button,
  args: { children: "Mark complete" },
  parameters: {
    docs: {
      description: {
        component:
          "Button variants and states, from Figma component 236:334 (raised #FF7400 face on #A74C00 underside, r=12, mono bold label) plus the nebula feedback action (193:707).",
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = { args: { variant: "secondary" } };

export const Nebula: Story = { args: { variant: "nebula", children: "Send feedback" } };

export const Disabled: Story = { args: { disabled: true } };

export const Loading: Story = { args: { loading: true } };

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4 bg-space-900 p-6">
      <Button>Mark complete</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="nebula">Feedback</Button>
      <Button disabled>Disabled</Button>
      <Button loading>Loading</Button>
    </div>
  ),
};
