import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Button } from './Button'

const meta = {
  title: 'Design System/Buttons',
  component: Button,
  args: { children: 'Continue learning' },
  parameters: {
    docs: {
      description: {
        component:
          'One orange primary action, a neutral secondary action, and a quiet low-emphasis action. All variants provide at least 44px touch targets, visible keyboard focus, and explicit disabled/loading states.',
      },
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}

export const Secondary: Story = { args: { variant: 'secondary' } }

export const Quiet: Story = { args: { variant: 'quiet', children: 'View learning map' } }

export const Disabled: Story = { args: { disabled: true } }

export const Loading: Story = { args: { loading: true } }

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4 bg-space-900 p-6">
      <Button>Continue learning</Button>
      <Button variant="secondary">Return to island</Button>
      <Button variant="quiet">View learning map</Button>
      <Button disabled>Choose an answer first</Button>
      <Button loading>Checking answer</Button>
    </div>
  ),
}

export const LongLabel: Story = {
  args: { children: 'Continue to Oxygenation & Mean Airway Pressure' },
  render: (args) => (
    <div className="w-full max-w-xs bg-space-900 p-5">
      <Button {...args} className="w-full" />
    </div>
  ),
}
