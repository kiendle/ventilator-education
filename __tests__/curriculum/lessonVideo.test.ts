import { describe, expect, it } from 'vitest'
import { getActivity, mediaAssets } from '../../src/data/curriculum'
import type { VideoContent } from '../../src/data/curriculum'
import {
  curriculumMediaUrl,
  resolveVideoUrl,
  videoCompletionMet,
} from '../../src/app/components/lessonVideo'

const videoContentOf = (activityId: string): VideoContent => {
  const activity = getActivity(activityId)
  if (activity.type !== 'video' || !activity.content) {
    throw new Error(`${activityId} is not a ready video activity`)
  }
  return activity.content
}

describe('lesson video playback contract', () => {
  it('maps a manifest storageKey to the shared local URL', () => {
    expect(curriculumMediaUrl('media/abc123.mp4')).toBe('/curriculum-media/abc123.mp4')
  })

  it('resolves the lm-01 smoke video to its materialized URL', () => {
    const url = resolveVideoUrl(videoContentOf('lm-01'), mediaAssets)
    expect(url).toBe('/curriculum-media/ff15e5600abd3e42eb2e2d8c5c35e9d1ec804c3675fc1694291249f5803a0939.mp4')
  })

  it('returns null when no storageKey exists, driving the accessible fallback', () => {
    const content = videoContentOf('lm-01')
    const withoutDirectKey = { ...content, media: { ...content.media, storageKey: null } }
    expect(resolveVideoUrl(withoutDirectKey, [])).toBeNull()
    expect(
      resolveVideoUrl(withoutDirectKey, [{ assetId: content.media.assetId, storageKey: null }])
    ).toBeNull()
  })

  it('gates completion on the source-defined condition, matching gradeActivity', () => {
    const ended = videoContentOf('lm-01').completionCondition
    expect(videoCompletionMet(ended, false, 0.99)).toBe(false)
    expect(videoCompletionMet(ended, true, 0.4)).toBe(true)

    const fraction = { kind: 'watched_fraction', watchedFraction: 0.9 } as const
    expect(videoCompletionMet(fraction, false, 0.89)).toBe(false)
    expect(videoCompletionMet(fraction, false, 0.9)).toBe(true)
    // Replay/seek noise beyond the threshold stays exactly-once: the caller
    // latches the gate, and repeated true evaluations never re-enable it.
    expect(videoCompletionMet(fraction, true, 0.95)).toBe(true)
  })
})
