import extractedContentManifest from './generated/extracted-content.json'
import mediaManifest from './generated/media-manifest.json'
import sourceManifest from './generated/source-manifest.json'
import type {
  ExtractedSourceContent,
  MediaAssetRecord,
  MediaReference,
  ReadingBlock,
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
  if (
    kind === 'docx' ||
    kind === 'pptx' ||
    kind === 'pdf' ||
    kind === 'png' ||
    kind === 'video' ||
    kind === 'audio' ||
    kind === 'mp4' ||
    kind === 'mov' ||
    kind === 'mp3' ||
    kind === 'unsupported'
  ) {
    return kind
  }

  const extension = relativePath.toLowerCase().split('.').pop()
  if (extension === 'docx' || extension === 'pptx' || extension === 'pdf' || extension === 'png')
    return extension
  if (extension === 'mp4' || extension === 'mov') return 'video'
  if (extension === 'mp3') return 'audio'
  return 'unsupported'
}

const normalizeMediaKind = (kind: unknown): NormalizedMediaKind => {
  if (
    kind === 'image' ||
    kind === 'video' ||
    kind === 'audio' ||
    kind === 'other' ||
    kind === 'docx' ||
    kind === 'pptx' ||
    kind === 'pdf' ||
    kind === 'png'
  ) {
    return kind
  }
  if (kind === 'mp4' || kind === 'mov') return 'video'
  if (kind === 'mp3') return 'audio'
  return 'other'
}

