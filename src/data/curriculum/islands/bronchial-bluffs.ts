import { exactSourceBlocks, exactSourceText, mediaRefForSource, sourceRef } from '../generated-data'
import type {
  CurriculumIsland,
  MediaReference,
  QuizQuestion,
  SourceLocator,
  SourceReference,
} from '../types'

const wholeFile = { kind: 'whole_file' } as const
const outlinePath = 'GameOutline.docx'
const cxrDeckPath = '4. Bronchial Bluffs/Chest XRay interpretation GAMER.pptx'
const cxrVideoPath = '4. Bronchial Bluffs/ChestXray_video.mp4'
const cxrQuizPath = '4. Bronchial Bluffs/Guess that disease_Quiz.docx'
const ettQuizPath = '4. Bronchial Bluffs/Goldilocks and the 3 Endotracheal Tubes_Quiz.docx'
const identifyGasPath = '4. Bronchial Bluffs/Blood Gas Quiz - Identify the Gas.docx'
const identifyGasVideoPath =
  '4. Bronchial Bluffs/Blood Gas Interpretation Part 1 - Identify the Gas.mp4'
const actGasPath = '4. Bronchial Bluffs/Blood Gas Quiz - Act on the Gas.docx'
const actGasVideoPath = '4. Bronchial Bluffs/Blood Gas Interpretation Part 2 - Act on the Gas.mp4'
const abgAnswerKeyPath =
  '4. Bronchial Bluffs/Gamer-ICU Quiz ABG interpretation Bronchial Bluffs.docx'
const abgGraphicPath = '4. Bronchial Bluffs/Blood Gas Interpretation Infographic.pdf'
const baggingBriefPath = '4. Bronchial Bluffs/Bagging 201 video.docx'
const bvmQuestPath = '4. Bronchial Bluffs/BVM Deliberate Practice_Quest7.png'
const bvmQuizPath =
  '4. Bronchial Bluffs/GamerICU Bronchial Bluffs – Troubleshooting ineffective BVM.docx'
const cxrQuestPath = '4. Bronchial Bluffs/CXR in Real Life_Quest6.png'

const ref = (
  relativePath: string,
  locator: SourceLocator = wholeFile,
  role: 'content' | 'answer' | 'review' | 'media' = 'content',
  excerpt?: string
): SourceReference => sourceRef(relativePath, locator, role, excerpt)

const media = (relativePath: string, altText: string, memberPath?: string): MediaReference => ({
  ...mediaRefForSource(relativePath, memberPath),
  altText,
})

const review = (
  relativePath: string,
  explanation: string,
  excerpt: string,
  locator: SourceLocator = wholeFile
): { explanation: string; sourceReferences: SourceReference[] } => ({
  explanation: exactSourceText(relativePath),
  sourceReferences: [ref(relativePath, locator, 'review', excerpt)],
})

const mcq = (
  id: string,
  prompt: string,
  choices: Array<{ id: string; text: string; media?: MediaReference }>,
  correctChoiceId: string,
  questionReview?: { explanation: string; sourceReferences: SourceReference[] }
): QuizQuestion => ({
  id,
  prompt,
  interaction: 'mcq',
  choices,
  answer: { interaction: 'mcq', correctChoiceIds: [correctChoiceId] },
  ...(questionReview ? { review: questionReview } : {}),
})

const dragDrop = (
  id: string,
  prompt: string,
  choices: Array<{ id: string; text: string }>,
  targets: Array<{ id: string; text: string }>,
  placements: Record<string, string>,
  questionReview?: { explanation: string; sourceReferences: SourceReference[] }
): QuizQuestion => ({
  id,
  prompt,
  interaction: 'drag_drop',
  choices,
  targets,
  answer: { interaction: 'drag_drop', placements },
  ...(questionReview ? { review: questionReview } : {}),
})

const outline = ref(
  outlinePath,
  wholeFile,
  'content',
  'Bronchial Bluffs roster and declared TOTAL: 15 activities, 155 minutes, 39 PEEP Points.'
)

const cxrVideoMedia = media(cxrVideoPath, 'Chest X-ray interpretation video.')
const identifyGasVideoMedia = media(
  identifyGasVideoPath,
  'Blood gas interpretation Part 1 video: identify the gas.'
)
const actGasVideoMedia = media(
  actGasVideoPath,
  'Blood gas interpretation Part 2 video: act on the gas.'
)

const goldilocksMedia = (index: number, label: string): MediaReference =>
  media(ettQuizPath, label, `word/media/image${index}.png`)

const guessMedia = (index: number, extension: 'png' | 'jpeg', label: string): MediaReference =>
  media(cxrQuizPath, label, `word/media/image${index}.${extension}`)

const cxrReadingBody = exactSourceText(cxrDeckPath)

const cxrReadingQuestion = {
  prompt: 'In the CXR deck, which approach is emphasized to avoid missing important elements?',
  choices: [
    { id: 'standardized', text: 'Find a standardized order and stick to it.' },
    { id: 'report-only', text: 'Read the radiology report without first reviewing the film.' },
    { id: 'rotation-only', text: 'Assess rotation and no other technique features.' },
  ],
  answer: { correctChoiceId: 'standardized' },
  review: review(
    cxrDeckPath,
    'The deck says to find a standardized order and stick to it because doing the same way avoids missing important elements.',
    'Find a standardized order and STICK TO IT! Doing it the same way avoids missing important elements.',
    { kind: 'slide', slide: 10 }
  ),
}

