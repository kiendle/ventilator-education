export const ISLAND_IDS = [
  'lake-mucosa',
  'interlobar-divides',
  'valley-of-pulmonara',
  'bronchial-bluffs',
  'mount-pneumora',
  'alveolar-highlands',
] as const

export type IslandId = (typeof ISLAND_IDS)[number]

export const ROSTER_ACTIVITY_IDS: Readonly<Record<IslandId, readonly string[]>> = {
  'lake-mucosa': [
    'lm-01',
    'lm-02',
    'lm-03',
    'lm-04',
    'lm-05',
    'lm-06',
    'lm-07',
    'lm-08',
    'lm-09',
    'lm-10',
    'lm-11',
    'lm-12',
    'lm-13',
    'lm-14',
    'lm-15',
    'lm-16',
    'lm-final-exam',
  ],
  'interlobar-divides': [
    'id-01',
    'id-02',
    'id-03',
    'id-04',
    'id-05',
    'id-06',
    'id-07',
    'id-08',
    'id-09',
    'id-10',
    'id-11',
    'id-final-exam',
  ],
  'valley-of-pulmonara': [
    'vp-01',
    'vp-02',
    'vp-03',
    'vp-04',
    'vp-05',
    'vp-06',
    'vp-07',
    'vp-08',
    'vp-09',
    'vp-10',
    'vp-11',
    'vp-12',
    'vp-13',
    'vp-14',
    'vp-final-exam',
  ],
  'bronchial-bluffs': [
    'bb-01',
    'bb-02',
    'bb-03',
    'bb-04',
    'bb-05',
    'bb-06',
    'bb-07',
    'bb-08',
    'bb-09',
    'bb-10',
    'bb-11',
    'bb-12',
    'bb-13',
    'bb-14',
    'bb-final-exam',
  ],
  'mount-pneumora': [
    'mp-01',
    'mp-02',
    'mp-03',
    'mp-04',
    'mp-05',
    'mp-06',
    'mp-07',
    'mp-08',
    'mp-09',
    'mp-10',
    'mp-11',
    'mp-12',
    'mp-13',
    'mp-14',
    'mp-final-exam',
  ],
  'alveolar-highlands': [
    'ah-01',
    'ah-02',
    'ah-03',
    'ah-04',
    'ah-05',
    'ah-06',
    'ah-07',
    'ah-08',
    'ah-09',
    'ah-10',
    'ah-11',
    'ah-final-exam',
  ],
}

export type ActivityType =
  | 'video'
  | 'reading'
  | 'quiz'
  | 'case_vignette'
  | 'quest'
  | 'vent_lab'
  | 'pending'

export type ContentStatus = 'ready' | 'needs_review' | 'unavailable'

/** Source kinds are normalized categories; extension aliases are accepted for raw manifests. */
export type SourceKind =
  | 'docx'
  | 'pptx'
  | 'pdf'
  | 'png'
  | 'video'
  | 'audio'
  | 'mp4'
  | 'mov'
  | 'mp3'
  | 'unsupported'

export type SourceFormat = 'docx' | 'pptx' | 'pdf' | 'png' | 'video' | 'audio'

export const EXPECTED_SOURCE_FORMAT_COUNTS: Readonly<Record<SourceFormat, number>> = {
  docx: 26,
  pptx: 15,
  pdf: 6,
  png: 10,
  video: 17,
  audio: 2,
}

export type SourceExtractionStatus =
  | 'ready'
  | 'ok'
  | 'partial'
  | 'empty'
  | 'needs_review'
  | 'unavailable'
  | 'missing_dependency'
  | 'unsupported'
  | 'error'
  | 'missing'

export interface SourceExtractionError {
  code: string
  message?: string
  tool?: string
}

export interface ExtractedBlock {
  kind: string
  text?: string
  page?: number
  slide?: number
  startSeconds?: number
  endSeconds?: number
  [key: string]: unknown
}

export interface ExtractedSourceContent {
  text?: string
  blocks?: ExtractedBlock[]
  pages?: Array<{ page: number; text?: string }>
  slides?: Array<{ slide: number; text?: string }>
  metadata?: Record<string, string | number | boolean>
}

export type MediaKind = 'image' | 'video' | 'audio' | 'other'

/** A packaged asset is addressed by its immutable ID and digest, never by a URL. */
export interface MediaReference {
  assetId: string
  sha256: string | null
  byteSize?: number | null
  mimeType?: string
  altText?: string
}

export interface MediaAssetRecord extends MediaReference {
  kind: MediaKind | SourceFormat
  sourceId?: string
  relativePath?: string
  memberPath?: string | null
  storageKey?: string | null
  status?: SourceExtractionStatus
}

export type SourceLocator =
  | { kind: 'whole_file' }
  | { kind: 'page'; page: number }
  | { kind: 'slide'; slide: number }
  | { kind: 'time'; startSeconds: number; endSeconds?: number }

export interface SourceReference {
  sourceId: string
  relativePath: string
  locator: SourceLocator
  role?: 'content' | 'answer' | 'review' | 'media'
  excerpt?: string
}

export interface SourceFileRecord {
  sourceId: string
  relativePath: string
  kind: SourceKind
  islandId: IslandId | null
  byteSize: number | null
  sha256: string | null
  /** `status` and `extractionStatus` are both emitted by the raw extractor. */
  status?: SourceExtractionStatus
  extractionStatus?: SourceExtractionStatus
  extractionMethod?: string
  errors: Array<SourceExtractionError | string>
  missingDependencies?: string[]
  content?: ExtractedSourceContent | null
  extractedContent?: ExtractedSourceContent | null
  media?: MediaAssetRecord[]
  conflictIds?: string[]
}

