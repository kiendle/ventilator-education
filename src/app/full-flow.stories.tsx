import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AppFlow } from './components/AppFlow'
import { curriculumDatabase } from '@/data/curriculum'

const meta = {
  title: 'Application/Full Flow',
  component: AppFlow,
  render: (args, { id }) => <AppFlow key={`${id}:${args.initialScreen}`} {...args} />,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Interactive Storybook preview of enrollment, learning activities, completion feedback, and account/system screens. Uses the approved curriculum; in-memory demo state resets on reload. Final assessments remain unavailable where no approved question bank exists.',
      },
    },
  },
} satisfies Meta<typeof AppFlow>

export default meta
type Story = StoryObj<typeof meta>

export const FullFlow: Story = {
  args: { islands: curriculumDatabase.islands, initialScreen: 'welcome', showScreenPicker: false },
}

export const ScreenCatalog: Story = {
  args: { islands: curriculumDatabase.islands, initialScreen: 'dashboard', showScreenPicker: true },
}

export const ResearcherView: Story = {
  args: {
    islands: curriculumDatabase.islands,
    initialScreen: 'researcher',
    showScreenPicker: false,
  },
}