const guessThatDiseaseQuestions: QuizQuestion[] = [
  mcq(
    'bb03-q1',
    'A patient with fever and this CXR: which condition is identified in the source answer key?',
    [
      {
        id: 'pneumonia',
        text: 'Pneumonia',
        media: guessMedia(
          1,
          'png',
          'Embedded CXR image for question 1; exact first-image mapping is marked for review.'
        ),
      },
      { id: 'atelectasis', text: 'Atelectasis' },
      { id: 'effusion', text: 'Right-sided pleural effusion' },
      { id: 'pneumothorax', text: 'Pneumothorax' },
    ],
    'pneumonia',
    review(
      cxrQuizPath,
      'The answer key calls this pneumonia and describes unilateral consolidation; it distinguishes atelectasis by the absence of tracheal deviation toward the consolidation.',
      'Pneumonia: this CXR demonstrates a unilateral consolidation.'
    )
  ),
  mcq(
    'bb03-q2',
    'A patient with fever and this CXR: which condition is identified in the source answer key?',
    [
      { id: 'pneumonia', text: 'Pneumonia' },
      {
        id: 'atelectasis',
        text: 'Atelectasis',
        media: guessMedia(3, 'jpeg', 'Embedded CXR image for question 2.'),
      },
      { id: 'effusion', text: 'Right-sided pleural effusion' },
      { id: 'pneumothorax', text: 'Pneumothorax' },
    ],
    'atelectasis',
    review(
      cxrQuizPath,
      'The source identifies atelectasis and explains that collapse may pull surrounding structures down, is often wedge shaped, and can be distinguished from pneumonia by tracheal deviation.',
      'Atelectasis ... may also present with fever ... often “wedge shaped” because collapse follows an anatomic area.'
    )
  ),
  mcq(
    'bb03-q3',
    'A patient who recently had the flu and now has this CXR: which condition is identified in the source answer key?',
    [
      { id: 'pneumonia', text: 'Pneumonia' },
      { id: 'atelectasis', text: 'Atelectasis' },
      {
        id: 'effusion',
        text: 'Right-sided pleural effusion',
        media: guessMedia(4, 'jpeg', 'Embedded CXR image for question 3.'),
      },
      { id: 'ards', text: 'Acute Respiratory Distress Syndrome (ARDS)' },
    ],
    'effusion',
    review(
      cxrQuizPath,
      'The answer key identifies a right-sided pleural effusion by loss of the costophrenic angle and a meniscus sign; a large effusion can push the trachea/mediastinum away.',
      'Right-sided pleural effusion: loss of the costophrenic angle and a “meniscus sign”.'
    )
  ),
  mcq(
    'bb03-q4',
    'A patient with sickle cell disease and this CXR has ____ chest.',
    [
      {
        id: 'acute-chest',
        text: 'Acute Chest',
        media: guessMedia(5, 'jpeg', 'Embedded CXR image for question 4.'),
      },
      { id: 'pneumonia', text: 'Pneumonia' },
      { id: 'atelectasis', text: 'Atelectasis' },
      { id: 'ards', text: 'Acute Respiratory Distress Syndrome (ARDS)' },
    ],
    'acute-chest',
    review(
      cxrQuizPath,
      'The source says any patient with sickle cell disease, hypoxia, and a new CXR consolidation is considered to have Acute Chest.',
      'Any patient with sickle cell disease, hypoxia, and a new CXR consolidation is considered to have Acute Chest.'
    )
  ),
  mcq(
    'bb03-q5',
    'A patient with sudden hypoxia and this CXR: which condition is identified in the source answer key?',
    [
      {
        id: 'pneumothorax',
        text: 'Pneumothorax',
        media: guessMedia(6, 'jpeg', 'Embedded CXR image for question 5.'),
      },
      { id: 'pneumonia', text: 'Pneumonia' },
      { id: 'atelectasis', text: 'Atelectasis' },
      { id: 'effusion', text: 'Right-sided pleural effusion' },
    ],
    'pneumothorax',
    review(
      cxrQuizPath,
      'The source says absence of lung markings to the periphery on the right suggests a large pneumothorax and emphasizes tracing the periphery on every CXR.',
      'Pneumothorax: absence of lung markings to the periphery on the right suggests a large pneumothorax.'
    )
  ),
  mcq(
    'bb03-q6',
    'A patient with severe hypoxemia and this CXR: which condition is identified in the source answer key?',
    [
      {
        id: 'ards',
        text: 'Acute Respiratory Distress Syndrome (ARDS)',
        media: guessMedia(7, 'jpeg', 'Embedded CXR image for question 6.'),
      },
      { id: 'pneumonia', text: 'Pneumonia' },
      { id: 'effusion', text: 'Right-sided pleural effusion' },
      { id: 'atelectasis', text: 'Atelectasis' },
    ],
    'ards',
    review(
      cxrQuizPath,
      'The source defines ARDS here as hypoxemia plus unilateral or bilateral infiltrates not caused alone by simple fluid overload, congenital heart disease, or pre-existing chronic lung disease; the image shows significant bilateral white-out.',
      'Acute Respiratory Distress Syndrome (ARDS): ... hypoxemia plus unilateral or bilateral infiltrates ... significant bilateral white-out.'
    )
  ),
]

const goldilocksQuestions: QuizQuestion[] = [
  mcq(
    'bb04-q1',
    'Classify the first ETT image.',
    [
      {
        id: 'too-deep',
        text: 'Too deep',
        media: goldilocksMedia(1, 'Embedded ETT-position CXR 1.'),
      },
      { id: 'too-shallow', text: 'Too shallow' },
      { id: 'just-right', text: 'Just right' },
    ],
    'too-deep',
    review(
      ettQuizPath,
      'The source places the ETT around T5, deep to the carina and in the right mainstem bronchus; it says ETT positioning should be roughly between T2–T4.',
      'TOO DEEP! Recall that the carina is usually around T4. Here, the ETT is around T5 and appears to be deep to the carina, in the right mainstem bronchus.'
    )
  ),
  mcq(
    'bb04-q2',
    'Classify the second ETT image.',
    [
      { id: 'too-deep', text: 'Too deep' },
      {
        id: 'too-shallow',
        text: 'Too shallow',
        media: goldilocksMedia(2, 'Embedded ETT-position CXR 2.'),
      },
      { id: 'just-right', text: 'Just right' },
    ],
    'too-shallow',
    review(
      ettQuizPath,
      'The source places this ETT above the thoracic inlet and says clavicles are not the standard for determining correct ETT positioning; it recalls the ideal T2–T4 position.',
      'TOO SHALLOW! This ETT is located above the thoracic inlet ... clavicles are not the standard for determining correct ETT positioning.'
    )
  ),
  mcq(
    'bb04-q3',
    'Classify the third ETT image.',
    [
      {
        id: 'too-deep',
        text: 'Too deep',
        media: goldilocksMedia(3, 'Embedded ETT-position CXR 3.'),
      },
      { id: 'too-shallow', text: 'Too shallow' },
      { id: 'just-right', text: 'Just right' },
    ],
    'too-deep',
    review(
      ettQuizPath,
      'The source labels this borderline image too deep because the tube lies directly at the carina. For a neonate, it recommends discussing a very minor retraction or monitoring because a small movement can change the CXR/clinical position.',
      'TOO DEEP! This tube ... lies directly at the carina ... Because this film appears to be of a neonate, retracting the ETT even just a little bit could result in a large change.'
    )
  ),
  mcq(
    'bb04-q4',
    'Classify the fourth ETT image.',
    [
      {
        id: 'too-deep',
        text: 'Too deep',
        media: goldilocksMedia(4, 'Embedded ETT-position CXR 4.'),
      },
      { id: 'too-shallow', text: 'Too shallow' },
      { id: 'just-right', text: 'Just right' },
    ],
    'too-deep',
    review(
      ettQuizPath,
      'The source labels this borderline image too deep because the tube lies directly at the carina and says a slight retraction is likely safe and feasible for a larger child or adult.',
      'TOO DEEP! ... Because this film is of a larger child or adult instead of a neonate, a slight retraction is likely safe and feasible.'
    )
  ),
  mcq(
    'bb04-q5',
    'Classify the fifth ETT image.',
    [
      { id: 'too-deep', text: 'Too deep' },
      { id: 'too-shallow', text: 'Too shallow' },
      {
        id: 'just-right',
        text: 'Just right',
        media: goldilocksMedia(5, 'Embedded ETT-position CXR 5.'),
      },
    ],
    'just-right',
    review(
      ettQuizPath,
      'The source labels this image just right because the ETT is approximately at T3 and roughly equidistant from the thoracic inlet and the carina.',
      'JUST RIGHT! This ETT is located at approximately T3, and roughly equidistant from the thoracic inlet and the carina.'
    )
  ),
]

