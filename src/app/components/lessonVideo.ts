import type { MediaAssetRecord, VideoContent } from '@/data/curriculum'

/* Pure playback contract helpers for the lesson-video screen. Kept free of
   React and DOM APIs so the vitest node environment can exercise them. */

/** Local, gitignored media root populated by `npm run media:local`. */
export const CURRICULUM_MEDIA_BASE = '/curriculum-media'

/**
 * Map a manifest storageKey (`media/<sha256>.<ext>`) to the shared local URL
 * `/curriculum-media/<storageKey without the media/ prefix>`.
 */
export function curriculumMediaUrl(storageKey: string): string {
  const name = storageKey.replace(/^media\//, '').split('/').pop() ?? storageKey
  return `${CURRICULUM_MEDIA_BASE}/${name}`
}

/**
 * Resolve the playable URL for a video activity, or null when no storageKey
 * exists. Storage keys reach a video ref two ways: newer
 * `mediaRefForSource`-built refs carry `storageKey` directly (via the
 * MediaAssetRecord spread), while refs without one are joined to the
 * matching MediaAssetRecord by assetId.
 */
export function resolveVideoUrl(
  content: VideoContent,
  assets: ReadonlyArray<Pick<MediaAssetRecord, 'assetId' | 'storageKey'>>
): string | null {
  const direct = (content.media as { storageKey?: unknown }).storageKey
  const key =
    typeof direct === 'string' && direct.length > 0
      ? direct
      : assets.find((candidate) => candidate.assetId === content.media.assetId)?.storageKey
  return typeof key === 'string' && key.length > 0 ? curriculumMediaUrl(key) : null
}

/**
 * Source-defined completion check: mirrors the video branch of
 * `gradeActivity`, so the completion button enables exactly when a submission
 * with the same values would pass. Seeking/replay only ever grows the
 * fraction, so the gate can be met once and latched by the caller.
 */
export function videoCompletionMet(
  condition: VideoContent['completionCondition'],
  ended: boolean,
  watchedFraction: number
): boolean {
  return condition.kind === 'ended' ? ended : watchedFraction >= condition.watchedFraction
}