const extractedBySourceId = new Map<string, RawExtractedSource>(
  extractedContentManifest.sources.map((source) => [source.sourceId, source])
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
    byteSize:
      typeof raw.byteSize === 'number' && Number.isFinite(raw.byteSize) ? raw.byteSize : null,
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
  excerpt?: string
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

/** Return source-authored mixed text/media blocks in OOXML order. */
export function exactSourceBlocks(relativePath: string): ReadingBlock[] {
  const source = sourceForPath(relativePath)
  const content = source.content as Record<string, unknown> | null
  if (!content) return []
  const result: ReadingBlock[] = []
  const addText = (value: unknown) => {
    if (typeof value === 'string' && value.length > 0) result.push({ kind: 'text', text: value })
  }
  const addMedia = (memberPath: unknown) => {
    if (typeof memberPath !== 'string') return
    try {
      result.push({ kind: 'image', media: mediaRefForSource(relativePath, memberPath) })
    } catch {
      // Preserve the text record when a source relationship is unresolved.
    }
  }
  const addMediaRefs = (value: unknown) => {
    if (!Array.isArray(value)) return
    for (const reference of value) {
      if (reference && typeof reference === 'object') {
        addMedia((reference as Record<string, unknown>).memberPath)
      }
    }
  }
  const addOrderedContent = (value: unknown): boolean => {
    if (!Array.isArray(value)) return false
    let found = false
    let pendingText = ''
    const flushText = () => {
      if (pendingText.length > 0) addText(pendingText)
      pendingText = ''
    }
    for (const item of value) {
      if (!item || typeof item !== 'object') continue
      const record = item as Record<string, unknown>
      if (record.kind === 'text' && typeof record.text === 'string') {
        pendingText += record.text
        found = true
      } else if (record.kind === 'drawing') {
        flushText()
        addMediaRefs(record.mediaRefs)
        found = true
      }
    }
    flushText()
    return found
  }
  const rawBlocks = Array.isArray(content.blocks) ? content.blocks : []
  for (const block of rawBlocks) {
    if (!block || typeof block !== 'object') continue
    const record = block as Record<string, unknown>
    let hadOrderedContent = addOrderedContent(record.orderedContent)
    const rowRecords = record.rowRecords
    if (Array.isArray(rowRecords)) {
      for (const row of rowRecords) {
        if (!row || typeof row !== 'object') continue
        const cells = (row as Record<string, unknown>).cells
        if (!Array.isArray(cells)) continue
        for (const cell of cells) {
          if (!cell || typeof cell !== 'object') continue
          const paragraphs = (cell as Record<string, unknown>).paragraphs
          if (!Array.isArray(paragraphs)) continue
          for (const paragraph of paragraphs) {
            if (paragraph && typeof paragraph === 'object') {
              hadOrderedContent =
                addOrderedContent((paragraph as Record<string, unknown>).orderedContent) ||
                hadOrderedContent
            }
          }
        }
      }
    }
    if (!hadOrderedContent) {
      addText(record.text)
      if (typeof record.text !== 'string' || record.text.length === 0) {
        if (Array.isArray(record.rows)) {
          for (const row of record.rows) {
            if (Array.isArray(row)) addText(row.map((cell) => String(cell)).join('\t'))
          }
        }
      }
      addMediaRefs(record.mediaRefs)
    }
  }
  const slides = Array.isArray(content.slides) ? content.slides : []
  for (const slide of slides) {
    if (!slide || typeof slide !== 'object') continue
    const record = slide as Record<string, unknown>
    let hadShape = false
    let hadShapeMedia = false
    if (Array.isArray(record.shapes)) {
      for (const shape of record.shapes) {
        if (!shape || typeof shape !== 'object') continue
        hadShape = true
        const shapeRecord = shape as Record<string, unknown>
        addText(shapeRecord.text)
        if (Array.isArray(shapeRecord.mediaRefs) && shapeRecord.mediaRefs.length > 0)
          hadShapeMedia = true
        addMediaRefs(shapeRecord.mediaRefs)
      }
    }
    if (!hadShape) addText(record.text)
    if (!hadShapeMedia) addMediaRefs(record.mediaRefs)
    const notes = record.notes
    if (notes && typeof notes === 'object') addText((notes as Record<string, unknown>).text)
  }
  if (result.length === 0 && source.kind === 'png') {
    try {
      result.push({ kind: 'image', media: mediaRefForSource(relativePath) })
    } catch {
      // The source manifest remains authoritative when the standalone asset is missing.
    }
  }
  return result
}

/** Return source-authored text in OOXML order without learner-facing paraphrase. */
export function exactSourceText(relativePath: string): string {
  return exactSourceBlocks(relativePath)
    .filter((block): block is Extract<ReadingBlock, { kind: 'text' }> => block.kind === 'text')
    .map((block) => block.text)
    .join('\n\n')
}

/** Reference an exact source PDF packaged by the local media materializer. */
export function documentRefForSource(relativePath: string): MediaReference {
  const source = sourceForPath(relativePath)
  if (source.kind !== 'pdf' || !source.sha256)
    throw new Error(`Source is not a packaged PDF: ${relativePath}`)
  return {
    assetId: source.sourceId,
    sha256: source.sha256,
    byteSize: source.byteSize,
    storageKey: `media/${source.sha256}.pdf`,
    mimeType: 'application/pdf',
  }
}
export function mediaRefForSource(relativePath: string, memberPath?: string): MediaReference {
  const source = sourceForPath(relativePath)
  const matches = mediaAssets.filter((asset) => {
    if (asset.sourceId !== source.sourceId || asset.relativePath !== source.relativePath)
      return false
    if (memberPath === undefined) return asset.memberPath == null && asset.sourceMemberPath == null
    return asset.memberPath === memberPath || asset.sourceMemberPath === memberPath
  })
  const browserMatches = matches.filter((asset) => {
    if (asset.browserCompatible === true) return true
    const mediaPath = asset.memberPath ?? asset.storageKey ?? ''
    const extension = mediaPath.toLowerCase().split('.').pop()
    return extension !== undefined && !['wdp', 'jxr', 'emf', 'wmf'].includes(extension)
  })
  const candidates = browserMatches

  const mediaLabel = memberPath === undefined ? relativePath : `${relativePath}#${memberPath}`
  if (candidates.length === 0) throw new Error(`Unknown media: ${mediaLabel}`)
  if (candidates.length > 1) throw new Error(`Ambiguous media: ${mediaLabel}`)

  const asset = candidates[0]
  const reference: MediaReference = {
    assetId: asset.assetId,
    sha256: asset.sha256,
    byteSize: asset.byteSize,
    storageKey: asset.storageKey,
  }
  if (asset.mimeType !== undefined) reference.mimeType = asset.mimeType
  if (asset.altText !== undefined) reference.altText = asset.altText
  return reference
}
