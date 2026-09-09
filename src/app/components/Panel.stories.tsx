import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Panel, ActivityCard } from './Panel'
import { PlayIcon, BookIcon, QuizIcon } from './icons'

const meta = {
  title: 'Design System/Cards & Containers',
  component: Panel,
  args: { children: 'Panel' },
  parameters: {
    docs: {
      description: {
        component:
          'Quiet reading surfaces and activity cards with wrapping titles, explicit activity types, and readable duration/reward metadata. Completed and unavailable states remain distinguishable without relying on color.',
      },
    },
  },
} satisfies Meta<typeof Panel>

export default meta
type Story = StoryObj<typeof meta>

export const HudPanel: Story = {
  args: { variant: 'hud' },
  render: (args) => (
    <div className="bg-space-900 p-6">
      <Panel {...args} className="max-w-sm p-4">
        <p className="text-sm text-hull-100">
          A calm learning surface with readable text, a consistent 16px radius, and restrained
          elevation.
        </p>
      </Panel>
    </div>
  ),
}

export const SurfacePanel: Story = {
  args: { variant: 'surface' },
  render: (args) => (
    <div className="bg-space-900 p-6">
      <Panel {...args} className="max-w-sm p-4">
        <p className="text-sm">
          A neutral surface keeps attention on the lesson rather than its container.
        </p>
      </Panel>
    </div>
  ),
}

export const ActivityCards: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-3 bg-space-900 p-6">
      <ActivityCard
        title="ARDS pathophysiology overview"
        kind="Video"
        points={25}
        minutes={12}
        completed
        icon={<PlayIcon className="size-4" />}
      />
      <ActivityCard
        title="Ventilator settings reference card"
        kind="Reading"
        points={15}
        minutes={8}
        icon={<BookIcon className="size-4" />}
      />
      <ActivityCard
        title="PEEP and recruitment checkpoints"
        kind="Quiz"
        points={15}
        minutes={8}
        icon={<QuizIcon className="size-4" />}
      />
      <ActivityCard
        title="Non-invasive Ventilation Monitoring (TCOM vs EtCO2)"
        kind="Ordering"
        points={3}
        minutes={10}
        unavailable
        icon={<QuizIcon className="size-4" />}
      />
    </div>
  ),
}