const identifyGasQuestions: QuizQuestion[] = [
  mcq(
    'bb07-q1',
    'Sort this ABG: pH 7.28 | pCO₂ 55 | HCO₃⁻ 24.',
    [
      { id: 'acidosis-respiratory-uncompensated', text: 'Acidosis | Respiratory | Uncompensated' },
      {
        id: 'alkalosis-respiratory-uncompensated',
        text: 'Alkalosis | Respiratory | Uncompensated',
      },
      { id: 'acidosis-metabolic-uncompensated', text: 'Acidosis | Metabolic | Uncompensated' },
      {
        id: 'acidosis-respiratory-compensated',
        text: 'Acidosis | Respiratory | Fully compensated',
      },
    ],
    'acidosis-respiratory-uncompensated',
    review(
      identifyGasPath,
      'The source answer key sorts this gas as acidosis, respiratory, uncompensated.',
      'pH 7.28 | pCO2 55 | HCO3- 24 → Acidosis | Respiratory | Uncompensated.'
    )
  ),
  mcq(
    'bb07-q2',
    'Sort this ABG: pH 7.50 | pCO₂ 30 | HCO₃⁻ 23.',
    [
      { id: 'acidosis-respiratory-uncompensated', text: 'Acidosis | Respiratory | Uncompensated' },
      {
        id: 'alkalosis-respiratory-uncompensated',
        text: 'Alkalosis | Respiratory | Uncompensated',
      },
      { id: 'alkalosis-metabolic-uncompensated', text: 'Alkalosis | Metabolic | Uncompensated' },
      {
        id: 'alkalosis-respiratory-compensated',
        text: 'Alkalosis | Respiratory | Fully compensated',
      },
    ],
    'alkalosis-respiratory-uncompensated',
    review(
      identifyGasPath,
      'The source answer key sorts this gas as alkalosis, respiratory, uncompensated.',
      'pH 7.50 | pCO2 30 | HCO3- 23 → Alkalosis | Respiratory | Uncompensated.'
    )
  ),
  mcq(
    'bb07-q3',
    'Sort this ABG: pH 7.25 | pCO₂ 38 | HCO₃⁻ 16.',
    [
      { id: 'acidosis-metabolic-uncompensated', text: 'Acidosis | Metabolic | Uncompensated' },
      { id: 'acidosis-respiratory-uncompensated', text: 'Acidosis | Respiratory | Uncompensated' },
      { id: 'alkalosis-metabolic-uncompensated', text: 'Alkalosis | Metabolic | Uncompensated' },
      { id: 'acidosis-metabolic-compensated', text: 'Acidosis | Metabolic | Fully compensated' },
    ],
    'acidosis-metabolic-uncompensated',
    review(
      identifyGasPath,
      'The source answer key sorts this gas as acidosis, metabolic, uncompensated.',
      'pH 7.25 | pCO2 38 | HCO3- 16 → Acidosis | Metabolic | Uncompensated.'
    )
  ),
  mcq(
    'bb07-q4',
    'Sort this ABG: pH 7.48 | pCO₂ 42 | HCO₃⁻ 31.',
    [
      { id: 'alkalosis-metabolic-uncompensated', text: 'Alkalosis | Metabolic | Uncompensated' },
      {
        id: 'alkalosis-respiratory-uncompensated',
        text: 'Alkalosis | Respiratory | Uncompensated',
      },
      { id: 'acidosis-metabolic-uncompensated', text: 'Acidosis | Metabolic | Uncompensated' },
      { id: 'alkalosis-metabolic-compensated', text: 'Alkalosis | Metabolic | Fully compensated' },
    ],
    'alkalosis-metabolic-uncompensated',
    review(
      identifyGasPath,
      'The source answer key sorts this gas as alkalosis, metabolic, uncompensated.',
      'pH 7.48 | pCO2 42 | HCO3- 31 → Alkalosis | Metabolic | Uncompensated.'
    )
  ),
  mcq(
    'bb07-q5',
    'Sort this ABG: pH 7.36 | pCO₂ 52 | HCO₃⁻ 29.',
    [
      { id: 'acidosis-respiratory-fully', text: 'Acidosis | Respiratory | Fully Compensated' },
      {
        id: 'acidosis-respiratory-partial',
        text: 'Acidosis | Respiratory | Partially Compensated',
      },
      { id: 'alkalosis-respiratory-fully', text: 'Alkalosis | Respiratory | Fully Compensated' },
      { id: 'acidosis-metabolic-fully', text: 'Acidosis | Metabolic | Fully Compensated' },
    ],
    'acidosis-respiratory-fully',
    review(
      identifyGasPath,
      'The source answer key sorts this gas as acidosis, respiratory, fully compensated.',
      'pH 7.36 | pCO2 52 | HCO3- 29 → Acidosis | Respiratory | Fully Compensated.'
    )
  ),
  mcq(
    'bb07-q6',
    'Sort this ABG: pH 7.38 | pCO₂ 29 | HCO₃⁻ 18.',
    [
      { id: 'acidosis-metabolic-fully', text: 'Acidosis | Metabolic | Fully Compensated' },
      { id: 'alkalosis-respiratory-fully', text: 'Alkalosis | Respiratory | Fully Compensated' },
      { id: 'acidosis-respiratory-fully', text: 'Acidosis | Respiratory | Fully Compensated' },
      { id: 'acidosis-metabolic-partial', text: 'Acidosis | Metabolic | Partially Compensated' },
    ],
    'acidosis-metabolic-fully',
    review(
      identifyGasPath,
      'The source answer key sorts this gas as acidosis, metabolic, fully compensated.',
      'pH 7.38 | pCO2 29 | HCO3- 18 → Acidosis | Metabolic | Fully Compensated.'
    )
  ),
  mcq(
    'bb07-q7',
    'Sort this ABG: pH 7.31 | pCO₂ 60 | HCO₃⁻ 30.',
    [
      {
        id: 'acidosis-respiratory-partial',
        text: 'Acidosis | Respiratory | Partially Compensated',
      },
      { id: 'acidosis-respiratory-fully', text: 'Acidosis | Respiratory | Fully Compensated' },
      { id: 'acidosis-metabolic-partial', text: 'Acidosis | Metabolic | Partially Compensated' },
      {
        id: 'alkalosis-respiratory-partial',
        text: 'Alkalosis | Respiratory | Partially Compensated',
      },
    ],
    'acidosis-respiratory-partial',
    review(
      identifyGasPath,
      'The source answer key sorts this gas as acidosis, respiratory, partially compensated.',
      'pH 7.31 | pCO2 60 | HCO3- 30 → Acidosis | Respiratory | Partially Compensated.'
    )
  ),
]

