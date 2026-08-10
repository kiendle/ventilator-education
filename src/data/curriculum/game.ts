import type { ConflictRecord, GameMetadata } from './types'

const GAME_OUTLINE_SOURCE_ID = 'source-7effcb159366c230bc93'
const POSTER_PDF_SOURCE_ID = 'source-93cc317754afc48b484a'
const NAPKIN_SOURCE_ID = 'source-8ee71ce049b3c7b1ecea'

export const gameMetadata: GameMetadata = {
  gameId: 'gamer-icu',
  title: 'GAMER-ICU',
  version: 'rev58',
  sourceFileCount: 76,
  sourceFormatCounts: {
    docx: 26,
    pptx: 15,
    pdf: 6,
    png: 10,
    video: 17,
    audio: 2,
  },
}

export const globalConflicts: ConflictRecord[] = [
  {
    conflictId: 'global-outline-duration-total',
    scope: 'totals',
    status: 'needs_review',
    message: 'GameOutline states approximately 720 curriculum minutes and 120 minutes per island, while its six island TOTAL rows sum to 820 minutes.',
    sourceIds: [GAME_OUTLINE_SOURCE_ID],
    field: 'estimatedMinutes',
    declaredValue: { total: 720, perIsland: 120 },
    observedValue: { islandTableTotal: 820 },
  },
  {
    conflictId: 'global-outline-compliance-threshold',
    scope: 'totals',
    status: 'needs_review',
    message: 'GameOutline sets compliance at 80%, but its island table declarations use 12/16, 8/10, 10/13, 12/15, 9/12, and 8/10 activities.',
    sourceIds: [GAME_OUTLINE_SOURCE_ID],
    field: 'complianceThreshold',
    declaredValue: '80%',
    observedValue: ['12/16', '8/10', '10/13', '12/15', '9/12', '8/10'],
  },
  {
    conflictId: 'global-outline-poster-compensation',
    scope: 'content',
    status: 'needs_review',
    message: 'GameOutline describes $40 for participation and up to $140 for winning; Poster Draft with QR Code advertises up to $290 in study compensation.',
    sourceIds: [GAME_OUTLINE_SOURCE_ID, POSTER_PDF_SOURCE_ID],
    field: 'compensation',
    declaredValue: { participation: 40, winner: 140 },
    observedValue: { posterMaximum: 290 },
  },
  {
    conflictId: 'global-outline-poster-assessment-cadence',
    scope: 'content',
    status: 'needs_review',
    message: 'GameOutline names baseline, end-of-curriculum, and retention competency exams; Poster Draft with QR Code shows assessments at 0, 3, and 9 months.',
    sourceIds: [GAME_OUTLINE_SOURCE_ID, POSTER_PDF_SOURCE_ID],
    field: 'assessmentSchedule',
    declaredValue: ['baseline', 'end-of-curriculum', 'retention'],
    observedValue: ['0 months', '3 months', '9 months'],
  },
  {
    conflictId: 'global-napkin-incentive-draft',
    scope: 'content',
    status: 'needs_review',
    message: 'Napkin Scribbles proposes sponsor or gift-card incentives and peer-video voting, but GameOutline rev58 defines the authoritative remuneration and curriculum.',
    sourceIds: [GAME_OUTLINE_SOURCE_ID, NAPKIN_SOURCE_ID],
    field: 'incentives',
    declaredValue: 'GameOutline rev58 remuneration',
    observedValue: 'Napkin Scribbles ideation',
  },
]
