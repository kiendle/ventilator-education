import { expect, it } from 'vitest'

import {
  documentRefForSource,
  exactSourceBlocks,
  mediaAssets,
  mediaRefForSource,
  sources,
} from '../../src/data/curriculum/generated-data'
it('preserves DOCX drawing/text order and resolved media', () => {
  const relativePath = '1. Lake Mucosa/Oxygenation & MAP_Quiz.docx'
  const source = sources.find((candidate) => candidate.relativePath === relativePath)
  const content = source?.content as unknown as
    | { blocks?: Array<Record<string, unknown>> }
    | undefined
  const block = content?.blocks?.find((candidate) => {
    const ordered = candidate.orderedContent
    return (
      Array.isArray(ordered) &&
      ordered.some(
        (item) =>
          item && typeof item === 'object' && (item as Record<string, unknown>).kind === 'drawing'
      )
    )
  })
  const ordered = block?.orderedContent as Array<Record<string, unknown>> | undefined

  expect(ordered?.map((item) => item.kind)).toEqual(['drawing', 'text', 'text'])
  expect(ordered?.[2]?.text).toContain('The child has copious secretions')

  const mediaRef = (ordered?.[0]?.mediaRefs as Array<Record<string, unknown>> | undefined)?.[0]
  expect(mediaRef?.memberPath).toBe('word/media/image1.png')
  const exactBlocks = exactSourceBlocks(relativePath)
  const firstImage = exactBlocks.find((candidate) => candidate.kind === 'image')
  expect(firstImage?.kind).toBe('image')
  if (firstImage?.kind === 'image') {
    const asset = mediaAssets.find((candidate) => candidate.assetId === firstImage.media.assetId)
    expect(asset?.storageKey).toMatch(/^media\/[0-9a-f]{64}\.png$/)
  }
})

it('preserves PPTX slide shape z-order and speaker-note text', () => {
  const relativePath = '1. Lake Mucosa/Airway Anatomy.pptx'
  const source = sources.find((candidate) => candidate.relativePath === relativePath)
  const content = source?.content as unknown as
    | { slides?: Array<Record<string, unknown>> }
    | undefined
  const slide = content?.slides?.find((candidate) => candidate.slideIndex === 2)
  const shapes = slide?.shapes as Array<Record<string, unknown>> | undefined
  const notes = slide?.notes as Record<string, unknown> | undefined

  expect(shapes?.map((shape) => shape.shapeIndex)).toEqual([2, 3, 4, 5, 6])
  expect(shapes?.map((shape) => shape.zOrder)).toEqual([2, 3, 4, 5, 6])
  expect(notes?.text).toContain('This is a picture of a normal airway.')
})

it('selects converted browser media while retaining source asset provenance', () => {
  const relativePath = '1. Lake Mucosa/Airway Anatomy.pptx'
  const sourceMemberPath = 'ppt/media/hdphoto1.wdp'
  const sourceAsset = mediaAssets.find(
    (asset) => asset.relativePath === relativePath && asset.memberPath === sourceMemberPath
  )
  expect(sourceAsset?.storageKey).toMatch(/^media\/[0-9a-f]{64}\.wdp$/)

  const converted = mediaAssets.find(
    (asset) => asset.relativePath === relativePath && asset.sourceAssetId === sourceAsset?.assetId
  )
  expect(converted?.browserCompatible).toBe(true)
  expect(converted?.sourceMemberPath).toBe(sourceMemberPath)
  expect(converted?.originalSha256).toBe(sourceAsset?.sha256)
  expect(converted?.storageKey).toMatch(/^media\/[0-9a-f]{64}\.png$/)

  const reference = mediaRefForSource(relativePath, sourceMemberPath)
  expect(reference.assetId).toBe(converted?.assetId)
  expect(reference.storageKey).toBe(converted?.storageKey)
})

it('packages exact source PDFs without text reconstruction', () => {
  const reference = documentRefForSource('1. Lake Mucosa/Oxygenation & MAP_Reading.pdf')

  expect(reference.mimeType).toBe('application/pdf')
  expect(reference.storageKey).toBe(`media/${reference.sha256}.pdf`)
  expect(reference.byteSize).toBe(3276426)
})