const actOnGasQuestions: QuizQuestion[] = [
  mcq(
    'bb09-q1',
    'A 3-year-old intubated for status asthmaticus has pH 7.26, pCO₂ 60, and HCO₃⁻ 26 while oxygenating adequately. What intervention does the source select?',
    [
      { id: 'decrease-rate', text: 'Decrease respiratory rate' },
      { id: 'increase-minute-ventilation', text: 'Increase minute ventilation' },
      { id: 'wean-fio2', text: 'Wean FiO₂' },
      { id: 'decrease-peep', text: 'Decrease PEEP' },
    ],
    'increase-minute-ventilation',
    review(
      actGasPath,
      'The source identifies respiratory acidosis from hypoventilation and selects increased minute ventilation; increasing rate is given as an example.',
      'Answer B: Increase minute ventilation.'
    )
  ),
  mcq(
    'bb09-q2',
    'A 2-month-old on SIMV/PC/PS has pH 7.51, pCO₂ 28, and HCO₃⁻ 23 while comfortable and within saturation parameters. What intervention does the source select?',
    [
      { id: 'increase-imv', text: 'Increase IMV' },
      { id: 'increase-peep', text: 'Increase PEEP' },
      { id: 'wean-imv', text: 'Wean IMV' },
      { id: 'wean-fio2', text: 'Wean FiO₂ as tolerated' },
    ],
    'wean-imv',
    review(
      actGasPath,
      'The source identifies respiratory alkalosis/overventilation and selects weaning IMV to reduce delivered breaths and retain CO₂.',
      'Answer C: Wean IMV.'
    )
  ),
  mcq(
    'bb09-q3',
    'A ventilated 6-day-old has pH 7.37, pCO₂ 41, HCO₃⁻ 24, pO₂ 52, and saturations below parameters at FiO₂ 40%. What intervention does the source select?',
    [
      { id: 'increase-fio2', text: 'Increase FiO₂' },
      { id: 'decrease-rate', text: 'Decrease respiratory rate' },
      { id: 'increase-sedation', text: 'Increase sedation' },
      { id: 'decrease-vt', text: 'Decrease tidal volume' },
    ],
    'increase-fio2',
    review(
      actGasPath,
      'The source says oxygenation, not ventilation, is the immediate problem and selects increased FiO₂; it notes PEEP may also be considered depending on mode and clinical picture.',
      'Answer A: Increase FiO2.'
    )
  ),
  mcq(
    'bb09-q4',
    'A 7-year-old remains ventilated after pneumonia with pH 7.30, pCO₂ 55, HCO₃⁻ 27, and pO₂ 58. What intervention does the source select?',
    [
      { id: 'vent-only', text: 'Only ventilation support' },
      { id: 'oxygen-only', text: 'Only oxygenation support' },
      { id: 'both', text: 'Both ventilation and oxygenation may need adjustment' },
      { id: 'none', text: 'No changes' },
    ],
    'both',
    review(
      actGasPath,
      'The source says high CO₂ and low O₂ require both ventilation and oxygenation adjustments, such as breath size/frequency and FiO₂/PEEP.',
      'Answer C: both ventilation and oxygenation may need adjustment.'
    )
  ),
  mcq(
    'bb09-q5',
    'A 10-year-old with septic shock has pH 7.19, pCO₂ 30, HCO₃⁻ 11, and pO₂ 92. What does the source select?',
    [
      {
        id: 'more-ventilation',
        text: 'The patient primarily needs more ventilation because CO₂ is low',
      },
      { id: 'metabolic-fix', text: 'The ABG suggests the ventilator may not be the main fix' },
      {
        id: 'reduce-rate',
        text: 'Low pCO₂ suggests overventilation and reducing the rate should normalize the ABG',
      },
      { id: 'normal', text: 'The ABG is normal for this condition and needs no address' },
    ],
    'metabolic-fix',
    review(
      actGasPath,
      'The source identifies metabolic acidosis; low CO₂ is likely compensation, so the underlying metabolic issue should be identified and corrected.',
      'Answer B: ABG suggests the ventilator may not be the main fix.'
    )
  ),
]

const bvmEffectiveChoices = [
  { id: 'minimal-chest-movement', text: 'Minimal chest movement' },
  { id: 'absent-air-movement', text: 'Absent air movement' },
  { id: 'very-slow-rate', text: 'Very slow respiratory rate' },
  {
    id: 'normal-rate-adequate-excursion',
    text: 'Normal respiratory rate with adequate chest excursion',
  },
  { id: 'excessively-fast-effort', text: 'Excessively fast spontaneous respiratory effort' },
  { id: 'cyanosis', text: 'Perioral and peripheral cyanosis' },
  {
    id: 'brief-desaturation-rises',
    text: 'Brief continued desaturation followed by increasing oxygen saturations',
  },
  {
    id: 'abdominal-distension-resistance',
    text: 'Progressive abdominal distension with minimal chest movement and increasing resistance/difficulty',
  },
  { id: 'ongoing-desaturation', text: 'Continued ongoing desaturation' },
  { id: 'etco2-present', text: 'ETCO₂ present on waveform' },
  { id: 'etco2-absent', text: 'ETCO₂ absent' },
  {
    id: 'air-rushing-mask',
    text: 'No resistance to squeezing the bag, no chest expansion, and air audibly rushing around the mask',
  },
]
const bvmTargets = [
  { id: 'effective', text: 'Effective BVM' },
  { id: 'ineffective', text: 'Ineffective BVM' },
]

