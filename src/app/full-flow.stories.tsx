import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AppFlow } from "./components/AppFlow";
import { curriculumDatabase } from "@/data/curriculum";

const meta = {
  title: "Application/Full Flow",
  component: AppFlow,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Complete GAMER-ICU learner, activity, system, and researcher screen flow. The screen catalog exposes every designed state from the Figma application inventory.",
      },
    },
  },
} satisfies Meta<typeof AppFlow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FullFlow: Story = {
  args: { islands: curriculumDatabase.islands, initialScreen: "welcome", showScreenPicker: false },
};

export const ScreenCatalog: Story = {
  args: { islands: curriculumDatabase.islands, initialScreen: "dashboard", showScreenPicker: true },
};

export const ResearcherView: Story = {
  args: { islands: curriculumDatabase.islands, initialScreen: "researcher", showScreenPicker: false },
};
