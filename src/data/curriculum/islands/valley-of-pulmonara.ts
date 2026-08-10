import type { CurriculumIsland } from '../types'
import { mediaRefForSource, sourceRef } from '../generated-data'

const bronchiolitisVideo = '3. Valley of Pulmonara/Bronchiolitis_GAMERICU.mp4'
const asthmaVideo = '3. Valley of Pulmonara/CriticalAsthma_Gamer_ICU.mp4'
const ardsVideo = '3. Valley of Pulmonara/ARDS_GAMERICU.mp4'
const capturedVideo = '3. Valley of Pulmonara/Captured_Video.mp4'
const eatVideo = '3. Valley of Pulmonara/EAT considerstions.mov'
const vapQuiz = '3. Valley of Pulmonara/NURSE VAP Prevention Quiz content.docx'
const vapLecture = '3. Valley of Pulmonara/NURSES Ventilator Associated Pneumonia.pptx'
const tbmLecture = '3. Valley of Pulmonara/Nurses TRACHEOBRONCHOMALACIA.pptx'
const quest4 = '3. Valley of Pulmonara/Vent Alarms Quest 4.docx'
const quest5 = '3. Valley of Pulmonara/Vent Alarms Quest 5.docx'
const ventLab = '3. Valley of Pulmonara/Vent lab loops.pptx'
const outlinePath = 'GameOutline.docx'
const outlineRoster = sourceRef(
  outlinePath,
  { kind: 'whole_file' },
  'content',
  'GameOutline Valley of Pulmonara roster rows and declared total.',
)

const bronchiolitisMedia = mediaRefForSource(bronchiolitisVideo)
const asthmaMedia = mediaRefForSource(asthmaVideo)
const ardsMedia = mediaRefForSource(ardsVideo)
const eatMedia = mediaRefForSource(eatVideo)

const vaporPreventionQuestion = {
  id: 'vap-prevention-items',
  interaction: 'drag_drop' as const,
  prompt:
    'Drag each prevention practice into the source document’s bucket: Strong Evidence, Limited Evidence, or Not recommended.',
  choices: [
    { id: 'item-01', text: 'Perform hand hygiene before and after touching the patient’s airway.' },
    { id: 'item-02', text: 'Elevate the head of bed to 30 degrees unless contraindicated.' },
    { id: 'item-03', text: 'Change ventilator circuits routinely every 48 hours.' },
    {
      id: 'item-04',
      text: 'Assess daily readiness to extubate and attempt spontaneous breathing trials when appropriate.',
    },
    {
      id: 'item-05',
      text: 'Perform oral care with saline/moistened swabs every 4–8 hours for intubated children.',
    },
    {
      id: 'item-06',
      text: 'Monitor cuff pressures regularly for cuffed endotracheal tubes (maintain within recommended range).',
    },
    { id: 'item-07', text: 'Use prophylactic systemic antibiotics to prevent VAP in ventilated patients.' },
    {
      id: 'item-08',
      text: 'Minimize sedation and perform daily sedation interruption when clinically appropriate.',
    },
    { id: 'item-09', text: 'Use closed suction systems for all patients to prevent VAP.' },
    {
      id: 'item-10',
      text: 'Obtain endotracheal/tracheal aspirate culture before starting antibiotics for suspected VAP, if safe.',
    },
    { id: 'item-11', text: 'Routinely change heat–moisture exchanger (HME) filters daily.' },
    { id: 'item-12', text: 'Routinely disconnect the ventilator circuit to reposition the patient.' },
    {
      id: 'item-13',
      text: 'Use enteral feeding protocols and prefer gastric feeding over parenteral nutrition when feasible.',
    },
    {
      id: 'item-14',
      text: 'Apply contact precautions for patients colonized or infected with multidrug-resistant organisms.',
    },
    { id: 'item-15', text: 'Use prophylactic inhaled antibiotics in intubated patients to prevent VAP.' },
    {
      id: 'item-16',
      text: 'Perform oral suctioning of pooled secretions prior to repositioning or suctioning ETT.',
    },
    {
      id: 'item-17',
      text: 'Use a routine schedule of ventilator circuit humidifier changes (e.g., every 24 hours) regardless of condition.',
    },
    {
      id: 'item-18',
      text: 'Use spontaneous awakening and breathing trial coordination (paired SBT/SAT) as part of daily practice when feasible.',
    },
    {
      id: 'item-19',
      text: 'Provide staff education and bundle checklists with regular audit and feedback on VAP prevention practices.',
    },
    { id: 'item-20', text: 'Use prone positioning routinely to prevent VAP.' },
    {
      id: 'item-21',
      text: 'Start empiric broadspectrum antibiotics immediately for any new ventilator-associated change without obtaining cultures.',
    },
  ],
  targets: [
    { id: 'bucket-strong', text: 'Strong Evidence' },
    { id: 'bucket-limited', text: 'Limited Evidence' },
    { id: 'bucket-not-recommended', text: 'Not recommended' },
  ],
  answer: {
    interaction: 'drag_drop' as const,
    placements: {
      'item-01': 'bucket-strong',
      'item-02': 'bucket-strong',
      'item-03': 'bucket-not-recommended',
      'item-04': 'bucket-strong',
      'item-05': 'bucket-strong',
      'item-06': 'bucket-strong',
      'item-07': 'bucket-not-recommended',
      'item-08': 'bucket-strong',
      'item-09': 'bucket-limited',
      'item-10': 'bucket-limited',
      'item-11': 'bucket-not-recommended',
      'item-12': 'bucket-not-recommended',
      'item-13': 'bucket-limited',
      'item-14': 'bucket-strong',
      'item-15': 'bucket-not-recommended',
      'item-16': 'bucket-strong',
      'item-17': 'bucket-not-recommended',
      'item-18': 'bucket-limited',
      'item-19': 'bucket-strong',
      'item-20': 'bucket-not-recommended',
      'item-21': 'bucket-not-recommended',
    },
  },
  review: {
    rationale:
      'The answer-bearing source gives these rationales: hand hygiene is the single most effective healthcare-associated-infection measure; semi-recumbent positioning reduces aspiration; routine circuit changes increase manipulation and contamination; reducing ventilation duration lowers VAP risk; oral hygiene removes secretions; proper cuff pressure limits micro-aspiration and mucosal injury; routine systemic or inhaled prophylactic antibiotics increase resistance without proven prevention benefit; sedation minimization reduces ventilator days; closed suction has mixed benefit and is useful for unstable patients according to policy; cultures guide therapy but may not be feasible in unstable patients; routine HME or humidifier changes and circuit disconnections add manipulation or contamination; enteral feeding is context-dependent because aspiration risk requires monitoring; contact precautions limit MDR spread; pooled-secretion suction reduces aspiration during movement or airway manipulation; paired SBT/SAT is individualized; education, checklists, audit, and feedback improve bundle adherence; prone positioning is for severe ARDS rather than VAP prevention; and empiric antibiotics may be necessary in unstable patients but cultures are preferred first when possible.',
    notes:
      'The source document embeds the correct bucket and rationale alongside every learner prompt. Keep this review information gated in the learner interaction.',
    sourceReferences: [
      sourceRef(vapQuiz, { kind: 'whole_file' }, 'answer', '21-item answer-bearing prevention classification and rationales'),
    ],
  },
}

