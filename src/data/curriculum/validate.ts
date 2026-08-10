import {
  EXPECTED_SOURCE_FORMAT_COUNTS,
  ISLAND_IDS,
  ROSTER_ACTIVITY_IDS,
  type ActivityType,
  type CurriculumDatabase,
  type SourceFormat,
  type SourceKind,
} from './types'

const ACTIVITY_TYPES: readonly ActivityType[] = [
  'video',
  'reading',
  'quiz',
  'case_vignette',
  'quest',
  'vent_lab',
  'pending',
]
const SOURCE_KINDS: readonly SourceKind[] = [
  'docx', 'pptx', 'pdf', 'png', 'video', 'audio', 'mp4', 'mov', 'mp3', 'unsupported',
]
const EXTRACTION_STATUSES = new Set([
  'ready', 'ok', 'partial', 'empty', 'needs_review', 'unavailable',
  'missing_dependency', 'unsupported', 'error', 'missing',
])
const CONTENT_STATUSES = new Set(['ready', 'needs_review', 'unavailable'])
const CONFLICT_STATUSES = new Set(['needs_review', 'accepted', 'resolved', 'unavailable'])
const CONFLICT_SCOPES = new Set(['source', 'activity', 'island', 'totals', 'mapping', 'content'])

const isRecord = (value: unknown): value is Record<string, any> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)
const isPositiveInteger = (value: unknown): value is number =>
  isFiniteNumber(value) && Number.isInteger(value) && value > 0
const isNonnegativeInteger = (value: unknown): value is number =>
  isFiniteNumber(value) && Number.isInteger(value) && value >= 0
const isNonemptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0
const isSha256 = (value: unknown): value is string =>
  typeof value === 'string' && /^[0-9a-f]{64}$/i.test(value)
const isExplicitlyNonReady = (status: unknown): boolean =>
  typeof status === 'string' && EXTRACTION_STATUSES.has(status) && status !== 'ready' && status !== 'ok'
const hasOwn = (value: Record<string, any>, key: string): boolean =>
  Object.prototype.hasOwnProperty.call(value, key)

function sourceFormat(kind: unknown, relativePath: unknown): SourceFormat | null {
  if (kind === 'unsupported') return null
  if (kind === 'docx' || kind === 'pptx' || kind === 'pdf' || kind === 'png') return kind
  if (kind === 'video' || kind === 'mp4' || kind === 'mov') return 'video'
  if (kind === 'audio' || kind === 'mp3') return 'audio'
  if (typeof relativePath === 'string') {
    const extension = relativePath.toLowerCase().split('.').pop()
    if (extension === 'docx' || extension === 'pptx' || extension === 'pdf' || extension === 'png') return extension
    if (extension === 'mp4' || extension === 'mov') return 'video'
    if (extension === 'mp3') return 'audio'
  }
  return null
}

function checkLocator(locator: unknown, context: string, errors: string[]): void {
  if (!isRecord(locator) || typeof locator.kind !== 'string') {
    errors.push(`${context} must have a locator kind`)
    return
  }
  switch (locator.kind) {
    case 'whole_file':
      return
    case 'page':
    case 'slide':
      if (!isPositiveInteger(locator[locator.kind])) errors.push(`${context}.${locator.kind} must be a positive integer`)
      return
    case 'time':
      if (!isFiniteNumber(locator.startSeconds) || locator.startSeconds < 0) errors.push(`${context}.startSeconds must be nonnegative`)
      if (locator.endSeconds !== undefined && (!isFiniteNumber(locator.endSeconds) || locator.endSeconds < (locator.startSeconds ?? 0))) {
        errors.push(`${context}.endSeconds must be at least startSeconds`)
      }
      return
    default:
      errors.push(`${context}.kind is not a supported locator kind`)
  }
}

