import type {
  ActivityGrade,
  ActivitySubmission,
  CurriculumActivity,
  QuizQuestion,
  QuizResponse,
} from './types'

function unavailable(activity: CurriculumActivity, reason: string): ActivityGrade {
  return {
    activityId: activity.activityId,
    status: 'unavailable',
    correctCount: 0,
    totalCount: 0,
    pointsEarned: 0,
    maxPoints: activity.peepPointsValue,
    items: [],
    reason,
  }
}

export function gradeQuizQuestion(question: QuizQuestion, response?: QuizResponse): boolean {
  if (!response || response.interaction !== question.interaction) return false

  switch (question.interaction) {
    case 'mcq':
      if (response.interaction !== 'mcq') return false
      return (
        response.choiceIds.length === question.answer.correctChoiceIds.length &&
        response.choiceIds.every((choiceId) => question.answer.correctChoiceIds.includes(choiceId))
      )
    case 'drag_drop': {
      if (response.interaction !== 'drag_drop') return false
      const expected = question.answer.placements
      const submitted = response.placements
      const expectedIds = Object.keys(expected)
      return (
        expectedIds.length === Object.keys(submitted).length &&
        expectedIds.every((choiceId) => submitted[choiceId] === expected[choiceId])
      )
    }
    case 'matching': {
      if (
        response.interaction !== 'matching' ||
        response.pairs.length !== question.answer.pairs.length
      )
        return false
      const submitted = new Set(
        response.pairs.map(
          ({ leftChoiceId, rightChoiceId }) => `${leftChoiceId}\u0000${rightChoiceId}`
        )
      )
      return question.answer.pairs.every(({ leftChoiceId, rightChoiceId }) =>
        submitted.has(`${leftChoiceId}\u0000${rightChoiceId}`)
      )
    }
    case 'fill_blank': {
      if (response.interaction !== 'fill_blank') return false
      const normalize = (value: string) => {
        const trimmed = value.trim().normalize('NFKC')
        return question.answer.caseSensitive ? trimmed : trimmed.toLocaleLowerCase('en-US')
      }
      const submitted = normalize(response.value)
      return question.answer.acceptedAnswers.some((answer) => normalize(answer) === submitted)
    }
  }
}

export function gradeActivity(
  activity: CurriculumActivity,
  submission: ActivitySubmission | null
): ActivityGrade {
  if (activity.contentStatus !== 'ready' || !activity.content) {
    return unavailable(activity, `Activity content is ${activity.contentStatus}`)
  }
  if (!submission || submission.type !== activity.type) {
    return {
      ...unavailable(activity, 'Submission type does not match activity type'),
      status: 'failed',
      totalCount: 1,
    }
  }

  switch (activity.type) {
    case 'video': {
      if (submission.type !== 'video') return unavailable(activity, 'Invalid video submission')
      const passed =
        activity.content.completionCondition.kind === 'ended'
          ? submission.ended
          : submission.watchedFraction >= activity.content.completionCondition.watchedFraction
      return {
        activityId: activity.activityId,
        status: passed ? 'passed' : 'failed',
        correctCount: Number(passed),
        totalCount: 1,
        pointsEarned: passed ? activity.peepPointsValue : 0,
        maxPoints: activity.peepPointsValue,
        items: [{ itemId: activity.activityId, correct: passed }],
      }
    }
    case 'reading': {
      if (submission.type !== 'reading') return unavailable(activity, 'Invalid reading submission')
      const question = activity.content.confirmationQuestion
      const passed = submission.choiceId === question.answer.correctChoiceId
      return {
        activityId: activity.activityId,
        status: passed ? 'passed' : 'failed',
        correctCount: Number(passed),
        totalCount: 1,
        pointsEarned: passed ? activity.peepPointsValue : 0,
        maxPoints: activity.peepPointsValue,
        items: [
          {
            itemId: activity.activityId,
            correct: passed,
            feedback:
              question.review?.feedback ??
              question.review?.explanation ??
              question.review?.rationale,
          },
        ],
      }
    }
    case 'quiz': {
      if (submission.type !== 'quiz') return unavailable(activity, 'Invalid quiz submission')
      const items = activity.content.questions.map((question) => ({
        itemId: question.id,
        correct: gradeQuizQuestion(question, submission.answers[question.id]),
        feedback:
          question.review?.feedback ?? question.review?.explanation ?? question.review?.rationale,
      }))
      const correctCount = items.filter(({ correct }) => correct).length
      const totalCount = items.length
      return {
        activityId: activity.activityId,
        status: totalCount > 0 && correctCount === totalCount ? 'passed' : 'failed',
        correctCount,
        totalCount,
        pointsEarned:
          totalCount > 0 ? Math.floor((activity.peepPointsValue * correctCount) / totalCount) : 0,
        maxPoints: activity.peepPointsValue,
        items,
      }
    }
    case 'vent_lab': {
      if (submission.type !== 'vent_lab')
        return unavailable(activity, 'Invalid Vent Lab submission')
      const passed = activity.content.targetState
        ? Object.entries(activity.content.targetState).every(
            ([key, value]) => submission.state[key] === value
          )
        : true
      return {
        activityId: activity.activityId,
        status: passed ? 'passed' : 'failed',
        correctCount: Number(passed),
        totalCount: 1,
        pointsEarned: passed ? activity.peepPointsValue : 0,
        maxPoints: activity.peepPointsValue,
        items: [
          {
            itemId: activity.activityId,
            correct: passed,
            feedback: passed
              ? activity.content.feedback.success
              : activity.content.feedback.incorrect,
          },
        ],
      }
    }
    case 'case_vignette': {
      if (submission.type !== 'case_vignette')
        return unavailable(activity, 'Invalid case submission')
      const accepted = activity.content.answer?.acceptedDecisionIds
      const passed =
        submission.decisionIds.length > 0 &&
        submission.sbar.trim().length > 0 &&
        (!accepted?.length || submission.decisionIds.every((id) => accepted.includes(id)))
      return {
        activityId: activity.activityId,
        status: passed ? 'passed' : 'failed',
        correctCount: Number(passed),
        totalCount: 1,
        pointsEarned: passed ? activity.peepPointsValue : 0,
        maxPoints: activity.peepPointsValue,
        items: [
          {
            itemId: activity.activityId,
            correct: passed,
            feedback: activity.content.answer?.rationale,
          },
        ],
      }
    }
    case 'quest': {
      if (submission.type !== 'quest') return unavailable(activity, 'Invalid quest submission')
      const passed = Object.values(submission.evidence).some((value) =>
        typeof value === 'string' ? value.trim().length > 0 : value
      )
      return {
        activityId: activity.activityId,
        status: passed ? 'passed' : 'failed',
        correctCount: Number(passed),
        totalCount: 1,
        pointsEarned: passed ? activity.peepPointsValue : 0,
        maxPoints: activity.peepPointsValue,
        items: [{ itemId: activity.activityId, correct: passed }],
      }
    }
  }
}
