import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import type { ReactNode } from 'react'
import { Button } from './components/Button'
import { Panel } from './components/Panel'
import { ProgressMeter } from './components/ProgressMeter'

function Foundations({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-space-900 px-5 py-8 text-hull-100 sm:p-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">{children}</div>
    </div>
  )
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <h1 className="text-2xl font-bold tracking-tight">{children}</h1>
}

const meta = {
  title: 'Design System/Foundations',
  parameters: {
    docs: {
      description: {
        component:
          'A warm learning system: deep navy surroundings, cream reading surfaces, peach headers, and raised orange actions and selections. Four-pixel spacing rhythm, readable sans-serif type, and touch targets of at least 44px. Color samples use the live CSS tokens rather than a second set of hex values.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const colorGroups = [
  {
    name: 'Learning surfaces',
    note: 'Navy frames the journey. Cream carries the content; peach establishes its identity.',
    tokens: [
      'space-950',
      'space-900',
      'space-800',
      'space-700',
      'space-600',
      'hull-50',
      'hull-100',
      'hull-200',
      'hull-400',
    ],
  },
  {
    name: 'One action accent',
    note: 'Orange signals what to do next, what is selected, and how far you have progressed.',
    tokens: ['ember-700', 'ember-600', 'ember-500', 'ember-400', 'ember-200', 'ember-100'],
  },
  {
    name: 'Outcome signals',
    note: 'Success and error are reserved for feedback, never decorative activity categories.',
    tokens: ['signal-success', 'signal-danger', 'signal-info'],
  },
]

export const Colors: Story = {
  render: () => (
    <Foundations>
      <SectionTitle>Color with a purpose</SectionTitle>
      {colorGroups.map((group) => (
        <section key={group.name}>
          <h2 className="text-lg font-semibold">{group.name}</h2>
          <p className="mb-4 mt-1 text-sm leading-6 text-hull-300">{group.note}</p>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-5">
            {group.tokens.map((token) => (
              <div key={token}>
                <div
                  className="h-16 rounded-[var(--radius-button)] border border-hull-400/30"
                  style={{ backgroundColor: `var(--color-${token})` }}
                />
                <p className="mt-2 break-words font-mono text-xs text-hull-200">{token}</p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </Foundations>
  ),
}

export const Typography: Story = {
  render: () => (
    <Foundations>
      <SectionTitle>Clear at every level</SectionTitle>
      <Panel className="flex flex-col gap-6 p-6">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-space-600">
            Screen title · 24 / 32
          </p>
          <h2 className="text-2xl font-bold leading-8 text-space-950">
            Build confidence, one lesson at a time
          </h2>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-space-600">
            Section title · 18 / 28
          </p>
          <h3 className="text-lg font-semibold leading-7 text-space-950">
            Oxygenation &amp; Mean Airway Pressure
          </h3>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-space-600">
            Reading text · 16 / 28
          </p>
          <p className="text-base leading-7 text-space-800">
            Review the lesson, check your understanding, and return to your island to choose your
            next activity. Instructional titles wrap instead of hiding essential words.
          </p>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-space-600">
            Supporting text · 14 / 24
          </p>
          <p className="text-sm leading-6 text-space-600">Reading · 5 min · 2 PEEP points</p>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-space-600">
            Numbers · tabular
          </p>
          <p className="text-2xl font-bold tabular-nums text-space-950">
            2,450 <span className="text-sm font-medium">PEEP points</span>
          </p>
        </div>
      </Panel>
    </Foundations>
  ),
}

export const Spacing: Story = {
  render: () => (
    <Foundations>
      <SectionTitle>Room to learn</SectionTitle>
      <p className="text-sm leading-6 text-hull-300">
        4px base. Use 8px inside compact groups, 16px inside cards, 24px between sections, and at
        least 20px at screen edges.
      </p>
      <div className="flex flex-col gap-4">
        {[4, 8, 12, 16, 20, 24, 32, 48].map((px) => (
          <div key={px} className="flex items-center gap-4">
            <span className="w-12 text-sm tabular-nums text-hull-200">{px}px</span>
            <span className="block h-3 rounded-full bg-ember-500" style={{ width: px }} />
          </div>
        ))}
      </div>
      <Panel className="p-5">
        <p className="mb-4 text-sm leading-6 text-space-600">
          Actions are at least 44px tall, with room for labels to wrap at narrow widths.
        </p>
        <Button className="w-full">Continue learning</Button>
      </Panel>
    </Foundations>
  ),
}

export const RadiiAndShadows: Story = {
  render: () => (
    <Foundations>
      <SectionTitle>Consistent shapes, restrained depth</SectionTitle>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {[
          ['Chips', 'chip'],
          ['Actions', 'button'],
          ['Cards', 'card'],
          ['Navigation', 'capsule'],
        ].map(([label, token]) => (
          <div key={token}>
            <div
              className="h-20 border border-hull-400/40 bg-hull-50"
              style={{ borderRadius: `var(--radius-${token})` }}
            />
            <p className="mt-3 text-sm font-semibold">{label}</p>
            <p className="mt-1 font-mono text-xs text-hull-300">radius-{token}</p>
          </div>
        ))}
      </div>
      <Panel className="flex flex-col gap-5 p-6">
        <div>
          <h2 className="text-lg font-bold text-space-950">A clear next step</h2>
          <p className="mt-2 text-sm leading-6 text-space-600">
            Cards organize. Buttons invite action. Shadows never compete with the lesson.
          </p>
        </div>
        <ProgressMeter label="Island progress" value={40} />
        <Button>Continue learning</Button>
        <Button variant="secondary">Return to island</Button>
        <Button variant="quiet">View learning map</Button>
      </Panel>
    </Foundations>
  ),
}