const bvmQuestions: QuizQuestion[] = [
  dragDrop(
    'bb13-q1',
    'Anna: sort each sign into the effective or ineffective BVM bucket.',
    bvmEffectiveChoices,
    bvmTargets,
    {
      'minimal-chest-movement': 'ineffective',
      'absent-air-movement': 'ineffective',
      'very-slow-rate': 'ineffective',
      'normal-rate-adequate-excursion': 'effective',
      'excessively-fast-effort': 'ineffective',
      cyanosis: 'ineffective',
      'brief-desaturation-rises': 'effective',
      'abdominal-distension-resistance': 'ineffective',
      'ongoing-desaturation': 'ineffective',
      'etco2-present': 'effective',
      'etco2-absent': 'ineffective',
      'air-rushing-mask': 'ineffective',
    },
    review(
      bvmQuizPath,
      'The source labels the signs above effective or ineffective and explains that air rushing around the mask with no chest expansion indicates a poor seal.',
      'Case 1 (Anna): sort signs into effective/ineffective; ETCO2 present is effective, ETCO2 absent is ineffective, and air rushing around the mask indicates poor seal.'
    )
  ),
  mcq(
    'bb13-q2',
    'Benjamin: the 100% FiO₂ reservoir is attached and set at 4 LPM, the seal appears good, SpO₂ is falling, and the bag inflates slowly. What should be changed?',
    [
      { id: 'two-provider', text: 'Change to a two-provider technique' },
      { id: 'airway', text: 'Place an oropharyngeal or nasopharyngeal airway' },
      { id: 'rate', text: 'Increase the rate of hand bagging' },
      { id: 'flow', text: 'Increase oxygen flow to the bag and verify adequate flow' },
      { id: 'mask-size', text: 'Change mask size' },
    ],
    'flow',
    review(
      bvmQuizPath,
      'The source marks increasing oxygen flow and verifying adequate flow as correct; it says a two-provider technique often helps a difficult seal but does not address this flow problem.',
      'Case 2 (Benjamin): increase flow rate of oxygen to bag and verify adequate flow (correct).'
    )
  ),
  mcq(
    'bb13-q3',
    'An infant with RSV apnea has a roll under the neck/chin-to-chest position, no air entry or chest rise, and absent ETCO₂. What should be done first?',
    [
      { id: 'continue', text: 'Continue BVM without changing position' },
      { id: 'lma', text: 'Insert a larygeal mask airway' },
      { id: 'side', text: 'Turn the patient to the side' },
      {
        id: 'sniffing',
        text: 'Ensure proper sniffing position and alignment of oral, pharyngeal, and tracheal axes',
      },
      { id: 'harder', text: 'Squeeze the bag harder' },
    ],
    'sniffing',
    review(
      bvmQuizPath,
      'The source marks proper sniffing position and alignment as correct and says to optimize BVM before moving to a larygeal mask airway.',
      'Case 3 (infant with RSV apnea): ensure proper sniffing position and alignment of oral, pharyngeal, and tracheal axes (correct).'
    )
  ),
  dragDrop(
    'bb13-q4',
    'For the 2-year-old with pneumonia and cerebral palsy, sort each proposed factor into contributes to difficult BVM or does not specifically explain the bagging difficulty.',
    [
      { id: 'lung-compliance', text: 'Poor compliance from lung disease' },
      { id: 'upper-airway', text: 'Upper-airway obstruction from poor muscle tone' },
      { id: 'absent-effort', text: 'Absent patient effort' },
      {
        id: 'gastric-insufflation',
        text: 'Poor compliance from gastric insufflation pushing upward on the chest',
      },
      { id: 'no-preoxygenation', text: 'Lack of pre-oxygenation with 100% FiO₂' },
    ],
    [
      { id: 'contributes', text: 'Contributes to difficult BVM' },
      {
        id: 'does not specifically explain bagging difficulty',
        text: 'Does not specifically explain bagging difficulty',
      },
    ],
    {
      'lung-compliance': 'contributes',
      'upper-airway': 'contributes',
      'absent-effort': 'does not specifically explain bagging difficulty',
      'gastric-insufflation': 'contributes',
      'no-preoxygenation': 'does not specifically explain bagging difficulty',
    },
    review(
      bvmQuizPath,
      'The source marks poor lung compliance, upper-airway obstruction from poor tone, and gastric insufflation as contributing factors. It says absent patient effort and lack of pre-oxygenation do not specifically cause bagging difficulty.',
      'Case 4 (2-year-old): contributing factors are poor compliance from lung disease, upper-airway obstruction from poor muscle tone, and poor compliance from gastric insufflation.'
    )
  ),
  mcq(
    'bb13-q5',
    'In the repeated 2-year-old scenario, what might improve oxygen saturation?',
    [
      { id: 'sedation', text: 'Administer additional sedation' },
      {
        id: 'airway-backup',
        text: 'Consider a nasopharygneal or oropharyngeal airway or definitive airway and call backup',
      },
      { id: 'albuterol', text: 'Administer albuterol via facemask nebulizer' },
      { id: 'slower', text: 'Provide hand bag ventilation more slowly' },
    ],
    'airway-backup',
    review(
      bvmQuizPath,
      'The source marks an airway adjunct or definitive airway with backup as correct, likely addressing the combination of upper-airway and intrinsic lung disease.',
      'Case 5: consider nasopharygneal or oropharyngeal airway or definitive airway and call backup (correct).'
    )
  ),
]

