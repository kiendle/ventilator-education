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
export interface RosterDescriptor {
  activityId: string
  title: string
  type: ActivityType
  estimatedMinutes: number
  peepPointsValue: number
  countsTowardProgress: boolean
}

export const ROSTER_DESCRIPTORS: Readonly<Record<IslandId, readonly RosterDescriptor[]>> = {
  'lake-mucosa': [
    { activityId: 'lm-01', title: 'Oxygenation & Mean Airway Pressure', type: 'video', estimatedMinutes: 10, peepPointsValue: 3, countsTowardProgress: true },
    { activityId: 'lm-02', title: 'Oxygenation & Mean Airway Pressure', type: 'reading', estimatedMinutes: 5, peepPointsValue: 2, countsTowardProgress: true },
    { activityId: 'lm-03', title: 'Oxygenation & Mean Airway Pressure', type: 'quiz', estimatedMinutes: 10, peepPointsValue: 3, countsTowardProgress: true },
    { activityId: 'lm-04', title: 'Ventilation & Minute Ventilation', type: 'video', estimatedMinutes: 10, peepPointsValue: 3, countsTowardProgress: true },
    { activityId: 'lm-05', title: 'Ventilation & Minute Ventilation', type: 'reading', estimatedMinutes: 5, peepPointsValue: 2, countsTowardProgress: true },
    { activityId: 'lm-06', title: 'Ventilation & Minute Ventilation', type: 'quiz', estimatedMinutes: 10, peepPointsValue: 3, countsTowardProgress: true },
    { activityId: 'lm-07', title: 'Airway Anatomy', type: 'reading', estimatedMinutes: 5, peepPointsValue: 1, countsTowardProgress: true },
    { activityId: 'lm-08', title: 'Pulmonary Anatomy', type: 'reading', estimatedMinutes: 5, peepPointsValue: 1, countsTowardProgress: true },
    { activityId: 'lm-09', title: 'Airway Sounds', type: 'quiz', estimatedMinutes: 10, peepPointsValue: 3, countsTowardProgress: true },
    { activityId: 'lm-10', title: 'Non-invasive Ventilation Monitoring (TCOM vs EtCO2)', type: 'quiz', estimatedMinutes: 10, peepPointsValue: 3, countsTowardProgress: true },
    { activityId: 'lm-11', title: 'Oxygenation vs Ventilation', type: 'quiz', estimatedMinutes: 10, peepPointsValue: 3, countsTowardProgress: true },
    { activityId: 'lm-12', title: 'Ventilator Interfaces 101 - Drager', type: 'video', estimatedMinutes: 5, peepPointsValue: 1, countsTowardProgress: true },
    { activityId: 'lm-13', title: 'Ventilator Interfaces 101 - Servo i/u', type: 'video', estimatedMinutes: 5, peepPointsValue: 1, countsTowardProgress: true },
    { activityId: 'lm-14', title: 'Ventilator Interfaces 101 - Breas', type: 'video', estimatedMinutes: 5, peepPointsValue: 1, countsTowardProgress: true },
    { activityId: 'lm-15', title: 'Boost FiO2 on All Vents', type: 'vent_lab', estimatedMinutes: 10, peepPointsValue: 5, countsTowardProgress: true },
    { activityId: 'lm-16', title: 'Suctioning 101', type: 'quest', estimatedMinutes: 15, peepPointsValue: 10, countsTowardProgress: true },
    { activityId: 'lm-final-exam', title: 'Lake Mucosa Final Exam', type: 'quiz', estimatedMinutes: 20, peepPointsValue: 0, countsTowardProgress: false },
  ],
  'interlobar-divides': [
    { activityId: 'id-01', title: 'Lung Compliance 101', type: 'video', estimatedMinutes: 10, peepPointsValue: 1, countsTowardProgress: true },
    { activityId: 'id-02', title: 'Ventilator Basics: Independent and Dependent Variables', type: 'video', estimatedMinutes: 15, peepPointsValue: 2, countsTowardProgress: true },
    { activityId: 'id-03', title: 'Ventilator Basics: Independent and Dependent Variables', type: 'case_vignette', estimatedMinutes: 15, peepPointsValue: 5, countsTowardProgress: true },
    { activityId: 'id-04', title: 'Ventilator Modes: The Decision Trees', type: 'video', estimatedMinutes: 5, peepPointsValue: 1, countsTowardProgress: true },
    { activityId: 'id-05', title: 'Ventilator Modes: PC vs PRVC in the PICU', type: 'reading', estimatedMinutes: 5, peepPointsValue: 1, countsTowardProgress: true },
    { activityId: 'id-06', title: 'Ventilator Modes: Determining Which Mode You Are In', type: 'vent_lab', estimatedMinutes: 10, peepPointsValue: 3, countsTowardProgress: true },
    { activityId: 'id-07', title: 'Ventilator Modes: Choosing a Mode', type: 'case_vignette', estimatedMinutes: 10, peepPointsValue: 5, countsTowardProgress: true },
    { activityId: 'id-08', title: 'Determining Compliance', type: 'quest', estimatedMinutes: 15, peepPointsValue: 5, countsTowardProgress: true },
    { activityId: 'id-09', title: 'CVICU Ventilator Strategies and Norms', type: 'video', estimatedMinutes: 10, peepPointsValue: 1, countsTowardProgress: true },
    { activityId: 'id-10', title: 'CCDH Ventilator Strategies and Norms', type: 'video', estimatedMinutes: 10, peepPointsValue: 1, countsTowardProgress: true },
    { activityId: 'id-11', title: 'Ventilator Settings: Selecting Initial Settings for a Healthy Lung', type: 'case_vignette', estimatedMinutes: 20, peepPointsValue: 5, countsTowardProgress: true },
    { activityId: 'id-final-exam', title: 'Interlobar Divides Final Exam', type: 'quiz', estimatedMinutes: 20, peepPointsValue: 0, countsTowardProgress: false },
  ],
  'valley-of-pulmonara': [
    { activityId: 'vp-01', title: 'Bronchiolitis Pathophysiology', type: 'video', estimatedMinutes: 10, peepPointsValue: 2, countsTowardProgress: true },
    { activityId: 'vp-02', title: 'Asthma Pathophysiology', type: 'video', estimatedMinutes: 10, peepPointsValue: 2, countsTowardProgress: true },
    { activityId: 'vp-03', title: 'Tracheobronchomalacia', type: 'video', estimatedMinutes: 10, peepPointsValue: 2, countsTowardProgress: true },
    { activityId: 'vp-04', title: 'ARDS Pathophysiology', type: 'video', estimatedMinutes: 10, peepPointsValue: 2, countsTowardProgress: true },
    { activityId: 'vp-05', title: 'ARDS: Lung Protective Strategies', type: 'reading', estimatedMinutes: 5, peepPointsValue: 1, countsTowardProgress: true },
    { activityId: 'vp-06', title: 'Captured: Using Language to Depict Illness Severity and Course', type: 'video', estimatedMinutes: 5, peepPointsValue: 1, countsTowardProgress: true },
    { activityId: 'vp-07', title: 'Vent Alarms 101', type: 'video', estimatedMinutes: 15, peepPointsValue: 3, countsTowardProgress: true },
    { activityId: 'vp-08', title: 'Special Considerations for EAT Patients', type: 'video', estimatedMinutes: 5, peepPointsValue: 1, countsTowardProgress: true },
    { activityId: 'vp-09', title: 'Guess That Disease', type: 'vent_lab', estimatedMinutes: 10, peepPointsValue: 5, countsTowardProgress: true },
    { activityId: 'vp-10', title: 'Guess That Disease', type: 'case_vignette', estimatedMinutes: 10, peepPointsValue: 3, countsTowardProgress: true },
    { activityId: 'vp-11', title: 'Effective Communication: Vent Alarms (RT)', type: 'quest', estimatedMinutes: 20, peepPointsValue: 10, countsTowardProgress: true },
    { activityId: 'vp-12', title: 'Effective Communication: Vent Alarms (Provider)', type: 'quest', estimatedMinutes: 20, peepPointsValue: 10, countsTowardProgress: true },
    { activityId: 'vp-13', title: 'Ventilator-Associated Pneumonia: Background and Sequelae', type: 'reading', estimatedMinutes: 10, peepPointsValue: 2, countsTowardProgress: true },
    { activityId: 'vp-14', title: 'Ventilator-Associated Pneumonia: Prevention', type: 'quiz', estimatedMinutes: 5, peepPointsValue: 2, countsTowardProgress: true },
    { activityId: 'vp-final-exam', title: 'Valley of Pulmonara Final Exam', type: 'quiz', estimatedMinutes: 20, peepPointsValue: 0, countsTowardProgress: false },
  ],
  'bronchial-bluffs': [
    { activityId: 'bb-01', title: 'CXR Interpretation', type: 'video', estimatedMinutes: 10, peepPointsValue: 1, countsTowardProgress: true },
    { activityId: 'bb-02', title: 'CXR Interpretation', type: 'reading', estimatedMinutes: 5, peepPointsValue: 1, countsTowardProgress: true },
    { activityId: 'bb-03', title: 'Guess That Disease', type: 'quiz', estimatedMinutes: 10, peepPointsValue: 3, countsTowardProgress: true },
    { activityId: 'bb-04', title: 'Goldilocks and the 3 ETTs', type: 'quiz', estimatedMinutes: 10, peepPointsValue: 3, countsTowardProgress: true },
    { activityId: 'bb-05', title: 'CXR in Real Life', type: 'quest', estimatedMinutes: 10, peepPointsValue: 5, countsTowardProgress: true },
    { activityId: 'bb-06', title: 'Blood Gas Interpretation: Part 1', type: 'video', estimatedMinutes: 10, peepPointsValue: 2, countsTowardProgress: true },
    { activityId: 'bb-07', title: 'Blood Gas Interpretation: Identify the Gas', type: 'quiz', estimatedMinutes: 15, peepPointsValue: 3, countsTowardProgress: true },
    { activityId: 'bb-08', title: 'Blood Gas Interpretation: Part 2', type: 'video', estimatedMinutes: 10, peepPointsValue: 2, countsTowardProgress: true },
    { activityId: 'bb-09', title: 'Blood Gas Interpretation: Act on the Gas', type: 'quiz', estimatedMinutes: 15, peepPointsValue: 3, countsTowardProgress: true },
    { activityId: 'bb-10', title: 'Blood Gas Interpretation: Summary Graphic', type: 'reading', estimatedMinutes: 5, peepPointsValue: 1, countsTowardProgress: true },
    { activityId: 'bb-11', title: 'How to Bag 101', type: 'video', estimatedMinutes: 10, peepPointsValue: 1, countsTowardProgress: true },
    { activityId: 'bb-12', title: 'BVM Deliberate Practice', type: 'quest', estimatedMinutes: 20, peepPointsValue: 10, countsTowardProgress: true },
    { activityId: 'bb-13', title: 'Troubleshooting Ineffective BVM', type: 'quiz', estimatedMinutes: 10, peepPointsValue: 3, countsTowardProgress: true },
    { activityId: 'bb-14', title: 'Bronchial Bluffs Activity Slot 14 (descriptor pending)', type: 'pending', estimatedMinutes: 1, peepPointsValue: 0, countsTowardProgress: true },
    { activityId: 'bb-final-exam', title: 'Bronchial Bluffs Final Exam', type: 'quiz', estimatedMinutes: 20, peepPointsValue: 0, countsTowardProgress: false },
  ],
  'mount-pneumora': [
    { activityId: 'mp-01', title: 'Ventilator Dys-synchrony', type: 'video', estimatedMinutes: 10, peepPointsValue: 1, countsTowardProgress: true },
    { activityId: 'mp-02', title: 'Sedation Considerations', type: 'video', estimatedMinutes: 5, peepPointsValue: 1, countsTowardProgress: true },
    { activityId: 'mp-03', title: 'Introduction to HFOV', type: 'video', estimatedMinutes: 10, peepPointsValue: 1, countsTowardProgress: true },
    { activityId: 'mp-04', title: 'Welcome to My Crib: HFOV', type: 'video', estimatedMinutes: 5, peepPointsValue: 1, countsTowardProgress: true },
    { activityId: 'mp-05', title: 'Introduction to APRV', type: 'video', estimatedMinutes: 10, peepPointsValue: 1, countsTowardProgress: true },
    { activityId: 'mp-06', title: 'Welcome to My Crib: APRV', type: 'video', estimatedMinutes: 5, peepPointsValue: 1, countsTowardProgress: true },
    { activityId: 'mp-07', title: 'Escalating Care: Case 1', type: 'case_vignette', estimatedMinutes: 10, peepPointsValue: 3, countsTowardProgress: true },
    { activityId: 'mp-08', title: 'Escalating Care: Case 2', type: 'case_vignette', estimatedMinutes: 10, peepPointsValue: 3, countsTowardProgress: true },
    { activityId: 'mp-09', title: 'HFOV vs APRV', type: 'quiz', estimatedMinutes: 10, peepPointsValue: 3, countsTowardProgress: true },
    { activityId: 'mp-10', title: 'Weaning from non-CMV', type: 'video', estimatedMinutes: 10, peepPointsValue: 1, countsTowardProgress: true },
    { activityId: 'mp-11', title: 'Ventilator Adjuncts: iNO', type: 'reading', estimatedMinutes: 10, peepPointsValue: 2, countsTowardProgress: true },
    { activityId: 'mp-12', title: 'Go from iNO to I KNOW', type: 'quiz', estimatedMinutes: 10, peepPointsValue: 3, countsTowardProgress: true },
    { activityId: 'mp-13', title: 'Understanding the non-CMV Interface', type: 'vent_lab', estimatedMinutes: 20, peepPointsValue: 5, countsTowardProgress: true },
    { activityId: 'mp-14', title: 'Understanding the non-CMV Rationale', type: 'quest', estimatedMinutes: 20, peepPointsValue: 10, countsTowardProgress: true },
    { activityId: 'mp-final-exam', title: 'Mount Pneumora Final Exam', type: 'quiz', estimatedMinutes: 20, peepPointsValue: 0, countsTowardProgress: false },
  ],
  'alveolar-highlands': [
    { activityId: 'ah-01', title: 'DOPE and Other Considerations for Airway Emergencies', type: 'video', estimatedMinutes: 10, peepPointsValue: 1, countsTowardProgress: true },
    { activityId: 'ah-02', title: 'UE in the CT Scanner', type: 'case_vignette', estimatedMinutes: 15, peepPointsValue: 3, countsTowardProgress: true },
    { activityId: 'ah-03', title: 'Intubating an Asthmatic', type: 'case_vignette', estimatedMinutes: 15, peepPointsValue: 3, countsTowardProgress: true },
    { activityId: 'ah-04', title: 'ARDS: Capturing at Peak Illness', type: 'case_vignette', estimatedMinutes: 15, peepPointsValue: 3, countsTowardProgress: true },
    { activityId: 'ah-05', title: 'Extubation Readiness', type: 'case_vignette', estimatedMinutes: 15, peepPointsValue: 3, countsTowardProgress: true },
    { activityId: 'ah-06', title: 'Alarm Alert: Low MV', type: 'vent_lab', estimatedMinutes: 10, peepPointsValue: 5, countsTowardProgress: true },
    { activityId: 'ah-07', title: 'Vent Alarms', type: 'quiz', estimatedMinutes: 10, peepPointsValue: 3, countsTowardProgress: true },
    { activityId: 'ah-08', title: 'Blood Gas Analysis and Intervention', type: 'quiz', estimatedMinutes: 10, peepPointsValue: 3, countsTowardProgress: true },
    { activityId: 'ah-09', title: 'BVM (RT)', type: 'quest', estimatedMinutes: 15, peepPointsValue: 10, countsTowardProgress: true },
    { activityId: 'ah-10', title: 'Blood Gas Interpretation (Provider)', type: 'quest', estimatedMinutes: 15, peepPointsValue: 10, countsTowardProgress: true },
    { activityId: 'ah-11', title: 'ERT (RT)', type: 'quest', estimatedMinutes: 15, peepPointsValue: 10, countsTowardProgress: true },
    { activityId: 'ah-final-exam', title: 'Alveolar Highlands Final Exam', type: 'quiz', estimatedMinutes: 20, peepPointsValue: 0, countsTowardProgress: false },
  ],
}

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
  targets: QuizChoice[]
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

export type QuizResponse =
  | { interaction: 'mcq'; choiceId: string }
  | { interaction: 'drag_drop'; placements: Record<string, string> }
  | {
      interaction: 'matching'
      pairs: Array<{ leftChoiceId: string; rightChoiceId: string }>
    }
  | { interaction: 'fill_blank'; value: string }

export type ActivitySubmission =
  | { type: 'video'; ended: boolean; watchedFraction: number }
  | { type: 'reading'; choiceId: string }
  | { type: 'quiz'; answers: Record<string, QuizResponse> }
  | { type: 'case_vignette'; decisionIds: string[]; sbar: string }
  | { type: 'quest'; evidence: Record<string, string | boolean> }
  | { type: 'vent_lab'; state: Record<string, string | number | boolean> }

export type GradeStatus = 'passed' | 'failed' | 'pending_manual' | 'unavailable'

export interface GradeItem {
  itemId: string
  correct: boolean
  feedback?: string
}

export interface ActivityGrade {
  activityId: string
  status: GradeStatus
  correctCount: number
  totalCount: number
  pointsEarned: number
  maxPoints: number
  items: GradeItem[]
  reason?: string
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