function checkMediaReference(
  value: unknown,
  context: string,
  assets: Map<string, Record<string, any>>,
  sourceIds: Set<string>,
  contentStatus: unknown,
  errors: string[],
): void {
  if (!isRecord(value)) {
    errors.push(`${context} must be a media reference`)
    return
  }
  const asset = isNonemptyString(value.assetId) ? assets.get(value.assetId) : undefined
  const allowMissingDigest = isExplicitlyNonReady(contentStatus) || isExplicitlyNonReady(asset?.status)
  if (value.sha256 === null) {
    if (!allowMissingDigest) errors.push(`${context}.sha256 must contain hash metadata`)
  } else if (!isSha256(value.sha256)) {
    errors.push(`${context}.sha256 must be a valid SHA-256 digest`)
  }
  if (value.byteSize !== undefined && value.byteSize !== null && !isNonnegativeInteger(value.byteSize)) {
    errors.push(`${context}.byteSize must be nonnegative`)
  }
  if (!isNonemptyString(value.assetId)) return
  if (!asset) errors.push(`${context}.assetId ${value.assetId} is not in mediaAssets`)
  else {
    if (typeof asset.sha256 === 'string' && typeof value.sha256 === 'string' && asset.sha256 !== value.sha256) {
      errors.push(`${context}.sha256 does not match mediaAssets.${value.assetId}`)
    }
    if (value.byteSize !== undefined && value.byteSize !== null && asset.byteSize !== undefined &&
        asset.byteSize !== null && value.byteSize !== asset.byteSize) {
      errors.push(`${context}.byteSize does not match mediaAssets.${value.assetId}`)
    }
  }
  if (value.sourceId !== undefined && (!isNonemptyString(value.sourceId) || !sourceIds.has(value.sourceId))) {
    errors.push(`${context}.sourceId is not a known source`)
  }
}

function checkSourceReferences(
  value: unknown,
  context: string,
  sourceById: Map<string, Record<string, any>>,
  errors: string[],
): void {
  if (!Array.isArray(value) || value.length === 0) {
    errors.push(`${context} must contain at least one source reference`)
    return
  }
  value.forEach((reference, index) => {
    const refContext = `${context}[${index}]`
    if (!isRecord(reference)) {
      errors.push(`${refContext} must be an object`)
      return
    }
    if (!isNonemptyString(reference.sourceId)) errors.push(`${refContext}.sourceId must be nonempty`)
    else {
      const source = sourceById.get(reference.sourceId)
      if (!source) errors.push(`${refContext}.sourceId ${reference.sourceId} is unknown`)
      else if (reference.relativePath !== source.relativePath) errors.push(`${refContext}.relativePath does not match its source record`)
    }
    if (!isNonemptyString(reference.relativePath)) errors.push(`${refContext}.relativePath must be nonempty`)
    else if (reference.relativePath.startsWith('/') || reference.relativePath.includes('\\')) errors.push(`${refContext}.relativePath must be relative POSIX`)
    checkLocator(reference.locator, refContext, errors)
  })
}

function checkReview(value: unknown, context: string, sourceById: Map<string, Record<string, any>>, errors: string[]): void {
  if (isRecord(value) && value.sourceReferences !== undefined) checkSourceReferences(value.sourceReferences, `${context}.sourceReferences`, sourceById, errors)
}