export type ConflictScope = 'source' | 'activity' | 'island' | 'totals' | 'mapping' | 'content'
export type ConflictStatus = 'needs_review' | 'accepted' | 'resolved' | 'unavailable'

export interface ConflictRecord {
  conflictId: string
  scope: ConflictScope
  status: ConflictStatus
  message: string
  sourceIds: string[]
  activityIds?: string[]
  field?: string
  declaredValue?: unknown
  observedValue?: unknown
}

export type ReviewNotes = {
  rationale?: string
  explanation?: string
  feedback?: string
  notes?: string
  sourceReferences?: SourceReference[]
}

export interface VideoContent {
  media: MediaReference
  durationSeconds: number
  completionCondition:
    | { kind: 'ended' }
    | { kind: 'watched_fraction'; watchedFraction: number }
}

export interface ReadingChoice {
  id: string
  text: string
}

export interface ReadingConfirmationQuestion {
  prompt: string
  choices: ReadingChoice[]
  answer: { correctChoiceId: string }
  review?: ReviewNotes
}

export interface ReadingContent {
  body: string
  confirmationQuestion: ReadingConfirmationQuestion
}

export type QuizInteraction = 'mcq' | 'drag_drop' | 'matching' | 'fill_blank'
export type QuizQuestionType = QuizInteraction

export interface QuizChoice {
  id: string
  text: string
  media?: MediaReference
}

interface QuizQuestionBase {
  id: string
  prompt: string
  promptMedia?: MediaReference
  choices: QuizChoice[]
  review?: ReviewNotes
}

export interface McqQuestion extends QuizQuestionBase {
  interaction: 'mcq'
  answer: { interaction: 'mcq'; correctChoiceId: string }
}

export interface DragDropQuestion extends QuizQuestionBase {
  interaction: 'drag_drop'
  answer: { interaction: 'drag_drop'; placements: Record<string, string> }
}

export interface MatchingQuestion extends QuizQuestionBase {
  interaction: 'matching'
  answer: {
    interaction: 'matching'
    pairs: Array<{ leftChoiceId: string; rightChoiceId: string }>
  }
}

export interface FillBlankQuestion extends QuizQuestionBase {
  interaction: 'fill_blank'
  answer: {
    interaction: 'fill_blank'
    acceptedAnswers: string[]
    caseSensitive?: boolean
  }
}

export type QuizQuestion =
  | McqQuestion
  | DragDropQuestion
  | MatchingQuestion
  | FillBlankQuestion

export interface QuizContent {
  questions: QuizQuestion[]
}

export interface CaseDecision {
  id: string
  text: string
  nextId?: string
}

export interface CaseContent {
  scenario: string
  decisions: CaseDecision[]
  answer?: {
    acceptedDecisionIds?: string[]
    rationale?: string
  }
  sbar: {
    prompt: string
    review?: ReviewNotes
  }
}

export interface QuestContent {
  instructions: string
  supervisorRole: string
  offlineValidation: {
    method: 'supervisor_confirmation' | 'checklist' | 'local_attestation' | 'other'
    evidenceFields?: string[]
  }
  repeatCount?: number
  review?: ReviewNotes
}

export interface VentControl {
  id: string
  label: string
  kind: 'number' | 'select' | 'toggle' | 'action'
  options?: string[]
  unit?: string
  min?: number
  max?: number
}

export interface VentLabContent {
  controls: VentControl[]
  objectives: string[]
  feedback: {
    success: string
    incorrect: string
    review?: ReviewNotes
  }
  initialState?: Record<string, string | number | boolean>
  targetState?: Record<string, string | number | boolean>
}

interface CurriculumActivityBase {
  activityId: string
  islandId: IslandId
  sequence: number
  title: string
  description?: string
  estimatedMinutes: number
  peepPointsValue: number
  countsTowardProgress: boolean
  repeatCount?: number
  contentStatus: ContentStatus
  provenance: SourceReference[]
  conflictIds?: string[]
}

export interface VideoActivity extends CurriculumActivityBase {
  type: 'video'
  content: VideoContent | null
}

export interface ReadingActivity extends CurriculumActivityBase {
  type: 'reading'
  content: ReadingContent | null
}

export interface QuizActivity extends CurriculumActivityBase {
  type: 'quiz'
  content: QuizContent | null
}

export interface CaseVignetteActivity extends CurriculumActivityBase {
  type: 'case_vignette'
  content: CaseContent | null
}

export interface QuestActivity extends CurriculumActivityBase {
  type: 'quest'
  content: QuestContent | null
}

export interface VentLabActivity extends CurriculumActivityBase {
  type: 'vent_lab'
  content: VentLabContent | null
}

export interface PendingActivity extends CurriculumActivityBase {
  type: 'pending'
  contentStatus: 'unavailable'
  content: null
}

export type CurriculumActivity =
  | VideoActivity
  | ReadingActivity
  | QuizActivity
  | CaseVignetteActivity
  | QuestActivity
  | VentLabActivity
  | PendingActivity

export interface IslandTotals {
  activityCount: number
  estimatedMinutes: number
  peepPoints: number
  repeatInstances?: number
}

export interface CurriculumIsland {
  id: IslandId
  order: number
  name: string
  description?: string
  activities: CurriculumActivity[]
  declaredTotals: IslandTotals | null
  observedTotals: IslandTotals
  conflicts: ConflictRecord[]
}

export interface GameMetadata {
  gameId: string
  title: string
  version: string
  sourceFileCount: number
  sourceFormatCounts: Readonly<Record<SourceFormat, number>>
  sourceManifestSha256?: string
}

export interface CurriculumDatabase {
  metadata: GameMetadata
  islands: CurriculumIsland[]
  sources: SourceFileRecord[]
  mediaAssets: MediaAssetRecord[]
  conflicts: ConflictRecord[]
}
