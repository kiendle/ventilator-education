import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import Home from './page'

const meta = {
  title: 'Application/Home',
  component: Home,
  parameters: {
    docs: {
      description: {
        component:
          'Learning dashboard with the space-map identity, readable progress statistics, an accessible island list, and consistent Home/Profile/Settings navigation. This story uses in-memory preview state.',
      },
    },
  },
} satisfies Meta<typeof Home>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