function checkActivityPayload(
  activity: Record<string, any>,
  context: string,
  assets: Map<string, Record<string, any>>,
  sourceIds: Set<string>,
  sourceById: Map<string, Record<string, any>>,
  errors: string[],
): void {
  const type = activity.type as ActivityType
  const status = activity.contentStatus
  const content = activity.content
  if (type === 'pending') {
    if (status !== 'unavailable') errors.push(`${context}.contentStatus must be unavailable for pending`)
    if (content !== null) errors.push(`${context}.content must be null for pending`)
    return
  }
  if (!CONTENT_STATUSES.has(status)) errors.push(`${context}.contentStatus is invalid`)
  if (status === 'ready' && !isRecord(content)) errors.push(`${context}.ready content must be present`)
  if (!isRecord(content)) {
    errors.push(`${context}.content must be an object or null`)
    return
  }
  const marker = content.type ?? content.activityType
  if (marker !== undefined && marker !== type) errors.push(`${context}.type does not agree with content type`)
  const requireFields = (fields: string[]) => fields.forEach((field) => {
    if (!hasOwn(content, field)) errors.push(`${context}.content.${field} is required for ${type}`)
  })
  switch (type) {
    case 'video': {
      requireFields(['media', 'durationSeconds', 'completionCondition'])
      if (hasOwn(content, 'media')) checkMediaReference(content.media, `${context}.content.media`, assets, sourceIds, status, errors)
      if (hasOwn(content, 'durationSeconds') && (!isFiniteNumber(content.durationSeconds) || content.durationSeconds <= 0)) errors.push(`${context}.content.durationSeconds must be positive`)
      const condition = content.completionCondition
      if (isRecord(condition) && condition.kind === 'watched_fraction' && (!isFiniteNumber(condition.watchedFraction) || condition.watchedFraction <= 0 || condition.watchedFraction > 1)) errors.push(`${context}.content.completionCondition.watchedFraction must be in (0, 1]`)
      else if (isRecord(condition) && condition.kind !== 'ended' && condition.kind !== 'watched_fraction') errors.push(`${context}.content.completionCondition.kind is invalid`)
      break
    }
    case 'reading': {
      requireFields(['body', 'confirmationQuestion'])
      const question = content.confirmationQuestion
      if (isRecord(question)) {
        if (!isNonemptyString(question.prompt)) errors.push(`${context}.confirmationQuestion.prompt must be nonempty`)
        if (!Array.isArray(question.choices) || question.choices.length === 0) errors.push(`${context}.confirmationQuestion.choices must be nonempty`)
        const choiceIds = new Set<string>()
        if (Array.isArray(question.choices)) {
          question.choices.forEach((choice: unknown, index: number) => {
            if (!isRecord(choice) || !isNonemptyString(choice.id)) errors.push(`${context}.confirmationQuestion.choices[${index}].id is required`)
            else if (choiceIds.has(choice.id)) errors.push(`${context}.confirmationQuestion has duplicate choice ${choice.id}`)
            else choiceIds.add(choice.id)
          })
        }
        if (!isRecord(question.answer) || !choiceIds.has(question.answer.correctChoiceId)) errors.push(`${context}.confirmationQuestion.answer must name a listed choice`)
        checkReview(question.review, `${context}.confirmationQuestion.review`, sourceById, errors)
      }
      break
    }
    case 'quiz': {
      requireFields(['questions'])
      if (!Array.isArray(content.questions) || content.questions.length === 0) {
        errors.push(`${context}.content.questions must be nonempty`)
        break
      }
      content.questions.forEach((question: any, index: number) => {
        const qContext = `${context}.content.questions[${index}]`
        if (!isRecord(question) || !['mcq', 'drag_drop', 'matching', 'fill_blank'].includes(question.interaction)) {
          errors.push(`${qContext}.interaction is invalid`)
          return
        }
        if (!isNonemptyString(question.prompt)) errors.push(`${qContext}.prompt must be nonempty`)
        if (!Array.isArray(question.choices)) errors.push(`${qContext}.choices must be an array`)
        const choiceIds = new Set<string>()
        if (Array.isArray(question.choices)) {
          question.choices.forEach((choice: unknown, choiceIndex: number) => {
            if (!isRecord(choice) || !isNonemptyString(choice.id)) errors.push(`${qContext}.choices[${choiceIndex}].id is required`)
            else if (choiceIds.has(choice.id)) errors.push(`${qContext} has duplicate choice ${choice.id}`)
            else choiceIds.add(choice.id)
            if (isRecord(choice) && choice.media) checkMediaReference(choice.media, `${qContext}.choices[${choiceIndex}].media`, assets, sourceIds, status, errors)
          })
        }
        if (question.promptMedia) checkMediaReference(question.promptMedia, `${qContext}.promptMedia`, assets, sourceIds, status, errors)
        const answer = question.answer
        if (!isRecord(answer) || answer.interaction !== question.interaction) errors.push(`${qContext}.answer.interaction must match question interaction`)
        else if (question.interaction === 'mcq' && !choiceIds.has(answer.correctChoiceId)) errors.push(`${qContext}.answer.correctChoiceId must name a listed choice`)
        else if (question.interaction === 'matching') {
          if (!Array.isArray(answer.pairs) || answer.pairs.length === 0) errors.push(`${qContext}.answer.pairs must be nonempty`)
          if (Array.isArray(answer.pairs)) {
            answer.pairs.forEach((pair: unknown) => {
              if (!isRecord(pair) || !choiceIds.has(pair.leftChoiceId) || !choiceIds.has(pair.rightChoiceId)) errors.push(`${qContext}.answer.pairs must use listed choices`)
            })
          }
        } else if (question.interaction === 'fill_blank' && (!Array.isArray(answer.acceptedAnswers) || answer.acceptedAnswers.length === 0)) errors.push(`${qContext}.answer.acceptedAnswers must be nonempty`)
        else if (question.interaction === 'drag_drop' && !isRecord(answer.placements)) errors.push(`${qContext}.answer.placements must be an object`)
        checkReview(question.review, qContext, sourceById, errors)
      })
      break
    }
    case 'case_vignette': {
      requireFields(['scenario', 'decisions', 'sbar'])
      const decisions = content.decisions
      const ids = new Set<string>()
      if (!Array.isArray(decisions)) {
        errors.push(`${context}.decisions must be an array`)
      } else {
        decisions.forEach((decision: unknown, index: number) => {
          if (!isRecord(decision) || !isNonemptyString(decision.id)) errors.push(`${context}.decisions[${index}].id is required`)
          else if (ids.has(decision.id)) errors.push(`${context}.decisions has duplicate id ${decision.id}`)
          else ids.add(decision.id)
        })
        decisions.forEach((decision: unknown) => {
          if (isRecord(decision) && decision.nextId !== undefined && !ids.has(decision.nextId)) errors.push(`${context}.decisions.nextId is unknown`)
        })
      }
      if (isRecord(content.sbar) && !isNonemptyString(content.sbar.prompt)) errors.push(`${context}.sbar.prompt must be nonempty`)
      if (content.answer?.acceptedDecisionIds !== undefined && !Array.isArray(content.answer.acceptedDecisionIds)) {
        errors.push(`${context}.answer.acceptedDecisionIds must be an array`)
      } else if (Array.isArray(content.answer?.acceptedDecisionIds)) {
        content.answer.acceptedDecisionIds.forEach((id: unknown) => {
          if (!ids.has(id as string)) errors.push(`${context}.answer names an unknown decision`)
        })
      }
      checkReview(content.sbar?.review, `${context}.sbar.review`, sourceById, errors)
      break
    }
    case 'quest': {
      requireFields(['instructions', 'supervisorRole', 'offlineValidation'])
      if (content.repeatCount !== undefined && !isPositiveInteger(content.repeatCount)) errors.push(`${context}.content.repeatCount must be positive`)
      if (isRecord(content.offlineValidation) && !['supervisor_confirmation', 'checklist', 'local_attestation', 'other'].includes(content.offlineValidation.method)) errors.push(`${context}.offlineValidation.method is invalid`)
      checkReview(content.review, `${context}.review`, sourceById, errors)
      break
    }
    case 'vent_lab': {
      requireFields(['controls', 'objectives', 'feedback'])
      if (!Array.isArray(content.controls) || content.controls.length === 0) errors.push(`${context}.controls must be nonempty`)
      if (!Array.isArray(content.objectives) || content.objectives.length === 0) errors.push(`${context}.objectives must be nonempty`)
      if (isRecord(content.feedback)) {
        if (!isNonemptyString(content.feedback.success) || !isNonemptyString(content.feedback.incorrect)) errors.push(`${context}.feedback must include success and incorrect text`)
        checkReview(content.feedback.review, `${context}.feedback.review`, sourceById, errors)
      }
      break
    }
  }
}

