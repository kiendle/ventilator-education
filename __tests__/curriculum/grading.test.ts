import { describe, expect, it } from 'vitest'
import { getActivity, gradeActivity } from '../../src/data/curriculum'

describe('activity grading', () => {
  it('grades source-backed multiple-choice answers and proportional PEEP Points', () => {
    const activity = getActivity('lm-06')
    const correct = gradeActivity(activity, {
      type: 'quiz',
      answers: {
        q1: { interaction: 'mcq', choiceId: 'ventilation' },
        q2: { interaction: 'mcq', choiceId: 'mv-rr-vt' },
        q3: { interaction: 'mcq', choiceId: 'vti-vte-difference' },
        q4: { interaction: 'mcq', choiceId: 'increasing-peep' },
      },
    })
    const partiallyCorrect = gradeActivity(activity, {
      type: 'quiz',
      answers: {
        q1: { interaction: 'mcq', choiceId: 'oxygenation' },
        q2: { interaction: 'mcq', choiceId: 'mv-rr-vt' },
        q3: { interaction: 'mcq', choiceId: 'vti-vte-difference' },
        q4: { interaction: 'mcq', choiceId: 'increasing-peep' },
      },
    })

    expect(correct).toMatchObject({ status: 'passed', correctCount: 4, totalCount: 4, pointsEarned: 3 })
    expect(partiallyCorrect).toMatchObject({ status: 'failed', correctCount: 3, totalCount: 4, pointsEarned: 2 })
  })

  it('grades deterministic video completion and refuses unapproved content', () => {
    expect(
      gradeActivity(getActivity('lm-01'), { type: 'video', ended: true, watchedFraction: 1 })
    ).toMatchObject({ status: 'passed', pointsEarned: 3 })
    expect(gradeActivity(getActivity('lm-03'), null)).toMatchObject({
      status: 'unavailable',
      pointsEarned: 0,
    })
  })
})
