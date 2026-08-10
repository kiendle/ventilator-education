import extractedContentManifest from './generated/extracted-content.json'
import mediaManifest from './generated/media-manifest.json'
import sourceManifest from './generated/source-manifest.json'
import type {
  ExtractedSourceContent,
  MediaAssetRecord,
  MediaReference,
  SourceExtractionStatus,
  SourceFileRecord,
  SourceKind,
  SourceLocator,
  SourceReference,
} from './types'

type RawSource = (typeof sourceManifest.files)[number]
type RawExtractedSource = (typeof extractedContentManifest.sources)[number]
type RawMediaAsset = (typeof mediaManifest.assets)[number]

type NormalizedMediaKind = MediaAssetRecord['kind']

const normalizeStatus = (value: unknown): SourceExtractionStatus | undefined =>
  typeof value === 'string' ? (value as SourceExtractionStatus) : undefined

const normalizeSourceKind = (kind: unknown, relativePath: string): SourceKind => {
  if (kind === 'docx' || kind === 'pptx' || kind === 'pdf' || kind === 'png' ||
      kind === 'video' || kind === 'audio' || kind === 'mp4' || kind === 'mov' ||
      kind === 'mp3' || kind === 'unsupported') {
    return kind
  }

  const extension = relativePath.toLowerCase().split('.').pop()
  if (extension === 'docx' || extension === 'pptx' || extension === 'pdf' || extension === 'png') return extension
  if (extension === 'mp4' || extension === 'mov') return 'video'
  if (extension === 'mp3') return 'audio'
  return 'unsupported'
}

const normalizeMediaKind = (kind: unknown): NormalizedMediaKind => {
  if (kind === 'image' || kind === 'video' || kind === 'audio' || kind === 'other' ||
      kind === 'docx' || kind === 'pptx' || kind === 'pdf' || kind === 'png') {
    return kind
  }
  if (kind === 'mp4' || kind === 'mov') return 'video'
  if (kind === 'mp3') return 'audio'
  return 'other'
}

const extractedBySourceId = new Map<string, RawExtractedSource>(
  extractedContentManifest.sources.map((source) => [source.sourceId, source]),
)

const normalizeMediaAsset = (raw: RawMediaAsset): MediaAssetRecord => ({
  ...raw,
  assetId: raw.assetId,
  kind: normalizeMediaKind(raw.kind),
  sourceId: raw.sourceId,
  sha256: typeof raw.sha256 === 'string' ? raw.sha256 : null,
  byteSize: typeof raw.byteSize === 'number' && Number.isFinite(raw.byteSize) ? raw.byteSize : null,
  status: normalizeStatus(raw.status),
})

/** Every packaged and external media asset, in generated-manifest order. */
export const mediaAssets: MediaAssetRecord[] = mediaManifest.assets.map(normalizeMediaAsset)

const mediaBySourceId = new Map<string, MediaAssetRecord[]>()
for (const asset of mediaAssets) {
  const sourceAssets = mediaBySourceId.get(asset.sourceId ?? '')
  if (sourceAssets) sourceAssets.push(asset)
  else mediaBySourceId.set(asset.sourceId ?? '', [asset])
}

const normalizeSource = (raw: RawSource): SourceFileRecord => {
  const extracted = extractedBySourceId.get(raw.sourceId)
  const sourceMedia = mediaBySourceId.get(raw.sourceId) ?? []

  return {
    ...raw,
    ...(extracted ?? {}),
    sourceId: raw.sourceId,
    relativePath: raw.relativePath,
    kind: normalizeSourceKind(raw.kind, raw.relativePath),
    islandId: raw.islandId as SourceFileRecord['islandId'],
    byteSize: typeof raw.byteSize === 'number' && Number.isFinite(raw.byteSize) ? raw.byteSize : null,
    sha256: typeof raw.sha256 === 'string' ? raw.sha256 : null,
    status: normalizeStatus(raw.status),
    extractionStatus: normalizeStatus(raw.extractionStatus),
    errors: Array.isArray(raw.errors) ? raw.errors : [],
    missingDependencies: Array.isArray(raw.missingDependencies) ? raw.missingDependencies : [],
    content: extracted?.content ? (extracted.content as ExtractedSourceContent) : null,
    media: sourceMedia,
  } as SourceFileRecord
}

/** Every corpus source, in source-manifest order. */
export const sources: SourceFileRecord[] = sourceManifest.files.map(normalizeSource)

const sourceForPath = (relativePath: string): SourceFileRecord => {
  const matches = sources.filter((source) => source.relativePath === relativePath)
  if (matches.length === 0) throw new Error(`Unknown source: ${relativePath}`)
  if (matches.length > 1) throw new Error(`Ambiguous source: ${relativePath}`)
  return matches[0]
}

export function sourceRef(
  relativePath: string,
  locator: SourceLocator = { kind: 'whole_file' },
  role?: SourceReference['role'],
  excerpt?: string,
): SourceReference {
  const source = sourceForPath(relativePath)
  const reference: SourceReference = {
    sourceId: source.sourceId,
    relativePath: source.relativePath,
    locator: { ...locator },
  }
  if (role !== undefined) reference.role = role
  if (excerpt !== undefined) reference.excerpt = excerpt
  return reference
}

export function mediaRefForSource(relativePath: string, memberPath?: string): MediaReference {
  const source = sourceForPath(relativePath)
  const matches = mediaAssets.filter((asset) =>
    asset.sourceId === source.sourceId &&
    asset.relativePath === source.relativePath &&
    (memberPath === undefined ? asset.memberPath == null : asset.memberPath === memberPath),
  )

  const mediaLabel = memberPath === undefined ? relativePath : `${relativePath}#${memberPath}`
  if (matches.length === 0) throw new Error(`Unknown media: ${mediaLabel}`)
  if (matches.length > 1) throw new Error(`Ambiguous media: ${mediaLabel}`)

  const asset = matches[0]
  const reference: MediaReference = {
    assetId: asset.assetId,
    sha256: asset.sha256,
    byteSize: asset.byteSize,
  }
  if (asset.mimeType !== undefined) reference.mimeType = asset.mimeType
  if (asset.altText !== undefined) reference.altText = asset.altText
  return reference
}