export const bronchialBluffsIsland: CurriculumIsland = {
  id: 'bronchial-bluffs',
  order: 4,
  name: 'Bronchial Bluffs',
  description: 'Monitoring (CXR, blood gasses), bag valve & mask ventilation',
  activities: [
    {
      activityId: 'bb-01',
      islandId: 'bronchial-bluffs',
      sequence: 1,
      title: 'CXR Interpretation',
      estimatedMinutes: 10,
      peepPointsValue: 1,
      countsTowardProgress: true,
      contentStatus: 'ready',
      conflictIds: ['bb-cxr-video-extraction'],
      provenance: [
        ref(
          cxrVideoPath,
          wholeFile,
          'media',
          'ChestXray_video.mp4 metadata: 1920×1080 H.264/AAC video, 14:11.42 duration.'
        ),
        outline,
      ],
      type: 'video',
      content: {
        media: cxrVideoMedia,
        durationSeconds: 851.4,
        completionCondition: { kind: 'ended' },
      },
    },
    {
      activityId: 'bb-02',
      islandId: 'bronchial-bluffs',
      sequence: 2,
      title: 'CXR Interpretation',
      estimatedMinutes: 5,
      peepPointsValue: 1,
      countsTowardProgress: true,
      contentStatus: 'ready',
      provenance: [
        ref(
          cxrDeckPath,
          { kind: 'slide', slide: 2 },
          'content',
          'Objectives: evaluate CXR technique, landmarks, systematic review, diagnostic findings, and PICU device positioning.'
        ),
        ref(
          cxrDeckPath,
          { kind: 'slide', slide: 12 },
          'content',
          'ETT positioning: T1, carina close to T4, usual position between T2 and carina.'
        ),
        ref(
          cxrDeckPath,
          { kind: 'slide', slide: 21 },
          'review',
          'Practice a systematic approach and look at films before the radiology report.'
        ),
        outline,
      ],
      type: 'reading',
      content: {
        blocks: exactSourceBlocks(cxrDeckPath),
        body: cxrReadingBody,
        confirmationQuestion: cxrReadingQuestion,
      },
    },
    {
      activityId: 'bb-03',
      islandId: 'bronchial-bluffs',
      sequence: 3,
      title: 'Guess That Disease',
      estimatedMinutes: 10,
      peepPointsValue: 3,
      countsTowardProgress: true,
      contentStatus: 'ready',
      conflictIds: ['bb-cxr-image-mapping'],
      provenance: [
        ref(
          cxrQuizPath,
          wholeFile,
          'answer',
          'Guess that CXR answer key: six prompts with pneumonia, atelectasis, right-sided pleural effusion, Acute Chest, pneumothorax, and ARDS answers.'
        ),
        outline,
      ],
      type: 'quiz',
      content: { questions: guessThatDiseaseQuestions },
    },
    {
      activityId: 'bb-04',
      islandId: 'bronchial-bluffs',
      sequence: 4,
      title: 'Goldilocks and the 3 ETTs',
      estimatedMinutes: 10,
      peepPointsValue: 3,
      countsTowardProgress: true,
      contentStatus: 'ready',
      conflictIds: ['bb-goldilocks-case-count'],
      provenance: [
        ref(
          ettQuizPath,
          wholeFile,
          'answer',
          'Five embedded ETT-position CXR cases are explicitly labeled TOO DEEP, TOO SHALLOW, or JUST RIGHT with rationales.'
        ),
        ref(
          cxrDeckPath,
          { kind: 'slide', slide: 12 },
          'content',
          'ETT positioning landmarks and usual position between T2 and the carina.'
        ),
        outline,
      ],
      type: 'quiz',
      content: { questions: goldilocksQuestions },
    },
    {
      activityId: 'bb-05',
      islandId: 'bronchial-bluffs',
      sequence: 5,
      title: 'CXR in Real Life',
      estimatedMinutes: 10,
      peepPointsValue: 5,
      countsTowardProgress: true,
      contentStatus: 'ready',
      provenance: [
        ref(
          cxrQuestPath,
          wholeFile,
          'content',
          'Quest #6: use ABCDE on latest CXR, comment on lines/tubes/drains, assess pneumothorax or pneumomediastinum, compare admission/birth film, and discuss ETT/trach position with an RT.'
        ),
        outline,
      ],
      type: 'quest',
      content: {
        instructions:
          'Find an RT during your next shift and ask them to be your partner. Bring the RT to a ventilated patient, pull up the latest CXR, interpret it using the ABCDE framework, comment on all lines/tubes/drains, explain whether there is a pneumothorax or pneumomediastinum and how you know, compare with the admission (or birth) CXR, and discuss whether the ETT or trach position is safe for transport to CT. Elicit at least one piece of feedback about your CXR reading.',
        supervisorRole: 'Respiratory therapist (RT)',
        offlineValidation: {
          method: 'supervisor_confirmation',
          evidenceFields: [
            'ABCDE interpretation',
            'line/tube/drain positions',
            'pneumothorax or pneumomediastinum reasoning',
            'comparison CXR findings',
            'ETT/trach transport-position discussion',
            'feedback elicited',
          ],
        },
        review: review(
          cxrQuestPath,
          'The quest card directs the learner to complete the CXR review at the bedside with an RT and elicit feedback.',
          'QUEST #6 ... FIND AN RT ... INTERPRET ... USING THE ABCDE FRAMEWORK ... ELICIT AT LEAST ONE PIECE OF FEEDBACK ABOUT YOUR CXR READING.'
        ),
      },
    },
    {
      activityId: 'bb-06',
      islandId: 'bronchial-bluffs',
      sequence: 6,
      title: 'Blood Gas Interpretation: Part 1',
      estimatedMinutes: 10,
      peepPointsValue: 2,
      countsTowardProgress: true,
      contentStatus: 'ready',
      conflictIds: ['bb-abg-video-extraction'],
      provenance: [
        ref(
          identifyGasVideoPath,
          wholeFile,
          'media',
          'Blood Gas Interpretation Part 1 - Identify the Gas.mp4 metadata: 1920×1080 H.264/AAC video, 11:08.969 duration.'
        ),
        ref(
          identifyGasPath,
          wholeFile,
          'content',
          'Identify-the-Gas quiz defines acid-base imbalance, system, and compensation sorting buckets.'
        ),
        outline,
      ],
      type: 'video',
      content: {
        media: identifyGasVideoMedia,
        durationSeconds: 668.967,
        completionCondition: { kind: 'ended' },
      },
    },
    {
      activityId: 'bb-07',
      islandId: 'bronchial-bluffs',
      sequence: 7,
      title: 'Blood Gas Interpretation: Identify the Gas',
      estimatedMinutes: 15,
      peepPointsValue: 3,
      countsTowardProgress: true,
      contentStatus: 'ready',
      conflictIds: ['bb-abg-identify-sorting-strategy'],
      provenance: [
        ref(
          identifyGasPath,
          wholeFile,
          'answer',
          'ABG Sorting Quiz answer key with seven ABGs classified by imbalance, system, and compensation.'
        ),
        ref(
          abgAnswerKeyPath,
          wholeFile,
          'review',
          'Additional ABG interpretation answer-key source with acid-base and ventilator decision examples.'
        ),
        outline,
      ],
      type: 'quiz',
      content: { questions: identifyGasQuestions },
    },
    {
      activityId: 'bb-08',
      islandId: 'bronchial-bluffs',
      sequence: 8,
      title: 'Blood Gas Interpretation: Part 2',
      estimatedMinutes: 10,
      peepPointsValue: 2,
      countsTowardProgress: true,
      contentStatus: 'ready',
      conflictIds: ['bb-abg-video-extraction'],
      provenance: [
        ref(
          actGasVideoPath,
          wholeFile,
          'media',
          'Blood Gas Interpretation Part 2 - Act on the Gas.mp4 metadata: 1920×1080 H.264/AAC video, 8:03.023 duration.'
        ),
        ref(
          actGasPath,
          wholeFile,
          'content',
          'Acting on the Gas quiz predicts interventions for ventilation, oxygenation, and metabolic acidosis.'
        ),
        outline,
      ],
      type: 'video',
      content: {
        media: actGasVideoMedia,
        durationSeconds: 483,
        completionCondition: { kind: 'ended' },
      },
    },
    {
      activityId: 'bb-09',
      islandId: 'bronchial-bluffs',
      sequence: 9,
      title: 'Blood Gas Interpretation: Act on the Gas',
      estimatedMinutes: 15,
      peepPointsValue: 3,
      countsTowardProgress: true,
      contentStatus: 'ready',
      provenance: [
        ref(
          actGasPath,
          wholeFile,
          'answer',
          'Five ABG intervention cases with explicit answers and rationales.'
        ),
        ref(
          abgAnswerKeyPath,
          wholeFile,
          'review',
          'Additional ABG interpretation cases include ventilator decisions for respiratory alkalosis and permissive hypercapnia.'
        ),
        outline,
      ],
      type: 'quiz',
      content: { questions: actOnGasQuestions },
    },
    {
      activityId: 'bb-10',
      islandId: 'bronchial-bluffs',
      sequence: 10,
      title: 'Blood Gas Interpretation: Summary Graphic',
      estimatedMinutes: 5,
      peepPointsValue: 1,
      countsTowardProgress: true,
      contentStatus: 'ready',
      conflictIds: ['bb-abg-graphic-extraction'],
      provenance: [
        ref(
          abgGraphicPath,
          { kind: 'page', page: 1 },
          'content',
          'Blood Gas Interpretation one-page grid: pH, pCO2, HCO3, compensation, and Act on the gas arrows.'
        ),
        ref(
          identifyGasPath,
          wholeFile,
          'review',
          'Identify-the-Gas quiz uses the same imbalance/system/compensation categories.'
        ),
        outline,
      ],
      type: 'reading',
      content: {
        body: 'Blood Gas Interpretation: plot pH, pCO₂, and HCO₃⁻ in the grid. Determine acidosis versus alkalosis, look down the column to see what is driving the imbalance, and look at the compensatory system. If the compensatory system pushes in the opposite direction, the imbalance is partially compensated. If pH is normal and both systems are abnormal toward opposite imbalances, the imbalance is fully compensated. Act on the gas: if CO₂ is increased, increase ventilation; if CO₂ is decreased, decrease ventilation; if O₂ is decreased, increase oxygenation; for a metabolic disturbance, treat the underlying causes.',
        confirmationQuestion: {
          prompt: 'According to the summary graphic, what action follows increased CO₂?',
          choices: [
            { id: 'increase-ventilation', text: 'Increase ventilation' },
            { id: 'decrease-ventilation', text: 'Decrease ventilation' },
            { id: 'increase-oxygenation', text: 'Increase oxygenation' },
            { id: 'treat-metabolic', text: 'Treat underlying metabolic causes' },
          ],
          answer: { correctChoiceId: 'increase-ventilation' },
          review: review(
            abgGraphicPath,
            'The infographic arrow for increased CO₂ says to increase ventilation.',
            'IF ↑ CO2 → Increase ventilation',
            { kind: 'page', page: 1 }
          ),
        },
      },
    },
    {
      activityId: 'bb-11',
      islandId: 'bronchial-bluffs',
      sequence: 11,
      title: 'How to Bag 101',
      estimatedMinutes: 10,
      peepPointsValue: 1,
      countsTowardProgress: true,
      contentStatus: 'unavailable',
      conflictIds: ['bb-no-local-bagging-video'],
      provenance: [
        ref(
          baggingBriefPath,
          wholeFile,
          'content',
          'Bagging 201 video brief lists external clips titled Safety Checks, Ventilator Basics with Pig Lung Demo, and Bagging Techniques; no packaged video is present.'
        ),
        outline,
      ],
      type: 'video',
      content: null,
    },
    {
      activityId: 'bb-12',
      islandId: 'bronchial-bluffs',
      sequence: 12,
      title: 'BVM Deliberate Practice',
      estimatedMinutes: 20,
      peepPointsValue: 10,
      countsTowardProgress: true,
      contentStatus: 'ready',
      provenance: [
        ref(
          bvmQuestPath,
          wholeFile,
          'content',
          'Quest #7: bag a conventional-ventilator patient through the artificial airway with an RT and elicit equipment, flow, rate, PIP/PEEP, I-time, assessment, troubleshooting, and seal feedback.'
        ),
        outline,
      ],
      type: 'quest',
      content: {
        instructions:
          'Find an RT during your next shift and ask them to be your partner. Bring them to a patient with a conventional ventilator (not an oscillator or APRV), bag the patient through the artificial airway, and elicit feedback: did you set up equipment and flow correctly; how were your rate, PIP, PEEP, and inspiratory time; how did you assess the patient while bagging; how would you troubleshoot poor chest rise; and how would you bag if the patient lost the artificial airway? Demonstrate proper seal technique for the RT.',
        supervisorRole: 'Respiratory therapist (RT)',
        offlineValidation: {
          method: 'supervisor_confirmation',
          evidenceFields: [
            'equipment and flow setup',
            'rate/PIP/PEEP/inspiratory-time feedback',
            'patient assessment while bagging',
            'poor-chest-rise troubleshooting debrief',
            'lost-airway bagging and seal demonstration',
          ],
        },
        review: review(
          bvmQuestPath,
          'The quest card requires RT-supervised bedside bagging and feedback on equipment, flow, ventilatory parameters, assessment, and troubleshooting.',
          'QUEST #7 ... BAG THE PATIENT THROUGH THEIR ARTIFICIAL AIRWAY ... ELICIT FEEDBACK ... VERBALLY DE-BRIEF ... DEMONSTRATE PROPER SEAL TECHNIQUE.'
        ),
      },
    },
    {
      activityId: 'bb-13',
      islandId: 'bronchial-bluffs',
      sequence: 13,
      title: 'Troubleshooting Ineffective BVM',
      estimatedMinutes: 10,
      peepPointsValue: 3,
      countsTowardProgress: true,
      contentStatus: 'ready',
      conflictIds: ['bb-bvm-source-truncated'],
      provenance: [
        ref(
          bvmQuizPath,
          wholeFile,
          'answer',
          'BVM troubleshooting goals, five cases, correctness labels, rationales, and cited references.'
        ),
        ref(
          bvmQuestPath,
          wholeFile,
          'review',
          'Quest #7 asks learners to verbally debrief how to troubleshoot poor chest rise and demonstrate seal technique.'
        ),
        outline,
      ],
      type: 'quiz',
      content: { questions: bvmQuestions },
    },
    {
      activityId: 'bb-14',
      islandId: 'bronchial-bluffs',
      sequence: 14,
      title: 'Bronchial Bluffs Activity Slot 14 (descriptor pending)',
      description: 'Bronchial Bluffs Activity Slot 14 (descriptor pending)',
      estimatedMinutes: 1,
      peepPointsValue: 0,
      countsTowardProgress: true,
      contentStatus: 'unavailable',
      conflictIds: ['bb-pending-slot'],
      provenance: [
        ref(
          outlinePath,
          wholeFile,
          'content',
          'Canonical release roster carries a pending descriptor for Bronchial Bluffs sequence 14; the GameOutline table has no matching named activity row.'
        ),
      ],
      type: 'pending',
      content: null,
    },
    {
      activityId: 'bb-final-exam',
      islandId: 'bronchial-bluffs',
      sequence: 15,
      title: 'Bronchial Bluffs Final Exam',
      estimatedMinutes: 20,
      peepPointsValue: 0,
      countsTowardProgress: false,
      contentStatus: 'unavailable',
      conflictIds: ['bb-final-exam-evidence'],
      provenance: [
        ref(
          outlinePath,
          wholeFile,
          'content',
          'GameOutline logistics state a $10 competency end-of-curriculum exam and eligibility regardless of completion; no Bronchial-specific question payload is present.'
        ),
      ],
      type: 'quiz',
      content: null,
    },
  ],
  declaredTotals: { activityCount: 15, estimatedMinutes: 155, peepPoints: 39 },
  observedTotals: { activityCount: 15, estimatedMinutes: 161, peepPoints: 38 },
  conflicts: [
    {
      conflictId: 'bb-cxr-video-extraction',
      scope: 'source',
      status: 'ready',
      message:
        'The CXR video source is present with media metadata from discovery, but the generated extraction record is missing_dependency because ffprobe was unavailable.',
      sourceIds: ['source-afa0408a6ddd481ccf7b'],
      activityIds: ['bb-01'],
      field: 'contentStatus',
      declaredValue: 'ready',
      observedValue: 'missing_dependency',
    },
    {
      conflictId: 'bb-cxr-image-mapping',
      scope: 'content',
      status: 'ready',
      message:
        'The Guess that CXR DOCX contains seven embedded image assets for six prompts; the first two assets and their exact prompt mapping are ambiguous in the extracted field structure.',
      sourceIds: ['source-3cbd94859fe4639d6d03'],
      activityIds: ['bb-03'],
      field: 'promptMedia',
    },
    {
      conflictId: 'bb-goldilocks-case-count',
      scope: 'content',
      status: 'ready',
      message:
        'The source title says “3 Endotracheal Tubes,” while the answer-key document contains five numbered image cases; all five source labels are retained.',
      sourceIds: ['source-94143374f3d8ee0dce98'],
      activityIds: ['bb-04'],
      field: 'questions',
      declaredValue: 3,
      observedValue: 5,
    },
    {
      conflictId: 'bb-abg-identify-sorting-strategy',
      scope: 'content',
      status: 'ready',
      message:
        'GameOutline notes sorting buckets for Identify the Gas, while the source answer key supplies ordered three-part classifications and the normalized payload retains faithful combined-label MCQs without inventing item-to-bucket mappings.',
      sourceIds: ['source-73255c6a32be3c36f454', 'source-7effcb159366c230bc93'],
      activityIds: ['bb-07'],
      field: 'questions',
      declaredValue: 'sorting buckets',
      observedValue: 'mcq',
    },
    {
      conflictId: 'bb-abg-video-extraction',
      scope: 'source',
      status: 'ready',
      message:
        'Both ABG MP4 sources are present with media metadata from discovery, but generated extraction records are missing_dependency because ffprobe was unavailable.',
      sourceIds: ['source-2134690e4562b5fb36d7', 'source-ddec61eb224f6f705493'],
      activityIds: ['bb-06', 'bb-08'],
      field: 'contentStatus',
      declaredValue: 'ready',
      observedValue: 'missing_dependency',
    },
    {
      conflictId: 'bb-abg-graphic-extraction',
      scope: 'source',
      status: 'ready',
      message:
        'The blood-gas infographic has verified one-page graphic evidence from discovery, while the generated extraction record is missing_dependency because pdfinfo and pdftotext were unavailable.',
      sourceIds: ['source-30f7a5a9d347509bbdb1'],
      activityIds: ['bb-10'],
      field: 'extractionStatus',
      declaredValue: 'ok',
      observedValue: 'missing_dependency',
    },
    {
      conflictId: 'bb-no-local-bagging-video',
      scope: 'mapping',
      status: 'unavailable',
      message:
        'The Bagging 201 video DOCX is an external-video production brief, not a packaged lesson. It lists three YouTube URLs, but no local Bagging 101 video asset or combined deliverable was found.',
      sourceIds: ['source-858414f560e37d2e4362'],
      activityIds: ['bb-11'],
      field: 'content',
    },
    {
      conflictId: 'bb-bvm-source-truncated',
      scope: 'content',
      status: 'ready',
      message:
        'The BVM troubleshooting source contains an incomplete parenthetical in the fourth case; all five cases and explicit answer labels are retained without filling that sentence.',
      sourceIds: ['source-63f89949d7650868898b'],
      activityIds: ['bb-13'],
      field: 'questions',
    },
    {
      conflictId: 'bb-pending-slot',
      scope: 'mapping',
      status: 'ready',
      message:
        'The canonical release roster requires sequence 14 with a pending descriptor, while the GameOutline source table names only 14 direct instructional rows and has no matching sequence-14 activity.',
      sourceIds: ['source-7effcb159366c230bc93'],
      activityIds: ['bb-14'],
      field: 'descriptor',
      declaredValue: 'pending',
      observedValue: null,
    },
    {
      conflictId: 'bb-final-exam-evidence',
      scope: 'activity',
      status: 'unavailable',
      message:
        'GameOutline logistics document mentions an end-of-curriculum competency exam but supplies no Bronchial-specific exam questions or answer evidence; the required final-exam slot remains addressable and unavailable.',
      sourceIds: ['source-7effcb159366c230bc93'],
      activityIds: ['bb-final-exam'],
      field: 'content',
    },
    {
      conflictId: 'bb-gameoutline-total',
      scope: 'totals',
      status: 'ready',
      message:
        'GameOutline declares 15 activities, 155 minutes, and 39 PEEP Points; the canonical roster records a pending 1-minute/0-point instructional slot and a 20-minute/0-point final, yielding observed totals of 15 activities, 161 minutes, and 38 PEEP Points.',
      sourceIds: ['source-7effcb159366c230bc93'],
      field: 'declaredTotals',
      declaredValue: { activityCount: 15, estimatedMinutes: 155, peepPoints: 39 },
      observedValue: { activityCount: 15, estimatedMinutes: 161, peepPoints: 38 },
    },
  ],
}
