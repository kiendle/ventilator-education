import { describe, expect, it } from 'vitest'
import { getActivity, gradeActivity, gradeQuizQuestion } from '../../src/data/curriculum'

describe('activity grading', () => {
  it('grades source-backed multiple-choice answers and proportional PEEP Points', () => {
    const activity = getActivity('lm-06')
    const correct = gradeActivity(activity, {
      type: 'quiz',
      answers: {
        q1: { interaction: 'mcq', choiceIds: ['ventilation'] },
        q2: { interaction: 'mcq', choiceIds: ['mv-rr-vt'] },
        q3: { interaction: 'mcq', choiceIds: ['vti-vte-difference'] },
        q4: { interaction: 'mcq', choiceIds: ['increasing-peep'] },
      },
    })
    const partiallyCorrect = gradeActivity(activity, {
      type: 'quiz',
      answers: {
        q1: { interaction: 'mcq', choiceIds: ['oxygenation'] },
        q2: { interaction: 'mcq', choiceIds: ['mv-rr-vt'] },
        q3: { interaction: 'mcq', choiceIds: ['vti-vte-difference'] },
        q4: { interaction: 'mcq', choiceIds: ['increasing-peep'] },
      },
    })

    expect(correct).toMatchObject({
      status: 'passed',
      correctCount: 4,
      totalCount: 4,
      pointsEarned: 3,
    })
    expect(partiallyCorrect).toMatchObject({
      status: 'failed',
      correctCount: 3,
      totalCount: 4,
      pointsEarned: 2,
    })
  })

  it('grades every exact source-backed answer for a multi-select question', () => {
    const activity = getActivity('lm-03')
    if (activity.type !== 'quiz' || !activity.content)
      throw new Error('expected approved quiz payload')
    const question = activity.content.questions[1]
    expect(question.prompt).toBe(
      '2. Which TWO ventilator settings have the biggest impact on oxygenation? (select two)'
    )
    expect(question.answer).toEqual({ interaction: 'mcq', correctChoiceIds: ['fio2', 'peep'] })
    const q6 = activity.content.questions[5]
    expect(q6.promptBlocks?.map((block) => block.kind)).toEqual(['text', 'text', 'image', 'text'])
    expect(question.review?.explanation).toContain(
      'Together, these two settings have the largest and most immediate effect on oxygenation.'
    )
    expect(question.review?.sourceReferences?.map(({ excerpt }) => excerpt)).toEqual([
      'FiO₂',
      'PEEP',
    ])
    expect(gradeQuizQuestion(question, { interaction: 'mcq', choiceIds: ['peep', 'fio2'] })).toBe(
      true
    )
    expect(gradeQuizQuestion(question, { interaction: 'mcq', choiceIds: ['fio2'] })).toBe(false)
  })

  it('grades deterministic video completion and refuses unapproved content', () => {
    expect(
      gradeActivity(getActivity('lm-01'), { type: 'video', ended: true, watchedFraction: 1 })
    ).toMatchObject({ status: 'passed', pointsEarned: 3 })
    expect(gradeActivity(getActivity('lm-12'), null)).toMatchObject({
      status: 'unavailable',
      pointsEarned: 0,
    })
  })

  it('completes source-backed cases, quests, and untargeted practice labs', () => {
    expect(
      gradeActivity(getActivity('ah-03'), {
        type: 'case_vignette',
        decisionIds: ['asthma-escalate'],
        sbar: 'Sue is deteriorating; come to the bedside emergently.',
      })
    ).toMatchObject({ status: 'passed', pointsEarned: 3 })
    expect(
      gradeActivity(getActivity('lm-16'), {
        type: 'quest',
        evidence: { supervisorConfirmed: true },
      })
    ).toMatchObject({ status: 'passed', pointsEarned: 10 })
    expect(
      gradeActivity(getActivity('id-06'), {
        type: 'vent_lab',
        state: { screen: 'Slide 2 / screen 1', mode: 'SIMV PRVC' },
      })
    ).toMatchObject({ status: 'passed', pointsEarned: 3 })
  })
})
