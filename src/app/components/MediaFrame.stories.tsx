import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { MediaFrame } from './MediaFrame'

const meta = {
  title: 'Design System/Media',
  component: MediaFrame,
  args: {
    src: '/planet-map.png',
    alt: 'Planet map with six islands on an orange volcanic world against a dark space background',
    width: 724,
    height: 1536,
  },
  parameters: {
    docs: {
      description: {
        component:
          'A consistent media frame with a 16px radius, neutral border, dark image backing, and readable optional caption. Space artwork is reserved for orientation rather than lesson backgrounds.',
      },
    },
  },
} satisfies Meta<typeof MediaFrame>

export default meta
type Story = StoryObj<typeof meta>

export const PlanetMap: Story = {
  render: (args) => (
    <div className="max-w-xs bg-space-900 p-6">
      <MediaFrame {...args} />
    </div>
  ),
}

export const WithCaption: Story = {
  args: { caption: 'Island A — Bronchial Bluffs' },
  render: (args) => (
    <div className="max-w-xs bg-space-900 p-6">
      <MediaFrame {...args} />
    </div>
  ),
}