export const valleyOfPulmonaraIsland: CurriculumIsland = {
  id: 'valley-of-pulmonara',
  order: 3,
  name: 'Valley of Pulmonara',
  description:
    'Pediatric respiratory pathophysiology, waveform interpretation, alarm communication, and ventilator-associated pneumonia prevention.',
  declaredTotals: {
    activityCount: 13,
    estimatedMinutes: 135,
    peepPoints: 43,
  },
  observedTotals: {
    activityCount: 15,
    estimatedMinutes: 165,
    peepPoints: 46,
  },
  conflicts: [
    {
      conflictId: 'valley-gameoutline-totals',
      scope: 'totals',
      status: 'needs_review',
      message:
        'GameOutline declares 13 activities, 135 minutes, and 43 PEEP Points for Valley of Pulmonara; the canonical roster observes 15 activities, 165 minutes, and 46 PEEP Points. Preserve the source-declared totals rather than replacing them with canonical roster totals.',
      sourceIds: ['source-7effcb159366c230bc93'],
      field: 'declaredTotals',
      declaredValue: { activityCount: 13, estimatedMinutes: 135, peepPoints: 43 },
      observedValue: { activityCount: 15, estimatedMinutes: 165, peepPoints: 46 },
    },
    {
      conflictId: 'vp-03-video-source-unavailable',
      scope: 'mapping',
      status: 'unavailable',
      message:
        'The authoritative vp-03 slot expects a Tracheobronchomalacia video, but the Valley corpus contains only the Nurses TRACHEOBRONCHOMALACIA PPTX; no Valley TBM video or transcript was extracted.',
      sourceIds: ['source-50dbbfb7c85dc411ec99'],
      activityIds: ['vp-03'],
      field: 'content',
    },
    {
      conflictId: 'tbm-management-slide-missing',
      scope: 'content',
      status: 'needs_review',
      message:
        'The TBM deck’s slide 10 is headed “Management and Nursing Considerations” but contains no management or nursing text. Do not fill the gap with clinical material not present in the source.',
      sourceIds: ['source-50dbbfb7c85dc411ec99'],
      activityIds: ['vp-03'],
      field: 'content',
    },
    {
      conflictId: 'tbm-image-led-evidence',
      scope: 'source',
      status: 'needs_review',
      message:
        'TBM anatomy and diagnostic evidence is image-led; the extraction preserves the slide images but not a complete text interpretation. The available text covers normal versus malacic tissue, etiology, pathophysiology, manifestations, CT, and bronchoscopy.',
      sourceIds: ['source-50dbbfb7c85dc411ec99'],
      activityIds: ['vp-03'],
      field: 'provenance',
    },
    {
      conflictId: 'vp-04-video-probe-missing',
      scope: 'source',
      status: 'needs_review',
      message:
        'The ARDS video is present and its duration was recovered from source metadata, but the generated extraction records ffprobe as unavailable and contain no transcript or scene map.',
      sourceIds: ['source-9c2b5778b7dca050c030'],
      activityIds: ['vp-04'],
      field: 'content',
    },
    {
      conflictId: 'vp-06-captured-topic-unavailable',
      scope: 'mapping',
      status: 'unavailable',
      message:
        'Captured_Video.mp4 has playable media metadata but no transcript, OCR, scene map, or safe topic evidence tying it to the roster title “Using Language to Depict Illness Severity and Course.”',
      sourceIds: ['source-4723af25dd62be419a52'],
      activityIds: ['vp-06'],
      field: 'content',
    },
    {
      conflictId: 'vp-07-video-source-unavailable',
      scope: 'mapping',
      status: 'unavailable',
      message:
        'The authoritative vp-07 slot expects a Vent Alarms 101 video, but the Valley corpus has alarm content in the two SBAR quest DOCX files and no matching Valley video source.',
      sourceIds: ['source-f18a482635104989a380', 'source-1c7571b0559d55c2a66d'],
      activityIds: ['vp-07'],
      field: 'content',
    },
    {
      conflictId: 'vp-08-media-role-inferred',
      scope: 'mapping',
      status: 'needs_review',
      message:
        'EAT considerstions.mov is an audiovisual file whose filename suggests EAT considerations, but no transcript, OCR, or explicit roster link was recovered. The media is retained with needs_review rather than invented instructional text.',
      sourceIds: ['source-991d6a188cefced1dc6d'],
      activityIds: ['vp-08'],
      field: 'content',
    },
    {
      conflictId: 'vent-lab-answer-slides-instructor',
      scope: 'content',
      status: 'needs_review',
      message:
        'Vent Lab slides 3, 8, 11, 14, and 17 expose keyed answers and retry instructions. The source developer note requires these answer sections to be gated until the learner attempts the case.',
      sourceIds: ['source-1e8209fe3a0de46f82bc'],
      activityIds: ['vp-05', 'vp-09', 'vp-10'],
      field: 'content',
    },
    {
      conflictId: 'vent-lab-source-defects',
      scope: 'source',
      status: 'needs_review',
      message:
        'The Vent Lab deck contains an incomplete Case 2 sentence, “CO” and “anicrease” text defects, and repeated “[Enter Lecture Name]” placeholders. Preserve the source wording and do not silently supply missing lecture content.',
      sourceIds: ['source-1e8209fe3a0de46f82bc'],
      activityIds: ['vp-05', 'vp-09'],
      field: 'provenance',
    },
    {
      conflictId: 'vp-09-vp-10-roster-split',
      scope: 'mapping',
      status: 'needs_review',
      message:
        'The canonical roster splits the Vent Lab deck’s five-case “Guess That Disease” interaction into vp-09 Vent Lab and vp-10 Clinical Case Vignette. The source deck itself presents the five cases as one interaction, so the split is preserved as a mapping review.',
      sourceIds: ['source-1e8209fe3a0de46f82bc'],
      activityIds: ['vp-09', 'vp-10'],
      field: 'mapping',
    },
    {
      conflictId: 'quest-scenario-3-urgency',
      scope: 'content',
      status: 'needs_review',
      message:
        'Quest 4 Scenario 3 states that too many causes prevent isolating one cause, keys generalized clinical deterioration, and labels the worsening sepsis/pneumonia presentation Semi-Urgent. Preserve that source decision for clinical review.',
      sourceIds: ['source-f18a482635104989a380'],
      activityIds: ['vp-11'],
      field: 'content',
    },
    {
      conflictId: 'quest-qr-destination-missing',
      scope: 'content',
      status: 'unavailable',
      message:
        'Both SBAR quest sources direct the learner to scan an RT QR code for PEEP Points, but no QR destination, scoring backend, or external validation endpoint is supplied. The offline supervisor-confirmation contract retains the observable practice without inventing a destination.',
      sourceIds: ['source-f18a482635104989a380', 'source-1c7571b0559d55c2a66d'],
      activityIds: ['vp-11', 'vp-12'],
      field: 'offlineValidation',
    },
    {
      conflictId: 'quest-provider-role-mismatch',
      scope: 'mapping',
      status: 'needs_review',
      message:
        'The canonical vp-12 descriptor names a Provider, while Quest 5 repeatedly instructs the learner to find and present to an RT. The source role is preserved in the quest review notes rather than rewritten as provider guidance.',
      sourceIds: ['source-1c7571b0559d55c2a66d'],
      activityIds: ['vp-12'],
      field: 'supervisorRole',
    },
    {
      conflictId: 'vap-oral-care-contradiction',
      scope: 'content',
      status: 'needs_review',
      message:
        'The VAP lecture lists frequent chlorhexidine oral care in its prevention bundle, while VAP quiz item 5 keys saline/moistened swabs for intubated children as Strong Evidence. Preserve both statements pending age-, policy-, and evidence-level reconciliation.',
      sourceIds: ['source-e43be562b00ece446ef4', 'source-3f8c251c5b4a921d2b39'],
      activityIds: ['vp-13', 'vp-14'],
      field: 'oralCare',
    },
    {
      conflictId: 'vap-quiz-answer-bearing',
      scope: 'content',
      status: 'needs_review',
      message:
        'The VAP quiz DOCX places the correct bucket and rationale immediately after every learner item. The catalog preserves all 21 keyed answers but marks the activity for answer-gating review before deployment.',
      sourceIds: ['source-3f8c251c5b4a921d2b39'],
      activityIds: ['vp-14'],
      field: 'content',
    },
    {
      conflictId: 'vap-item-21-exception',
      scope: 'content',
      status: 'needs_review',
      message:
        'VAP quiz item 21 is keyed Not recommended for antibiotics without cultures, but its rationale explicitly allows empiric therapy in unstable patients. Preserve the exception in review text rather than flattening it into an absolute rule.',
      sourceIds: ['source-3f8c251c5b4a921d2b39'],
      activityIds: ['vp-14'],
      field: 'answer',
    },
    {
      conflictId: 'vap-lecture-claims-review',
      scope: 'source',
      status: 'needs_review',
      message:
        'The VAP lecture includes cited incidence, pathogen, diagnostic, and sequelae claims; extraction did not independently validate those citations. The reading is limited to the lecture’s stated content and remains reviewable.',
      sourceIds: ['source-e43be562b00ece446ef4'],
      activityIds: ['vp-13'],
      field: 'content',
    },
    {
      conflictId: 'valley-final-exam-content-unavailable',
      scope: 'activity',
      status: 'unavailable',
      message:
        'The authoritative final-exam descriptor is retained, but no final-exam question set or answer evidence exists in the Valley corpus. The slot remains unavailable with a null payload.',
      sourceIds: ['source-3f8c251c5b4a921d2b39'],
      activityIds: ['vp-final-exam'],
      field: 'content',
    },
  ],
  activities: [
    {
      activityId: 'vp-01',
      islandId: 'valley-of-pulmonara',
      sequence: 1,
      title: 'Bronchiolitis Pathophysiology',
      description: 'Gamer ICU bronchiolitis video; the Valley source inventory identifies the file as Bronchiolitis_GAMERICU.',
      type: 'video',
      estimatedMinutes: 10,
      peepPointsValue: 2,
      countsTowardProgress: true,
      contentStatus: 'ready',
      content: {
        media: bronchiolitisMedia,
        durationSeconds: 789.266,
        completionCondition: { kind: 'ended' },
      },
      provenance: [
        sourceRef(bronchiolitisVideo, { kind: 'whole_file' }, 'content', 'Bronchiolitis_GAMERICU audiovisual source'),
        sourceRef(bronchiolitisVideo, { kind: 'whole_file' }, 'media', 'Video media asset'),
        outlineRoster,
      ],
    },
    {
      activityId: 'vp-02',
      islandId: 'valley-of-pulmonara',
      sequence: 2,
      title: 'Asthma Pathophysiology',
      description: 'Gamer ICU critical-asthma video; the paired SBAR source also uses an intubated child with status asthmaticus and high peak pressure.',
      type: 'video',
      estimatedMinutes: 10,
      peepPointsValue: 2,
      countsTowardProgress: true,
      contentStatus: 'ready',
      content: {
        media: asthmaMedia,
        durationSeconds: 812.969,
        completionCondition: { kind: 'ended' },
      },
      provenance: [
        sourceRef(asthmaVideo, { kind: 'whole_file' }, 'content', 'CriticalAsthma_Gamer_ICU audiovisual source'),
        sourceRef(quest4, { kind: 'whole_file' }, 'review', 'Quest 4 Scenario 1: child with asthma and high peak pressure'),
        outlineRoster,
      ],
    },
    {
      activityId: 'vp-03',
      islandId: 'valley-of-pulmonara',
      sequence: 3,
      title: 'Tracheobronchomalacia',
      description: 'The roster requires a video, but the available TBM evidence is an image-heavy nursing PPTX with no Valley TBM video.',
      type: 'video',
      estimatedMinutes: 10,
      peepPointsValue: 2,
      countsTowardProgress: true,
      contentStatus: 'unavailable',
      content: null,
      conflictIds: ['vp-03-video-source-unavailable', 'tbm-management-slide-missing', 'tbm-image-led-evidence'],
      provenance: [
        sourceRef(tbmLecture, { kind: 'slide', slide: 4 }, 'review', 'Normal versus malacic tissue; airway flattening and narrowing'),
        sourceRef(tbmLecture, { kind: 'slide', slide: 5 }, 'content', 'Congenital and acquired TBM causes'),
        sourceRef(tbmLecture, { kind: 'slide', slide: 6 }, 'content', 'TBM pathophysiology: airway resistance, distress, air trapping'),
        sourceRef(tbmLecture, { kind: 'slide', slide: 7 }, 'content', 'TBM clinical manifestations'),
        sourceRef(tbmLecture, { kind: 'slide', slide: 8 }, 'content', 'CT diagnosis'),
        sourceRef(tbmLecture, { kind: 'slide', slide: 9 }, 'content', 'Bronchoscopy diagnosis'),
        sourceRef(tbmLecture, { kind: 'slide', slide: 10 }, 'review', 'Management and Nursing Considerations heading only'),
        outlineRoster,
      ],
    },
    {
      activityId: 'vp-04',
      islandId: 'valley-of-pulmonara',
      sequence: 4,
      title: 'ARDS Pathophysiology',
      description: 'Gamer ICU ARDS video paired with the Vent Lab’s trauma/ARDS waveform cases.',
      type: 'video',
      estimatedMinutes: 10,
      peepPointsValue: 2,
      countsTowardProgress: true,
      contentStatus: 'ready',
      content: {
        media: ardsMedia,
        durationSeconds: 1008.849,
        completionCondition: { kind: 'ended' },
      },
      conflictIds: ['vp-04-video-probe-missing'],
      provenance: [
        sourceRef(ardsVideo, { kind: 'whole_file' }, 'content', 'ARDS_GAMERICU audiovisual source'),
        sourceRef(ventLab, { kind: 'slide', slide: 13 }, 'content', 'Trauma patient with developing ARDS'),
        outlineRoster,
      ],
    },
    {
      activityId: 'vp-05',
      islandId: 'valley-of-pulmonara',
      sequence: 5,
      title: 'ARDS: Lung Protective Strategies',
      description: 'Reading extracted from the Vent Lab ARDS cases: PEEP titration, beaking/overdistention, and worsening compliance in PRVC.',
      type: 'reading',
      estimatedMinutes: 5,
      peepPointsValue: 1,
      countsTowardProgress: true,
      contentStatus: 'needs_review',
      content: {
        body:
          'The Vent Lab ARDS cases describe an 18-year-old trauma patient intubated for concern for developing ARDS in SIMV-PRVC-PS. In one case the settings include a tidal volume of 5 ml/kg, PEEP 16, rate 20, FiO2 80%, and saturation 85%. The source’s PEEP explanation says the normal curve is contrasted with “beaking,” which indicates overdistention of the alveoli compromising gas exchange. In a second case at PEEP 10, the ventilator alarms for high peak pressures; the keyed explanation is worsening underlying disease. The final explanation states that in PRVC, worsening compliance causes PIPs to rise and the ventilator may stop delivering the full volume.',
        confirmationQuestion: {
          prompt: 'In the Vent Lab explanation, what does a “beaking” curve indicate?',
          choices: [
            { id: 'overdistention', text: 'Overdistention of the alveoli compromising gas exchange' },
            { id: 'secretions', text: 'Secretions requiring suctioning' },
            { id: 'sedation', text: 'A need for more sedation' },
            { id: 'disease', text: 'Worsening underlying disease' },
          ],
          answer: { correctChoiceId: 'overdistention' },
          review: {
            sourceReferences: [
              sourceRef(ventLab, { kind: 'slide', slide: 15 }, 'answer', 'Beaking indicates overdistention compromising gas exchange'),
            ],
          },
        },
      },
      conflictIds: ['vent-lab-answer-slides-instructor', 'vent-lab-source-defects'],
      provenance: [
        sourceRef(ventLab, { kind: 'slide', slide: 13 }, 'content', 'Trauma/ARDS case 4'),
        sourceRef(ventLab, { kind: 'slide', slide: 15 }, 'answer', 'PEEP titration and beaking explanation'),
        sourceRef(ventLab, { kind: 'slide', slide: 16 }, 'content', 'Trauma/ARDS case 5 with high peak pressures'),
        sourceRef(ventLab, { kind: 'slide', slide: 17 }, 'answer', 'Case 5 keyed answer: underlying disease worsening'),
        sourceRef(ventLab, { kind: 'slide', slide: 18 }, 'content', 'PRVC compliance and PIP explanation'),
        outlineRoster,
      ],
    },
    {
      activityId: 'vp-06',
      islandId: 'valley-of-pulmonara',
      sequence: 6,
      title: 'Captured: Using Language to Depict Illness Severity and Course',
      description: 'The captured video file is retained as an unavailable slot because its topic and instructional mapping were not recovered.',
      type: 'video',
      estimatedMinutes: 5,
      peepPointsValue: 1,
      countsTowardProgress: true,
      contentStatus: 'unavailable',
      content: null,
      conflictIds: ['vp-06-captured-topic-unavailable'],
      provenance: [
        sourceRef(capturedVideo, { kind: 'whole_file' }, 'review', 'Captured_Video.mp4; no transcript, OCR, or topic mapping'),
        outlineRoster,
      ],
    },
    {
      activityId: 'vp-07',
      islandId: 'valley-of-pulmonara',
      sequence: 7,
      title: 'Vent Alarms 101',
      description: 'No matching Valley video was extracted; alarm causes and urgency are documented in the two SBAR quest sources.',
      type: 'video',
      estimatedMinutes: 15,
      peepPointsValue: 3,
      countsTowardProgress: true,
      contentStatus: 'unavailable',
      content: null,
      conflictIds: ['vp-07-video-source-unavailable'],
      provenance: [
        sourceRef(quest4, { kind: 'whole_file' }, 'content', 'High peak pressure, low minute volume, and high respiratory rate alarm cases'),
        sourceRef(quest5, { kind: 'whole_file' }, 'content', 'High respiratory rate, high pressure, and high PEEP alarm cases'),
        outlineRoster,
      ],
    },
    {
      activityId: 'vp-08',
      islandId: 'valley-of-pulmonara',
      sequence: 8,
      title: 'Special Considerations for EAT Patients',
      description: 'Audiovisual EAT-considerations asset; transcript and exact instructional role remain unavailable.',
      type: 'video',
      estimatedMinutes: 5,
      peepPointsValue: 1,
      countsTowardProgress: true,
      contentStatus: 'needs_review',
      content: {
        media: eatMedia,
        durationSeconds: 516.2,
        completionCondition: { kind: 'ended' },
      },
      conflictIds: ['vp-08-media-role-inferred'],
      provenance: [
        sourceRef(eatVideo, { kind: 'whole_file' }, 'media', 'Filename suggests EAT considerations; no transcript or OCR'),
        outlineRoster,
      ],
    },
    {
      activityId: 'vp-09',
      islandId: 'valley-of-pulmonara',
      sequence: 9,
      title: 'Guess That Disease',
      description: 'Vent Lab waveform/loop interaction containing five source cases with retry behavior and instructor answer slides.',
      type: 'vent_lab',
      estimatedMinutes: 10,
      peepPointsValue: 5,
      countsTowardProgress: true,
      contentStatus: 'needs_review',
      content: {
        controls: [
          {
            id: 'case',
            label: 'Choose the Vent Lab case',
            kind: 'select',
            options: ['Case 1: RSV bronchiolitis', 'Case 2: broncholitic infant dysynchrony', 'Case 3: broncholitic infant secretions/condensation', 'Case 4: trauma/ARDS with PEEP 16', 'Case 5: trauma/ARDS with high peak pressure'],
          },
          {
            id: 'answer',
            label: 'Select the best explanation',
            kind: 'select',
            options: ['They need to be suctioned', 'They need more sedation', 'Their underlying disease is worsening', 'They are not fully exhaling', 'The patient is overdistended'],
          },
          { id: 'retry', label: 'Retry an incorrect answer', kind: 'action' },
        ],
        objectives: [
          'Recognize incomplete exhalation in RSV bronchiolitis when the flow-time curve does not return toward zero and the capnogram has a shark-fin appearance.',
          'Recognize the source-keyed dysynchrony case in which the answer is more sedation, while the source also notes checking trigger sensitivity for false triggers.',
          'Recognize squiggly waveform lines as secretions or condensation in the tubing and select suctioning.',
          'Recognize PEEP-related beaking in the trauma/ARDS case and select overdistention.',
          'Recognize worsening compliance/underlying disease in the high-peak-pressure PRVC case.',
        ],
        feedback: {
          success:
            'Use the source explanation after a correct attempt: Case 1—patient is not fully exhaling; Case 2—more sedation; Case 3—suctioning for secretions or condensation; Case 4—overdistention; Case 5—underlying disease worsening with worsening compliance in PRVC.',
          incorrect: 'The source instructs the learner to try again after an incorrect choice.',
          review: {
            notes: 'The answer letters are on instructor slides 3, 8, 11, 14, and 17. Keep these explanations gated until the learner attempts each case.',
            sourceReferences: [
              sourceRef(ventLab, { kind: 'slide', slide: 3 }, 'answer', 'Case 1 keyed answer: not fully exhaling'),
              sourceRef(ventLab, { kind: 'slide', slide: 8 }, 'answer', 'Case 2 keyed answer: more sedation'),
              sourceRef(ventLab, { kind: 'slide', slide: 11 }, 'answer', 'Case 3 keyed answer: suctioning'),
              sourceRef(ventLab, { kind: 'slide', slide: 14 }, 'answer', 'Case 4 keyed answer: overdistention'),
              sourceRef(ventLab, { kind: 'slide', slide: 17 }, 'answer', 'Case 5 keyed answer: underlying disease worsening'),
            ],
          },
        },
        initialState: { case: 'Case 1: RSV bronchiolitis' },
      },
      conflictIds: ['vent-lab-answer-slides-instructor', 'vent-lab-source-defects', 'vp-09-vp-10-roster-split'],
      provenance: [
        sourceRef(ventLab, { kind: 'slide', slide: 2 }, 'content', 'Case 1 RSV bronchiolitis waveform prompt'),
        sourceRef(ventLab, { kind: 'slide', slide: 7 }, 'content', 'Case 2 broncholitic infant waveform prompt'),
        sourceRef(ventLab, { kind: 'slide', slide: 10 }, 'content', 'Case 3 secretions/condensation waveform prompt'),
        sourceRef(ventLab, { kind: 'slide', slide: 13 }, 'content', 'Case 4 trauma/ARDS waveform prompt'),
        sourceRef(ventLab, { kind: 'slide', slide: 16 }, 'content', 'Case 5 trauma/ARDS high-peak-pressure prompt'),
        outlineRoster,
      ],
    },
    {
      activityId: 'vp-10',
      islandId: 'valley-of-pulmonara',
      sequence: 10,
      title: 'Guess That Disease',
      description: 'Clinical case vignette split from Vent Lab Case 5 by the canonical roster.',
      type: 'case_vignette',
      estimatedMinutes: 10,
      peepPointsValue: 3,
      countsTowardProgress: true,
      contentStatus: 'needs_review',
      content: {
        scenario:
          'An 18-year-old trauma patient was intubated overnight for concern for developing ARDS. The overnight fellow placed the patient in SIMV-PRVC-PS with a tidal volume of 5 ml/kg, PEEP 10, rate 20, FiO2 80%, and saturation 85%. The ventilator is alarming for peak pressures that are being read as too high.',
        decisions: [
          { id: 'suction', text: 'They need to be suctioned' },
          { id: 'sedation', text: 'They need more sedation' },
          { id: 'underlying-disease', text: 'Their underlying disease is worsening' },
          { id: 'incomplete-exhalation', text: 'They are not fully exhaling' },
          { id: 'overdistended', text: 'The patient is overdistended' },
        ],
        answer: {
          acceptedDecisionIds: ['underlying-disease'],
          rationale:
            'The source keys C: the underlying disease is worsening. Its explanation states that in PRVC, worsening compliance causes PIPs to continue to rise and the ventilator may stop delivering the full volume.',
        },
        sbar: {
          prompt: 'After selecting the source-keyed explanation, communicate the high-pressure alarm, ARDS context, and assessment to the respiratory team using SBAR.',
          review: {
            notes: 'This case is split from the Vent Lab interaction for the canonical Clinical Case Vignette slot; the source answer remains instructor material.',
            sourceReferences: [
              sourceRef(ventLab, { kind: 'slide', slide: 16 }, 'content', 'Case 5 trauma/ARDS high-peak-pressure prompt'),
              sourceRef(ventLab, { kind: 'slide', slide: 17 }, 'answer', 'Case 5 keyed answer: underlying disease worsening'),
              sourceRef(ventLab, { kind: 'slide', slide: 18 }, 'content', 'PRVC worsening-compliance explanation'),
            ],
          },
        },
      },
      conflictIds: ['vent-lab-answer-slides-instructor', 'vp-09-vp-10-roster-split'],
      provenance: [
        sourceRef(ventLab, { kind: 'slide', slide: 16 }, 'content', 'Case 5 trauma/ARDS high-peak-pressure prompt'),
        sourceRef(ventLab, { kind: 'slide', slide: 17 }, 'answer', 'Case 5 keyed answer'),
        sourceRef(ventLab, { kind: 'slide', slide: 18 }, 'content', 'PRVC compliance explanation'),
        outlineRoster,
      ],
    },
    {
      activityId: 'vp-11',
      islandId: 'valley-of-pulmonara',
      sequence: 11,
      title: 'Effective Communication: Vent Alarms (RT)',
      description: 'Quest 4 SBAR practice for three alarm cases: status asthmaticus, premature-neonate low minute volume, and sepsis/pneumonia high respiratory rate.',
      type: 'quest',
      estimatedMinutes: 20,
      peepPointsValue: 10,
      countsTowardProgress: true,
      contentStatus: 'needs_review',
      content: {
        instructions:
          'Review these source cases without opening the gated answer sections. Scenario 1: Carl Sagan is a 6-year-old asthmatic in PICU room 555, intubated and mechanically ventilated; the alarm is High Peak Pressure/Paw High, with increased work of breathing, expiratory wheezing, decreased tidal and minute volumes, SpO₂ falling from 96% to 88%, and agitation despite sedation. Scenario 2: BG-Carol Ride (“Sally”) is a four-day-old 28-week neonate in NICU room 678, intubated for respiratory distress; after repositioning the alarm is Low Expiratory Minute Volume, with SpO₂ 74%, minimal chest rise, heart rate falling from the 140s to the 90s, and markedly diminished bilateral breath sounds. Scenario 3: John Glenn is a 10-year-old with septic shock and pneumonia in PICU room 546, intubated and mechanically ventilated; the High Respiratory Rate alarm accompanies breathing over the ventilator, worsening tachypnea, agitation, rising fever, increasing end-tidal CO₂, and climbing oxygen requirement. For each, determine likely cause and urgency, prepare an SBAR, find an RT, present it, and seek feedback. The source says the RT can provide an example SBAR after the attempt and directs the learner to an RT QR code for PEEP Points.',
        supervisorRole: 'Respiratory therapist (RT)',
        offlineValidation: {
          method: 'supervisor_confirmation',
          evidenceFields: ['scenario', 'likelyCause', 'urgency', 'sbarPresented', 'feedbackReceived'],
        },
        review: {
          notes: 'The source developer note requires Possible Causes, Likely Cause, Urgency, and Example SBAR to remain helpful hints or RT-only material until the learner attempts the quest.',
          sourceReferences: [
            sourceRef(quest4, { kind: 'whole_file' }, 'content', 'Quest 4 instructions and Scenarios 1–3'),
            sourceRef(quest4, { kind: 'whole_file' }, 'answer', 'Embedded possible causes, likely causes, urgency, and example SBARs'),
          ],
        },
      },
      conflictIds: ['quest-scenario-3-urgency', 'quest-qr-destination-missing'],
      provenance: [
        sourceRef(quest4, { kind: 'whole_file' }, 'content', 'Quest 4 SBAR instructions and scenarios 1–3'),
        sourceRef(quest4, { kind: 'whole_file' }, 'answer', 'Quest 4 keyed causes, urgency, and example SBARs'),
        outlineRoster,
      ],
    },
    {
      activityId: 'vp-12',
      islandId: 'valley-of-pulmonara',
      sequence: 12,
      title: 'Effective Communication: Vent Alarms (Provider)',
      description: 'Quest 5 SBAR practice for three alarm cases; the canonical roster labels this supervisor role Provider while the source directs presentation to an RT.',
      type: 'quest',
      estimatedMinutes: 20,
      peepPointsValue: 10,
      countsTowardProgress: true,
      contentStatus: 'needs_review',
      content: {
        instructions:
          'Review these source cases without opening the gated answer sections. Scenario 4: BB-Blanche Lovell (“Jim”) is a two-week-old term neonate in CVICU room 512, intubated and mechanically ventilated; the High Respiratory Rate alarm occurs while the infant is comfortable with stable pre- and post-ductal oxygen saturations, stable heart rate, appropriate chest rise, clear unchanged bilateral breath sounds, and a manual respiratory rate of 60 that does not match the ventilator reading above 100. Scenario 5: Katherine Johnson is a 3-year-old with pneumonia in PICU room 570, tracheostomy and ventilator dependent at home; the High Peak Pressure/Paw High alarm occurs with SpO₂ 82% and falling, coarse diminished breath sounds, minimal visible secretions, inability to pass the suction catheter, reduced chest rise, and retractions. Scenario 6: Maria Mitchell is a 7-year-old with severe viral pneumonia in PICU room 551, intubated and mechanically ventilated; the High PEEP alarm occurs with asynchronous breathing, prolonged exhalation, mild expiratory wheezing, SpO₂ decreasing from 98% to 93% while still stable, and restlessness. For each, determine likely cause and urgency, prepare an SBAR, and present it to the supervising provider for feedback. The source’s operational instruction says to find an RT and scan the RT QR code for PEEP Points; that source role mismatch is retained for review rather than replaced with invented provider guidance.',
        supervisorRole: 'Provider (canonical roster role; source currently directs the learner to an RT)',
        offlineValidation: {
          method: 'supervisor_confirmation',
          evidenceFields: ['scenario', 'likelyCause', 'urgency', 'sbarPresented', 'feedbackReceived'],
        },
        review: {
          notes: 'Keep Possible Causes, Likely Cause, Urgency, and Example SBAR gated until the learner attempts the quest. The source does not supply a provider QR destination or scoring endpoint.',
          sourceReferences: [
            sourceRef(quest5, { kind: 'whole_file' }, 'content', 'Quest 5 instructions and Scenarios 4–6'),
            sourceRef(quest5, { kind: 'whole_file' }, 'answer', 'Embedded possible causes, likely causes, urgency, and example SBARs'),
          ],
        },
      },
      conflictIds: ['quest-provider-role-mismatch', 'quest-qr-destination-missing'],
      provenance: [
        sourceRef(quest5, { kind: 'whole_file' }, 'content', 'Quest 5 SBAR instructions and scenarios 4–6'),
        sourceRef(quest5, { kind: 'whole_file' }, 'answer', 'Quest 5 keyed causes, urgency, and example SBARs'),
        outlineRoster,
      ],
    },
    {
      activityId: 'vp-13',
      islandId: 'valley-of-pulmonara',
      sequence: 13,
      title: 'Ventilator-Associated Pneumonia: Background and Sequelae',
      description: 'Reading/graphic drawn from the VAP lecture’s definition, development, diagnosis, pediatric VAE, sequelae, and conclusion slides.',
      type: 'reading',
      estimatedMinutes: 10,
      peepPointsValue: 2,
      countsTowardProgress: true,
      contentStatus: 'needs_review',
      content: {
        body:
          'The lecture defines ventilator-associated pneumonia as a new pneumonia occurring in a patient mechanically ventilated for more than 48 hours. It describes aspiration of bacteria-containing oropharyngeal secretions as the primary development pathway and identifies intubation, impaired consciousness, inadequate oral care, and prolonged ventilation as contributors. Diagnosis can be challenging: not every new infiltrate indicates VAP, and the lecture names the Clinical Pulmonary Infectious Score (CPIS) as a suggested scoring tool. For children and neonates, the lecture describes a pediatric VAE as an increase in daily minimum mean airway pressure of at least 4 cm H2O sustained for at least 2 calendar days after at least 2 days of stable or decreasing pressure, or an increase in FiO2 of at least 25 points sustained for at least 2 days after at least 2 days of stable or decreasing FiO2. The listed sequelae include prolonged ventilation, increased length of stay, higher mortality rates, long-term pulmonary issues, and increased healthcare costs.',
        confirmationQuestion: {
          prompt: 'According to the VAP lecture, when does a new pneumonia meet its definition of ventilator-associated pneumonia?',
          choices: [
            { id: 'more-than-48-hours', text: 'When it occurs after more than 48 hours of mechanical ventilation' },
            { id: 'any-infiltrate', text: 'Whenever any new infiltrate appears' },
            { id: 'before-intubation', text: 'Only when it was present before intubation' },
            { id: 'after-extubation', text: 'Only after extubation' },
          ],
          answer: { correctChoiceId: 'more-than-48-hours' },
          review: {
            sourceReferences: [
              sourceRef(vapLecture, { kind: 'slide', slide: 2 }, 'content', 'VAP definition after more than 48 hours of mechanical ventilation'),
            ],
          },
        },
      },
      conflictIds: ['vap-lecture-claims-review', 'vap-oral-care-contradiction'],
      provenance: [
        sourceRef(vapLecture, { kind: 'slide', slide: 2 }, 'content', 'VAP definition and PICU context'),
        sourceRef(vapLecture, { kind: 'slide', slide: 4 }, 'content', 'Aspiration and VAP development'),
        sourceRef(vapLecture, { kind: 'slide', slide: 5 }, 'content', 'Diagnosis and CPIS'),
        sourceRef(vapLecture, { kind: 'slide', slide: 6 }, 'content', 'PedVAE diagnostic consideration'),
        sourceRef(vapLecture, { kind: 'slide', slide: 9 }, 'content', 'VAP sequelae'),
        sourceRef(vapLecture, { kind: 'slide', slide: 10 }, 'content', 'VAP conclusion'),
        outlineRoster,
      ],
    },
    {
      activityId: 'vp-14',
      islandId: 'valley-of-pulmonara',
      sequence: 14,
      title: 'Ventilator-Associated Pneumonia: Prevention',
      description: 'Twenty-one-item drag-and-drop classification into Strong Evidence, Limited Evidence, and Not recommended.',
      type: 'quiz',
      estimatedMinutes: 5,
      peepPointsValue: 2,
      countsTowardProgress: true,
      contentStatus: 'needs_review',
      content: { questions: [vaporPreventionQuestion] },
      conflictIds: ['vap-oral-care-contradiction', 'vap-quiz-answer-bearing', 'vap-item-21-exception'],
      provenance: [
        sourceRef(vapQuiz, { kind: 'whole_file' }, 'content', '21 prevention-practice prompts'),
        sourceRef(vapQuiz, { kind: 'whole_file' }, 'answer', '21 keyed buckets and rationales'),
        sourceRef(vapLecture, { kind: 'slide', slide: 7 }, 'review', 'Lecture prevention bundle including chlorhexidine oral care'),
        outlineRoster,
      ],
    },
    {
      activityId: 'vp-final-exam',
      islandId: 'valley-of-pulmonara',
      sequence: 15,
      title: 'Valley of Pulmonara Final Exam',
      description: 'Final-exam descriptor retained from the canonical roster; no Valley final-exam question payload was extracted.',
      type: 'quiz',
      estimatedMinutes: 20,
      peepPointsValue: 0,
      countsTowardProgress: false,
      contentStatus: 'unavailable',
      content: null,
      conflictIds: ['valley-final-exam-content-unavailable'],
      provenance: [
        sourceRef(vapQuiz, { kind: 'whole_file' }, 'review', 'The corpus contains a 21-item VAP quiz but no final-exam question set'),
        outlineRoster,
      ],
    },
  ],
}