function checkTotals(value: unknown, context: string, errors: string[]): void {
  if (value === null) return
  if (!isRecord(value)) {
    errors.push(`${context} must be an object or null`)
    return
  }
  if (!isNonnegativeInteger(value.activityCount)) errors.push(`${context}.activityCount must be a nonnegative integer`)
  if (!isNonnegativeInteger(value.estimatedMinutes)) errors.push(`${context}.estimatedMinutes must be a nonnegative integer`)
  if (!isNonnegativeInteger(value.peepPoints)) errors.push(`${context}.peepPoints must be a nonnegative integer`)
  if (value.repeatInstances !== undefined && !isNonnegativeInteger(value.repeatInstances)) errors.push(`${context}.repeatInstances must be a nonnegative integer`)
}

function checkConflict(value: unknown, context: string, sourceIds: Set<string>, activityIds: Set<string>, errors: string[]): void {
  if (!isRecord(value)) {
    errors.push(`${context} must be an object`)
    return
  }
  if (!isNonemptyString(value.conflictId)) errors.push(`${context}.conflictId must be nonempty`)
  if (!CONFLICT_SCOPES.has(value.scope)) errors.push(`${context}.scope is invalid`)
  if (!CONFLICT_STATUSES.has(value.status)) errors.push(`${context}.status is invalid`)
  if (!isNonemptyString(value.message)) errors.push(`${context}.message must be nonempty`)
  if (!Array.isArray(value.sourceIds)) errors.push(`${context}.sourceIds must be an array`)
  else value.sourceIds.forEach((id: unknown) => {
    if (!sourceIds.has(id as string)) errors.push(`${context}.sourceIds contains unknown source ${String(id)}`)
  })
  if (value.activityIds !== undefined && !Array.isArray(value.activityIds)) errors.push(`${context}.activityIds must be an array`)
  else if (Array.isArray(value.activityIds)) value.activityIds.forEach((id: unknown) => {
    if (!activityIds.has(id as string)) errors.push(`${context}.activityIds contains unknown activity ${String(id)}`)
  })
}

