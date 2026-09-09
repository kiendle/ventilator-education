import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { AppFlow, APP_SCREENS } from '../components/AppFlow'
import type { AppScreen } from '../components/AppFlow'
import { curriculumDatabase } from '@/data/curriculum'

/* Named screen stories — one per state in the shared contract, so every
   learner, researcher, and system screen can be inspected directly. */

const meta = {
  title: 'Application/Screens',
  component: AppFlow,
  render: (args, { id }) => <AppFlow key={`${id}:${args.initialScreen}`} {...args} />,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Every required screen and state from the shared contract, addressable by name: enrollment (welcome, login, register, enroll, mission intro, avatar), core path (dashboard, island, activity renderers, completion), final-exam states, profile/settings, offline/install, researcher view, and access denied.',
      },
    },
  },
} satisfies Meta<typeof AppFlow>

export default meta
type Story = StoryObj<typeof meta>

const screenStory = (screen: AppScreen): Story => ({
  args: { islands: curriculumDatabase.islands, initialScreen: screen, showScreenPicker: false },
})

// Enrollment & onboarding
export const Welcome: Story = screenStory('welcome')
export const Login: Story = screenStory('login')
export const Register: Story = screenStory('register')
export const Enroll: Story = screenStory('enroll')
export const MissionIntro: Story = screenStory('mission')
export const AvatarSelect: Story = screenStory('avatar')

// Core learner path
export const Dashboard: Story = screenStory('dashboard')
export const Island: Story = screenStory('island')
export const ReadingActivity: Story = screenStory('lessonReading')
export const VideoActivity: Story = screenStory('lessonVideo')
export const VentLab: Story = screenStory('ventSim')
export const QuizMcq: Story = screenStory('quiz')
export const QuizFeedback: Story = screenStory('quizFeedback')
export const QuizMatching: Story = screenStory('quizMatch')
export const QuizDragDrop: Story = screenStory('quizDrag')
export const QuizFillBlank: Story = screenStory('quizFill')
export const CaseVignette: Story = screenStory('caseVignette')
export const Quest: Story = screenStory('quest')
export const ActivityComplete: Story = {
  ...screenStory('island'),
  parameters: {
    docs: {
      description: {
        story:
          'Earns the completion state through a real approved reading and its confirmation question. No fabricated reward or progress fixture.',
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const reading = curriculumDatabase.islands[0].activities.find(
      (activity) => activity.type === 'reading' && activity.contentStatus === 'ready'
    )
    if (!reading || reading.type !== 'reading' || !reading.content) {
      throw new Error('An approved reading is required for the completion story.')
    }
    const question = reading.content.confirmationQuestion
    const answer = question.choices.find((choice) => choice.id === question.answer.correctChoiceId)
    if (!answer) throw new Error('The approved reading must define a confirmation answer.')

    await step('Complete an approved reading', async () => {
      await userEvent.click(
        await canvas.findByRole('button', {
          name: `${reading.title}, reading, ${reading.peepPointsValue} PEEP points`,
        })
      )
      await userEvent.click(await canvas.findByRole('button', { name: answer.text }))
      await userEvent.click(canvas.getByRole('button', { name: /Check understanding/ }))
    })
    await step('Show earned progress and the next action', async () => {
      await waitFor(() =>
        expect(canvas.getByRole('heading', { name: 'Activity complete' })).toBeVisible()
      )
    })
  },
}
export const IslandComplete: Story = screenStory('islandComplete')

// Final exam states
export const FinalExamIntro: Story = screenStory('finalExamIntro')
export const FinalExamQuestion: Story = screenStory('finalExamQuestion')
export const ExamResults: Story = screenStory('examResults')
export const CourseComplete: Story = screenStory('courseComplete')

// Account & system
export const Profile: Story = screenStory('profile')
export const Settings: Story = screenStory('settings')
export const OfflineInstall: Story = screenStory('offline')
export const Researcher: Story = screenStory('researcher')
export const AccessDenied: Story = screenStory('accessDenied')

/* Sanity: the named stories above must cover the whole screen contract. */
const covered = new Set<AppScreen>([
  'welcome',
  'login',
  'register',
  'enroll',
  'mission',
  'avatar',
  'dashboard',
  'island',
  'lessonReading',
  'lessonVideo',
  'ventSim',
  'quiz',
  'quizFeedback',
  'quizMatch',
  'quizDrag',
  'quizFill',
  'caseVignette',
  'quest',
  'activityComplete',
  'islandComplete',
  'finalExamIntro',
  'finalExamQuestion',
  'examResults',
  'courseComplete',
  'profile',
  'settings',
  'researcher',
  'offline',
  'accessDenied',
])
for (const s of APP_SCREENS) {
  if (!covered.has(s)) throw new Error(`Screen "${s}" is missing a named story`)
}
