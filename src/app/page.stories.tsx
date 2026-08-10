import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import Home from './page'

const meta = {
  title: 'Application/Home',
  component: Home,
  parameters: {
    docs: {
      description: {
        component:
          'Productionized mobile dashboard composed from the Figma home frame "iPhone 17 - 11" (193:661): full-bleed planet map, HUD stats, profile/points treatment, progress pills and track, feedback FAB and capsule bottom navigation.',
      },
    },
  },
} satisfies Meta<typeof Home>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
