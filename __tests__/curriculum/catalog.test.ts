import { expect, it } from 'vitest'

import {
  curriculumDatabase,
  curriculumValidationErrors,
  EXPECTED_SOURCE_FORMAT_COUNTS,
  getActivity,
  getIsland,
  ISLAND_IDS,
  ROSTER_ACTIVITY_IDS,
} from '../../src/data/curriculum'

it('assembles the canonical curriculum catalog with resolvable references', () => {
  expect(curriculumValidationErrors).toEqual([])

  const { islands, sources, mediaAssets } = curriculumDatabase
  expect(islands.map(({ id, order }) => ({ id, order }))).toEqual(
    ISLAND_IDS.map((id, index) => ({ id, order: index + 1 }))
  )
  for (const island of islands) {
    expect(island.activities.map(({ activityId }) => activityId)).toEqual(
      ROSTER_ACTIVITY_IDS[island.id]
    )
  }

  const activities = islands.flatMap(({ activities: islandActivities }) => islandActivities)
  expect(activities).toHaveLength(86)
  expect(activities.filter(({ countsTowardProgress }) => countsTowardProgress)).toHaveLength(80)
  expect(activities.filter(({ activityId }) => activityId.endsWith('-final-exam'))).toHaveLength(6)
  expect(activities.filter(({ contentStatus }) => contentStatus === 'needs_review')).toEqual([])

  expect(sources).toHaveLength(76)
  expect(curriculumDatabase.metadata.sourceFileCount).toBe(76)
  expect(curriculumDatabase.metadata.sourceFormatCounts).toEqual(EXPECTED_SOURCE_FORMAT_COUNTS)
  expect(
    Object.fromEntries(
      Object.keys(EXPECTED_SOURCE_FORMAT_COUNTS).map((format) => [
        format,
        sources.filter((source) => source.kind === format).length,
      ])
    )
  ).toEqual(EXPECTED_SOURCE_FORMAT_COUNTS)

  const sourceById = new Map(sources.map((source) => [source.sourceId, source]))
  const mediaById = new Map(mediaAssets.map((asset) => [asset.assetId, asset]))
  for (const source of sources) {
    for (const asset of source.media ?? []) expect(mediaById.has(asset.assetId)).toBe(true)
  }
  for (const asset of mediaAssets) {
    if (asset.sourceId !== undefined) expect(sourceById.has(asset.sourceId)).toBe(true)
  }
  for (const activity of activities) {
    for (const reference of activity.provenance) {
      expect(sourceById.get(reference.sourceId)?.relativePath).toBe(reference.relativePath)
    }
    if (activity.contentStatus === 'unavailable') expect(activity.content).toBeNull()
    if (activity.contentStatus === 'ready') expect(activity.content).not.toBeNull()

    if (!activity.content) continue
    const media =
      activity.type === 'video'
        ? [activity.content.media]
        : activity.type === 'quiz'
          ? activity.content.questions.flatMap((question) => [
              ...(question.promptMedia ? [question.promptMedia] : []),
              ...question.choices.flatMap((choice) => (choice.media ? [choice.media] : [])),
            ])
          : []
    for (const reference of media) expect(mediaById.has(reference.assetId)).toBe(true)
  }

  expect(getIsland('lake-mucosa')?.id).toBe('lake-mucosa')
  expect(getActivity('lm-01')).toMatchObject({ activityId: 'lm-01', islandId: 'lake-mucosa' })
})