function checkPath(path: unknown, context: string, errors: string[]): void {
  if (!isNonemptyString(path)) {
    errors.push(`${context} must be nonempty`)
    return
  }
  if (path.startsWith('/') || /^[A-Za-z]:[\\/]/.test(path) || path.includes('\\')) errors.push(`${context} must be a relative POSIX path`)
  if (path.split('/').some((part) => part === '..' || part === '.')) errors.push(`${context} contains a dot path segment`)
  if (path.normalize('NFC') !== path) errors.push(`${context} must be NFC normalized`)
}

export function validateCurriculumDatabase(database: CurriculumDatabase): string[] {
  const errors: string[] = []
  const value = database as unknown as Record<string, any>
  if (!isRecord(value)) return ['database must be an object']

  const sources = value.sources
  const sourceById = new Map<string, Record<string, any>>()
  const sourcePaths = new Set<string>()
  const sourceFormats: Record<SourceFormat, number> = { docx: 0, pptx: 0, pdf: 0, png: 0, video: 0, audio: 0 }
  if (!Array.isArray(sources)) errors.push('database.sources must be an array')
  else {
    if (sources.length !== 76) errors.push(`database.sources must contain exactly 76 records (got ${sources.length})`)
    sources.forEach((source: unknown, index: number) => {
      const context = `sources[${index}]`
      if (!isRecord(source)) {
        errors.push(`${context} must be an object`)
        return
      }
      if (!isNonemptyString(source.sourceId)) errors.push(`${context}.sourceId must be nonempty`)
      else if (sourceById.has(source.sourceId)) errors.push(`${context}.sourceId is duplicated`)
      else sourceById.set(source.sourceId, source)
      checkPath(source.relativePath, `${context}.relativePath`, errors)
      if (typeof source.relativePath === 'string') {
        if (sourcePaths.has(source.relativePath)) errors.push(`${context}.relativePath is duplicated`)
        sourcePaths.add(source.relativePath)
      }
      if (!SOURCE_KINDS.includes(source.kind)) errors.push(`${context}.kind is invalid`)
      const format = sourceFormat(source.kind, source.relativePath)
      if (format) sourceFormats[format] += 1
      else errors.push(`${context} has no supported source format`)
      if (source.islandId !== null && !ISLAND_IDS.includes(source.islandId)) errors.push(`${context}.islandId is invalid`)
      if (source.byteSize !== null && !isNonnegativeInteger(source.byteSize)) errors.push(`${context}.byteSize must be nonnegative or null`)
      if (source.sha256 !== null && !isNonemptyString(source.sha256)) errors.push(`${context}.sha256 must be nonempty or null`)
      const status = source.extractionStatus ?? source.status
      if (!EXTRACTION_STATUSES.has(status)) errors.push(`${context} must include a valid extraction status`)
      if (source.media !== undefined && !Array.isArray(source.media)) errors.push(`${context}.media must be an array`)
      else if (Array.isArray(source.media)) source.media.forEach((media: unknown, mediaIndex: number) => {
        if (isRecord(media) && media.sourceId && media.sourceId !== source.sourceId) errors.push(`${context}.media[${mediaIndex}].sourceId does not match source`)
      })
    })
    ;(Object.keys(EXPECTED_SOURCE_FORMAT_COUNTS) as SourceFormat[]).forEach((format) => {
      if (sourceFormats[format] !== EXPECTED_SOURCE_FORMAT_COUNTS[format]) errors.push(`source format ${format} must have ${EXPECTED_SOURCE_FORMAT_COUNTS[format]} records (got ${sourceFormats[format]})`)
    })
  }

  const mediaAssets = value.mediaAssets
  const assets = new Map<string, Record<string, any>>()
  if (!Array.isArray(mediaAssets)) errors.push('database.mediaAssets must be an array')
  else mediaAssets.forEach((asset: unknown, index: number) => {
    const context = `mediaAssets[${index}]`
    if (!isRecord(asset)) {
      errors.push(`${context} must be an object`)
      return
    }
    if (!isNonemptyString(asset.assetId)) errors.push(`${context}.assetId must be nonempty`)
    else if (assets.has(asset.assetId)) errors.push(`${context}.assetId is duplicated`)
    else assets.set(asset.assetId, asset)
    if (asset.sha256 === null) {
      if (!isExplicitlyNonReady(asset.status)) errors.push(`${context}.sha256 must contain hash metadata`)
    } else if (!isSha256(asset.sha256)) {
      errors.push(`${context}.sha256 must be a valid SHA-256 digest`)
    }
    if (asset.sourceId && !sourceById.has(asset.sourceId)) errors.push(`${context}.sourceId is unknown`)
    if (isNonemptyString(asset.sourceId) && asset.relativePath !== undefined && asset.relativePath !== null) {
      const source = sourceById.get(asset.sourceId)
      if (source && asset.relativePath !== source.relativePath) errors.push(`${context}.relativePath does not match its source record`)
    }
  })

  const islands = value.islands
  const activityIds = new Set<string>()
  const allConflicts: unknown[] = []
  if (!Array.isArray(islands)) errors.push('database.islands must be an array')
  else {
    if (islands.length !== ISLAND_IDS.length) errors.push(`database.islands must contain exactly ${ISLAND_IDS.length} islands`)
    islands.forEach((island: unknown, index: number) => {
      const context = `islands[${index}]`
      const expectedId = ISLAND_IDS[index]
      const expectedActivityIds = expectedId === undefined ? undefined : ROSTER_ACTIVITY_IDS[expectedId]
      if (!isRecord(island)) {
        errors.push(`${context} must be an object`)
        return
      }
      if (island.id !== expectedId) errors.push(`${context}.id must be ${expectedId}`)
      if (island.order !== index + 1) errors.push(`${context}.order must be ${index + 1}`)
      checkTotals(island.declaredTotals, `${context}.declaredTotals`, errors)
      checkTotals(island.observedTotals, `${context}.observedTotals`, errors)
      if (!Array.isArray(island.activities)) errors.push(`${context}.activities must be an array`)
      else {
        if (expectedActivityIds && island.activities.length !== expectedActivityIds.length) {
          errors.push(`${context}.activities must contain exactly ${expectedActivityIds.length} activities (got ${island.activities.length})`)
        }
        const sequences = new Set<number>()
        island.activities.forEach((activity: unknown, activityIndex: number) => {
          const activityContext = `${context}.activities[${activityIndex}]`
          if (!isRecord(activity)) {
            errors.push(`${activityContext} must be an object`)
            return
          }
          const sequence = activity.sequence ?? activity.order
          if (!isPositiveInteger(sequence)) errors.push(`${activityContext}.sequence must be a positive integer`)
          else {
            if (sequences.has(sequence)) errors.push(`${activityContext}.sequence is duplicated`)
            sequences.add(sequence)
            if (sequence !== activityIndex + 1) errors.push(`${activityContext}.sequence must be contiguous starting at 1`)
          }
          if (activity.islandId !== island.id) errors.push(`${activityContext}.islandId does not match its island`)
          if (!ACTIVITY_TYPES.includes(activity.type)) errors.push(`${activityContext}.type is invalid`)
          if (!isNonemptyString(activity.activityId)) errors.push(`${activityContext}.activityId must be nonempty`)
          else if (activityIds.has(activity.activityId)) errors.push(`${activityContext}.activityId is duplicated`)
          else activityIds.add(activity.activityId)
          if (expectedActivityIds && activityIndex < expectedActivityIds.length) {
            const expectedActivityId = expectedActivityIds[activityIndex]
            if (activity.activityId !== expectedActivityId) {
              errors.push(`${activityContext}.activityId must be ${expectedActivityId}`)
            }
            if (activityIndex === expectedActivityIds.length - 1) {
              if (activity.type !== 'quiz') errors.push(`${activityContext}.type must be quiz for the final exam`)
              if (activity.countsTowardProgress !== false) {
                errors.push(`${activityContext}.countsTowardProgress must be false for the final exam`)
              }
            } else if (activity.countsTowardProgress !== true) {
              errors.push(`${activityContext}.countsTowardProgress must be true for an instructional activity`)
            }
          }
          if (!isFiniteNumber(activity.estimatedMinutes) || activity.estimatedMinutes <= 0) errors.push(`${activityContext}.estimatedMinutes must be positive`)
          if (!isFiniteNumber(activity.peepPointsValue) || activity.peepPointsValue < 0) errors.push(`${activityContext}.peepPointsValue must be nonnegative`)
          if (typeof activity.countsTowardProgress !== 'boolean') errors.push(`${activityContext}.countsTowardProgress must be boolean`)
          if (activity.repeatCount !== undefined && !isPositiveInteger(activity.repeatCount)) errors.push(`${activityContext}.repeatCount must be a positive integer`)
          checkSourceReferences(activity.provenance, `${activityContext}.provenance`, sourceById, errors)
          checkActivityPayload(activity, activityContext, assets, new Set(sourceById.keys()), sourceById, errors)
        })
      }
      if (!Array.isArray(island.conflicts)) errors.push(`${context}.conflicts must be an array`)
      else allConflicts.push(...island.conflicts)
    })
  }

  if (!Array.isArray(value.conflicts)) errors.push('database.conflicts must be an array')
  else allConflicts.push(...value.conflicts)
  const conflictIds = new Set<string>()
  allConflicts.forEach((conflict, index) => {
    const context = `conflicts[${index}]`
    if (isRecord(conflict) && conflict.conflictId && conflictIds.has(conflict.conflictId)) errors.push(`${context}.conflictId is duplicated`)
    if (isRecord(conflict) && conflict.conflictId) conflictIds.add(conflict.conflictId)
    checkConflict(conflict, context, new Set(sourceById.keys()), activityIds, errors)
  })

  const metadata = value.metadata
  if (!isRecord(metadata)) errors.push('database.metadata must be an object')
  else {
    if (!isNonemptyString(metadata.gameId)) errors.push('metadata.gameId must be nonempty')
    if (!isNonemptyString(metadata.title)) errors.push('metadata.title must be nonempty')
    if (!isNonemptyString(metadata.version)) errors.push('metadata.version must be nonempty')
    if (metadata.sourceFileCount !== 76) errors.push('metadata.sourceFileCount must be 76')
    if (!isRecord(metadata.sourceFormatCounts)) errors.push('metadata.sourceFormatCounts must be an object')
    else (Object.keys(EXPECTED_SOURCE_FORMAT_COUNTS) as SourceFormat[]).forEach((format) => {
      if (metadata.sourceFormatCounts[format] !== EXPECTED_SOURCE_FORMAT_COUNTS[format]) errors.push(`metadata.sourceFormatCounts.${format} must be ${EXPECTED_SOURCE_FORMAT_COUNTS[format]}`)
    })
  }
  return errors
}
