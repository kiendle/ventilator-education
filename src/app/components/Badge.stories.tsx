import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Badge } from './Badge'
import { ProgressMeter } from './ProgressMeter'
import { FlameIcon, StarIcon, PlayIcon, BookIcon, QuizIcon } from './icons'

const meta = {
  title: 'Design System/Badges & Progress',
  component: Badge,
  args: { children: 'Badge' },
  parameters: {
    docs: {
      description: {
        component:
          'Activity type labels share a neutral treatment; orange identifies points and progress. Green and red are reserved for meaningful outcome feedback.',
      },
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const TypeBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 bg-space-900 p-6">
      <Badge tone="quiz" icon={<QuizIcon className="size-3" />}>
        Quiz
      </Badge>
      <Badge tone="video" icon={<PlayIcon className="size-3" />}>
        Video
      </Badge>
      <Badge tone="reading" icon={<BookIcon className="size-3" />}>
        Reading
      </Badge>
      <Badge tone="streak" icon={<FlameIcon className="size-3" />}>
        7-day streak
      </Badge>
      <Badge tone="points" icon={<StarIcon className="size-3" />}>
        120 PEEP
      </Badge>
    </div>
  ),
}

export const ProgressStates: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-5 bg-space-900 p-6">
      <ProgressMeter label="Island progress" value={0} />
      <ProgressMeter label="Island progress" value={45} />
      <ProgressMeter label="Progress" value={75} />
      <ProgressMeter label="Curriculum complete" value={100} />
    </div>
  ),
}

export const FeedbackChips: Story = {
  render: () => (
    <div
      className="flex max-w-sm flex-col gap-2 bg-space-900 p-6"
      role="status"
      aria-label="Feedback examples"
    >
      <p className="rounded-[var(--radius-panel)] border border-signal-success/50 bg-signal-success/15 px-3 py-2 text-xs text-signal-success">
        Activity complete. Your progress has been updated.
      </p>
      <p className="rounded-[var(--radius-panel)] border border-signal-danger/50 bg-signal-danger/15 px-3 py-2 text-xs text-signal-danger">
        Not quite. Review the explanation, then try again.
      </p>
      <p className="rounded-[var(--radius-panel)] border border-signal-info/50 bg-signal-info/15 px-3 py-2 text-xs text-signal-info">
        This activity is awaiting approved content. Choose an available lesson.
      </p>
    </div>
  ),
}
