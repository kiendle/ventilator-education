import type { CurriculumIsland, SourceReference } from '../types'
import { exactSourceBlocks, exactSourceText, mediaRefForSource, sourceRef } from '../generated-data'

const outlinePath = 'GameOutline.docx'
const aprvPath = '5. Mount Pneumonora/APRV.pptx'
const casePath = '5. Mount Pneumonora/GAMER-ICU – Mount Pneumonora – Escalating Care.docx'
const hfovQuizPath = '5. Mount Pneumonora/HFOV vs APRV Quiz.docx'
const hfovScriptCorpusPath = '5. Mount Pneumonora/Introduction to HFOV Script.docx'
const blankHfovPath = '5. Mount Pneumonora/IntroductiontoHFOVMountPneumora.pptx'
const questPath = '5. Mount Pneumonora/Non Conventional Ventilation_Quest8.png'
const inoQuizPath = '5. Mount Pneumonora/Ventilator Adjuncts Quiz Go from iNO to I KNOW.docx'
const inoReadingPath = '5. Mount Pneumonora/Ventilator Adjuncts- iNO, other methods.docx'
const inoGraphicPath = '5. Mount Pneumonora/VentilatorAdjunctsiNOReadingGraphicMountPneumora.pptx'
const weaningPath = '5. Mount Pneumonora/Weaning nonCMV_Video.mp4'

const outlineSourceId = 'source-7effcb159366c230bc93'
const aprvSourceId = 'source-4127d424b9b35fe0043b'
const caseSourceId = 'source-602d5bf94d753cd4ecce'
const hfovQuizSourceId = 'source-a21eec5d3a0228fe0a06'
const hfovScriptSourceId = 'source-43183594318354add9e6'
const blankHfovSourceId = 'source-e8bc7f26b998be4f7eba'
const questSourceId = 'source-0f174b416d67eab3682d'
const inoQuizSourceId = 'source-343c4e242fd2d76bed43'
const inoReadingSourceId = 'source-adadb20180aa2b6294dd'
const inoGraphicSourceId = 'source-a77c9c03925d57d9c39f'
const weaningSourceId = 'source-26a5a749292d001f1261'

const fileRef = (
  relativePath: string,
  role: NonNullable<SourceReference['role']>,
  excerpt?: string
): SourceReference => sourceRef(relativePath, { kind: 'whole_file' }, role, excerpt)

const slideRef = (
  relativePath: string,
  slide: number,
  role: NonNullable<SourceReference['role']>,
  excerpt?: string
): SourceReference => sourceRef(relativePath, { kind: 'slide', slide }, role, excerpt)

const hfovQuizReferences: SourceReference[] = [
  fileRef(hfovQuizPath, 'content', 'HFOV, APRV, and Shared Principles sorting buckets.'),
  fileRef(
    hfovQuizPath,
    'answer',
    'Optional scenarios identify both modes, MAP, and APRV as keyed responses.'
  ),
]

const inoQuizReferences: SourceReference[] = [
  fileRef(
    inoQuizPath,
    'content',
    'Improves Oxygenation, Improves Ventilator Synchrony, Requires Close Monitoring, and Escalation Strategy buckets.'
  ),
  fileRef(inoQuizPath, 'answer', 'Four scenarios have explicit best-adjunct answers.'),
]

const caseReferences: SourceReference[] = [
  fileRef(
    casePath,
    'content',
    'Tony submersion-injury case, worsening ventilator observations, and ABG.'
  ),
  fileRef(casePath, 'answer', 'Suggested, Expected, Incorrect, Maybe, and case-resolution labels.'),
]

export const mountPneumonoraIsland: CurriculumIsland = {
  id: 'mount-pneumora',
  order: 5,
  name: 'Mount Pneumora',
  description:
    'Non-conventional mechanical ventilation, ventilator adjuncts, and extubation readiness.',
  declaredTotals: {
    activityCount: 12,
    estimatedMinutes: 130,
    peepPoints: 32,
  },
  observedTotals: {
    activityCount: 15,
    estimatedMinutes: 165,
    peepPoints: 36,
  },
  activities: [
    {
      activityId: 'mp-01',
      islandId: 'mount-pneumora',
      sequence: 1,
      title: 'Ventilator Dys-synchrony',
      description:
        'The authoritative slot expects a video, but the verified corpus contains no dedicated dys-synchrony video payload.',
      estimatedMinutes: 10,
      peepPointsValue: 1,
      countsTowardProgress: true,
      contentStatus: 'unavailable',
      content: null,
      provenance: [
        fileRef(outlinePath, 'review', 'Ventilator Dys-synchrony is listed as a Video slot.'),
        fileRef(
          hfovScriptCorpusPath,
          'review',
          'The HFOV lesson mentions sedation, paralysis, and dyssynchrony but does not provide a video asset.'
        ),
      ],
      conflictIds: ['mp-dysynchrony-video'],
      type: 'video',
    },
    {
      activityId: 'mp-02',
      islandId: 'mount-pneumora',
      sequence: 2,
      title: 'Sedation Considerations',
      description:
        'The authoritative slot expects a video; verified text discusses sedation but supplies no dedicated video payload.',
      estimatedMinutes: 5,
      peepPointsValue: 1,
      countsTowardProgress: true,
      contentStatus: 'unavailable',
      content: null,
      provenance: [
        fileRef(outlinePath, 'review', 'Sedation Considerations is listed as a Video slot.'),
        fileRef(
          inoReadingPath,
          'content',
          'Sedation optimization and neuromuscular blockade are described as synchrony and lung-protection adjuncts.'
        ),
        fileRef(
          hfovScriptCorpusPath,
          'review',
          'The HFOV script says patients typically require deep sedation and sometimes paralysis.'
        ),
      ],
      conflictIds: ['mp-sedation-video'],
      type: 'video',
    },
    {
      activityId: 'mp-03',
      islandId: 'mount-pneumora',
      sequence: 3,
      title: 'Introduction to HFOV',
      description:
        'A draft HFOV script is available as lesson evidence, but the expected video payload is not present.',
      estimatedMinutes: 10,
      peepPointsValue: 1,
      countsTowardProgress: true,
      contentStatus: 'unavailable',
      content: null,
      provenance: [
        fileRef(outlinePath, 'review', 'Introduction to HFOV is listed as a Video slot.'),
        fileRef(
          hfovScriptCorpusPath,
          'content',
          'Introduction to HFOV: When Conventional Isn’t Enough script.'
        ),
        fileRef(
          blankHfovPath,
          'review',
          'Alternate HFOV PPTX shell has two slides with placeholder shapes and zero text runs.'
        ),
      ],
      conflictIds: ['mp-hfov-video-draft'],
      type: 'video',
    },
    {
      activityId: 'mp-04',
      islandId: 'mount-pneumora',
      sequence: 4,
      title: 'Welcome to My Crib: HFOV',
      description:
        'The verified corpus includes a crib-video script, but no packaged HFOV crib video or completed slide payload.',
      estimatedMinutes: 5,
      peepPointsValue: 1,
      countsTowardProgress: true,
      contentStatus: 'unavailable',
      content: null,
      provenance: [
        fileRef(outlinePath, 'review', 'Welcome to my crib: HFOV is listed as a Video slot.'),
        fileRef(
          hfovScriptCorpusPath,
          'content',
          'Welcome to My Crib: HFOV script covers MAP, amplitude, frequency, bedside assessment, and moisture.'
        ),
        fileRef(
          blankHfovPath,
          'review',
          'Alternate HFOV PPTX shell has no titles, visuals, notes, or answer material.'
        ),
      ],
      conflictIds: ['mp-hfov-video-draft'],
      type: 'video',
    },
    {
      activityId: 'mp-05',
      islandId: 'mount-pneumora',
      sequence: 5,
      title: 'Introduction to APRV',
      description:
        'The APRV deck provides teaching text and figures, including unfinished placeholders, but no APRV introduction video payload.',
      estimatedMinutes: 10,
      peepPointsValue: 1,
      countsTowardProgress: true,
      contentStatus: 'unavailable',
      content: null,
      provenance: [
        fileRef(outlinePath, 'review', 'Introduction to APRV is listed as a Video slot.'),
        fileRef(
          aprvPath,
          'content',
          'APRV deck covers open-lung ventilation, releases, MAP, and Phigh/Plow/Thigh/Tlow/PS.'
        ),
      ],
      conflictIds: ['mp-aprv-video-draft'],
      type: 'video',
    },
    {
      activityId: 'mp-06',
      islandId: 'mount-pneumora',
      sequence: 6,
      title: 'Welcome to My Crib: APRV',
      description:
        'No APRV crib-video payload was identified; the available APRV deck is an unfinished teaching deck rather than a crib walkthrough.',
      estimatedMinutes: 5,
      peepPointsValue: 1,
      countsTowardProgress: true,
      contentStatus: 'unavailable',
      content: null,
      provenance: [
        fileRef(outlinePath, 'review', 'Welcome to my crib: APRV is listed as a Video slot.'),
        fileRef(
          aprvPath,
          'review',
          'APRV deck includes [Enter Module Name], [Enter Lecture Name], ???, and *** placeholders.'
        ),
      ],
      conflictIds: ['mp-aprv-video-draft'],
      type: 'video',
    },
    {
      activityId: 'mp-07',
      islandId: 'mount-pneumora',
      sequence: 7,
      title: 'Escalating Care: Case 1',
      description:
        'Tony’s worsening oxygenation and ventilation case, including assessment, escalation communication, and SBAR.',
      estimatedMinutes: 10,
      peepPointsValue: 3,
      countsTowardProgress: true,
      contentStatus: 'ready',
      type: 'case_vignette',
      content: {
        scenario:
          'You are caring for Tony, a 4-year-old boy who had a severe submersion injury. He aspirated water, received 2 minutes of CPR by a lifeguard with return of circulation and respiratory effort before EMS arrived, and is now intubated on mechanical ventilation in the ICU. He is on synchronized intermittent mandatory ventilation with respiratory rate 18, tidal volume 6 mL/kg, FiO₂ 50%, and PEEP 8. Telemetry alerts you to progressive desaturation. A chest radiograph obtained 40 minutes ago shows bilateral infiltrates. He has coarse inspiratory crackles throughout both lung fields and bilateral chest rise. He is sedated but increasingly tachycardic. Current vital signs: HR 125, SpO₂ 89% on 50% FiO₂, ETCO₂ 60 mmHg, RR 35. What other information would you obtain, what therapeutic maneuvers would you consider, and who and how would you contact the care team?',
        decisions: [
          {
            id: 'inspect-ventilator',
            text: 'Look at the ventilator: PIP has increased to 35, with occasional failure to deliver the total Vt and high-PIP/Vt-not-delivered alarms.',
          },
          { id: 'check-etco2-waveform', text: 'Look at the ETCO₂ waveform.' },
          {
            id: 'verify-ett',
            text: 'Double-check ETT location; it is taped in the same location and has not moved.',
          },
          { id: 'suction-ett', text: 'Suction; only scant clear secretions are present.' },
          {
            id: 'consider-airway-clearance',
            text: 'Consider airway clearance; the source marks this option plus or minus.',
          },
          {
            id: 'repeat-cxr',
            text: 'Obtain a repeat CXR, while noting that the recent CXR, exam, and history already support worsening.',
          },
          {
            id: 'obtain-abg',
            text: 'Obtain an ABG; the source notes that this usually requires an order.',
          },
          {
            id: 'direct-call',
            text: 'Make a direct phone call to the fellow, attending, or RT as the first call.',
          },
          {
            id: 'text-chat',
            text: 'Use text or Epic chat for an actively decompensating patient.',
          },
        ],
        answer: {
          acceptedDecisionIds: [
            'inspect-ventilator',
            'check-etco2-waveform',
            'verify-ett',
            'suction-ett',
            'repeat-cxr',
            'obtain-abg',
            'direct-call',
          ],
          rationale:
            'The source’s Suggested section calls for ventilator and ETCO₂ assessment, ETT verification, suction, consideration of CXR and ABG, and direct escalation. It labels text/Epic chat as not suggested for an actively decompensating patient.',
        },
        sbar: {
          prompt:
            'Use SBAR to notify the attending about Tony’s hypoxemia, tachypnea, and elevated ETCO₂. Include the recent submersion injury and prior stability, the new desaturations, adequate chest movement and bilateral air entry, suction without improvement, increased FiO₂, your assessment that respiratory distress is worsening, and a request for a blood gas or other interventions.',
          review: {
            sourceReferences: [
              fileRef(
                casePath,
                'answer',
                'Expected SBAR begins: I am calling for Tony, who is having hypoxemia, tachypnea, and elevated ETCO₂.'
              ),
            ],
          },
        },
      },
      provenance: caseReferences,
      conflictIds: ['mp-case-split'],
    },
    {
      activityId: 'mp-08',
      islandId: 'mount-pneumora',
      sequence: 8,
      title: 'Escalating Care: Case 2',
      description:
        'The second case segment uses Tony’s ABG to identify acute respiratory acidosis and the source’s expected escalation options; source-marked Maybe tidal-volume changes remain for manual review.',
      estimatedMinutes: 10,
      peepPointsValue: 3,
      countsTowardProgress: true,
      contentStatus: 'ready',
      type: 'case_vignette',
      content: {
        scenario:
          'After the first-call provider is notified, FiO₂ is increased to 60% and an arterial blood gas is ordered. Results: pH 7.15 / pCO₂ 70 mmHg / pO₂ 60 mmHg / HCO₃⁻ 22 mmol/L / lactic acid 2 mmol/L / glucose 86 mg/dL. Interpret this blood gas and identify possible changes the attending physician might make in this clinical setting.',
        decisions: [
          {
            id: 'abg-acute-respiratory-acidosis',
            text: 'Interpret the blood gas as acute respiratory acidosis.',
          },
          {
            id: 'abg-respiratory-alkalosis',
            text: 'Interpret the blood gas as respiratory alkalosis.',
          },
          { id: 'abg-normal', text: 'Interpret the blood gas as normal.' },
          {
            id: 'abg-metabolic-acidosis-only',
            text: 'Interpret the blood gas as metabolic acidosis as the only listed disorder.',
          },
          {
            id: 'abg-metabolic-alkalosis',
            text: 'Interpret the blood gas as metabolic alkalosis.',
          },
          {
            id: 'abg-chronic-respiratory-acidosis',
            text: 'Interpret the blood gas as chronic respiratory acidosis; the source says this does not fit the clinical story and the pH change fits acute respiratory acidosis.',
          },
          {
            id: 'increase-rate',
            text: 'Increase the respiratory rate if the patient is exhaling fully, to help decrease PaCO₂ and improve respiratory acidosis.',
          },
          {
            id: 'increase-peep',
            text: 'Increase PEEP to allow better lung expansion for improved oxygenation.',
          },
          { id: 'consider-aprv', text: 'Consider APRV.' },
          { id: 'consider-oscillator', text: 'Consider an oscillator.' },
          { id: 'consider-ecmo', text: 'Consider ECMO.' },
          {
            id: 'sodium-bicarbonate',
            text: 'Administer sodium bicarbonate to treat the underlying respiratory disorder.',
          },
          { id: 'decrease-rate', text: 'Turn down the respiratory rate.' },
          { id: 'increase-pip', text: 'Increase PIP.' },
          {
            id: 'increase-vt-maybe',
            text: 'Increase Vt; the source labels this a Maybe option and notes PIP limitation to avoid barotrauma.',
          },
          {
            id: 'decrease-vt-maybe',
            text: 'Decrease Vt; the source labels this a Maybe option in the context of possible ARDS and lung protection.',
          },
        ],
        answer: {
          acceptedDecisionIds: [
            'abg-acute-respiratory-acidosis',
            'increase-rate',
            'increase-peep',
            'consider-aprv',
            'consider-oscillator',
            'consider-ecmo',
          ],
          rationale:
            'The source keys acute respiratory acidosis. It lists increased respiratory rate, increased PEEP, APRV, oscillator, and ECMO as expected answers; respiratory alkalosis, normal blood gas, metabolic acidosis as the only disorder, metabolic alkalosis, chronic respiratory acidosis, sodium bicarbonate, lower respiratory rate, and higher PIP are marked incorrect. Vt changes remain explicitly marked Maybe and are not scored as accepted here.',
        },
        sbar: {
          prompt:
            'Communicate the ABG interpretation and expected escalation options to the attending, preserving the source’s distinction between expected, incorrect, and Maybe responses.',
          review: {
            sourceReferences: [
              fileRef(
                casePath,
                'answer',
                'Expected acute respiratory acidosis and Expected/Incorrect/Maybe response labels.'
              ),
            ],
          },
        },
      },
      provenance: caseReferences,
      conflictIds: ['mp-case-split', 'mp-case-vt-ambiguity'],
    },
    {
      activityId: 'mp-09',
      islandId: 'mount-pneumora',
      sequence: 9,
      title: 'HFOV vs APRV',
      description:
        'Sort source-keyed mode-specific and shared principles, then answer the source’s optional scenarios.',
      estimatedMinutes: 10,
      peepPointsValue: 3,
      countsTowardProgress: true,
      contentStatus: 'ready',
      type: 'quiz',
      content: {
        questions: [
          {
            id: 'hfov-aprv-buckets',
            interaction: 'drag_drop',
            prompt: 'Sort each statement into the HFOV, APRV, or Shared Principles bucket.',
            choices: [
              { id: 'hfov-tiny-vt', text: 'Delivers very small tidal volumes at high frequency' },
              { id: 'hfov-active-breathing', text: 'Active inhalation AND exhalation' },
              { id: 'hfov-amplitude-co2', text: 'Uses amplitude to control CO2 removal' },
              { id: 'hfov-frequency', text: 'Uses frequency (Hz) to affect ventilation' },
              { id: 'hfov-no-vt-display', text: 'No traditional tidal volume display' },
              { id: 'hfov-wiggle', text: '“wiggle factor” used for assessment' },
              { id: 'aprv-phigh-plow', text: 'Uses Phigh and Plow' },
              { id: 'aprv-time-based', text: 'Time-based ventilation (Thigh/Tlow)' },
              { id: 'aprv-spontaneous', text: 'Allows spontaneous breathing' },
              { id: 'aprv-release', text: 'Ventilation occurs during pressure release' },
              { id: 'aprv-cpap-releases', text: 'Often described as “CPAP with releases”' },
              {
                id: 'shared-failed-conventional',
                text: 'Used when conventional ventilation is not meeting goals',
              },
              { id: 'shared-lung-protection', text: 'Focus on lung protection' },
              { id: 'shared-map-oxygenation', text: 'Mean airway pressure impacts oxygenation' },
              { id: 'shared-hemodynamics', text: 'Require close monitoring of hemodynamics' },
              { id: 'shared-trends', text: 'Managed based on trends, not single values' },
              { id: 'shared-collaboration', text: 'Require strong RT/provider collaboration' },
            ],
            targets: [
              { id: 'hfov', text: 'HFOV' },
              { id: 'aprv', text: 'APRV' },
              { id: 'shared', text: 'Shared Principles' },
            ],
            answer: {
              interaction: 'drag_drop',
              placements: {
                'hfov-tiny-vt': 'hfov',
                'hfov-active-breathing': 'hfov',
                'hfov-amplitude-co2': 'hfov',
                'hfov-frequency': 'hfov',
                'hfov-no-vt-display': 'hfov',
                'hfov-wiggle': 'hfov',
                'aprv-phigh-plow': 'aprv',
                'aprv-time-based': 'aprv',
                'aprv-spontaneous': 'aprv',
                'aprv-release': 'aprv',
                'aprv-cpap-releases': 'aprv',
                'shared-failed-conventional': 'shared',
                'shared-lung-protection': 'shared',
                'shared-map-oxygenation': 'shared',
                'shared-hemodynamics': 'shared',
                'shared-trends': 'shared',
                'shared-collaboration': 'shared',
              },
            },
            review: { sourceReferences: hfovQuizReferences },
          },
          {
            id: 'hfov-aprv-severe-ards',
            interaction: 'mcq',
            prompt:
              'A patient has severe ARDS and is not improving on a conventional ventilator. Which mode options does the source say could be considered?',
            choices: [
              { id: 'both-modes', text: 'Both HFOV and APRV could be considered.' },
              { id: 'hfov-only', text: 'HFOV only.' },
              { id: 'aprv-only', text: 'APRV only.' },
              { id: 'neither-mode', text: 'Neither mode.' },
            ],
            answer: { interaction: 'mcq', correctChoiceIds: ['both-modes'] },
            review: { sourceReferences: hfovQuizReferences },
          },
          {
            id: 'hfov-aprv-map',
            interaction: 'mcq',
            prompt:
              'The source’s oxygenation-and-recruitment scenario points to which shared concept?',
            choices: [
              { id: 'map', text: 'Mean airway pressure (MAP).' },
              { id: 'amplitude', text: 'Amplitude.' },
              { id: 'frequency', text: 'Frequency (Hz).' },
              { id: 'phigh', text: 'Phigh.' },
            ],
            answer: { interaction: 'mcq', correctChoiceIds: ['map'] },
            review: { sourceReferences: hfovQuizReferences },
          },
          {
            id: 'hfov-aprv-spontaneous',
            interaction: 'mcq',
            prompt:
              'A patient needs spontaneous breathing preserved. Which mode does the source identify?',
            choices: [
              { id: 'aprv-preserves', text: 'APRV.' },
              { id: 'hfov-preserves', text: 'HFOV.' },
              { id: 'shared-preserves', text: 'Both modes are identified.' },
              { id: 'neither-preserves', text: 'Neither mode is identified.' },
            ],
            answer: { interaction: 'mcq', correctChoiceIds: ['aprv-preserves'] },
            review: { sourceReferences: hfovQuizReferences },
          },
        ],
      },
      provenance: hfovQuizReferences,
    },
    {
      activityId: 'mp-10',
      islandId: 'mount-pneumora',
      sequence: 10,
      title: 'Weaning from non-CMV',
      description:
        'The MP4 is packaged and playable as a learner asset, but its teaching sequence is not verified because no transcript/captions/chapter text were extracted and ffprobe was unavailable.',
      estimatedMinutes: 10,
      peepPointsValue: 1,
      countsTowardProgress: true,
      contentStatus: 'ready',
      type: 'video',
      content: {
        media: mediaRefForSource(weaningPath),
        durationSeconds: 387.697,
        completionCondition: { kind: 'ended' },
      },
      provenance: [
        fileRef(outlinePath, 'review', 'Weaning from non-CMV is listed as a Video slot.'),
        fileRef(
          weaningPath,
          'media',
          'MP4 asset; filename identifies non-CMV weaning, but no transcript or chapter text is verified.'
        ),
      ],
      conflictIds: ['mp-weaning-media-review'],
    },
    {
      activityId: 'mp-11',
      islandId: 'mount-pneumora',
      sequence: 11,
      title: 'Ventilator Adjuncts: iNO',
      description:
        'Reading text is available; the six-slide visual companion is only partly structured, with five raster-only slides whose labels cannot be safely recovered.',
      estimatedMinutes: 10,
      peepPointsValue: 2,
      countsTowardProgress: true,
      contentStatus: 'ready',
      type: 'reading',
      content: {
        blocks: exactSourceBlocks(inoReadingPath),
        body: exactSourceText(inoReadingPath),
        confirmationQuestion: {
          prompt: 'Which statement is identified in the source as iNO’s key concept?',
          choices: [
            { id: 'ino-oxygenation', text: 'It improves oxygenation, NOT ventilation.' },
            { id: 'ino-ecmo', text: 'It is the final escalation beyond ventilator support.' },
            { id: 'ino-paralysis', text: 'It is used when sedation alone is not enough.' },
            { id: 'ino-aprv', text: 'It uses time-based Thigh/Tlow ventilation.' },
          ],
          answer: { correctChoiceId: 'ino-oxygenation' },
          review: {
            explanation: exactSourceText(inoReadingPath),
            sourceReferences: [
              fileRef(
                inoReadingPath,
                'answer',
                'The iNO Key concept is: Improves oxygenation, NOT ventilation.'
              ),
              slideRef(
                inoGraphicPath,
                2,
                'media',
                'Slide 2 is the only slide with structured introductory text; the graphic deck is the visual companion.'
              ),
            ],
          },
        },
      },
      provenance: [
        fileRef(
          inoReadingPath,
          'content',
          'Adjuncts reading/reference with iNO, proning, recruitment, sedation, paralytics, HFOV/APRV, and ECMO.'
        ),
        fileRef(
          inoGraphicPath,
          'media',
          'Six-slide iNO/adjunct visual companion; five slides are raster-only.'
        ),
      ],
      conflictIds: ['mp-ino-raster'],
    },
    {
      activityId: 'mp-12',
      islandId: 'mount-pneumora',
      sequence: 12,
      title: 'Go from iNO to I KNOW',
      description:
        'Sort the source-keyed adjunct buckets and answer the four explicit best-adjunct scenarios.',
      estimatedMinutes: 10,
      peepPointsValue: 3,
      countsTowardProgress: true,
      contentStatus: 'ready',
      type: 'quiz',
      content: {
        questions: [
          {
            id: 'ino-adjunct-buckets',
            interaction: 'drag_drop',
            prompt:
              'Sort each adjunct statement into Improves Oxygenation, Improves Ventilator Synchrony, Requires Close Monitoring, or Escalation Strategy.',
            choices: [
              { id: 'ino-oxygenation', text: 'Inhaled nitric oxide' },
              { id: 'prone-oxygenation', text: 'Prone positioning' },
              { id: 'recruitment-oxygenation', text: 'Recruitment strategies' },
              { id: 'map-oxygenation', text: 'Increasing mean airway pressure (tie-in concept)' },
              { id: 'sedation-synchrony', text: 'Sedation optimization' },
              { id: 'nmb-synchrony', text: 'Neuromuscular blockade' },
              { id: 'ino-monitoring', text: 'iNO (methemoglobin, rebound risk)' },
              { id: 'paralytic-monitoring', text: 'Paralytics (sedation, complications)' },
              { id: 'recruitment-monitoring', text: 'Recruitment maneuvers (hemodynamics)' },
              { id: 'proning-monitoring', text: 'Proning (airway, lines, pressure injury)' },
              { id: 'hfov-escalation', text: 'HFOV' },
              { id: 'aprv-escalation', text: 'APRV' },
              { id: 'ecmo-escalation', text: 'ECMO' },
            ],
            targets: [
              { id: 'oxygenation', text: 'Improves Oxygenation' },
              { id: 'synchrony', text: 'Improves Ventilator Synchrony' },
              { id: 'monitoring', text: 'Requires Close Monitoring' },
              { id: 'escalation', text: 'Escalation Strategy' },
            ],
            answer: {
              interaction: 'drag_drop',
              placements: {
                'ino-oxygenation': 'oxygenation',
                'prone-oxygenation': 'oxygenation',
                'recruitment-oxygenation': 'oxygenation',
                'map-oxygenation': 'oxygenation',
                'sedation-synchrony': 'synchrony',
                'nmb-synchrony': 'synchrony',
                'ino-monitoring': 'monitoring',
                'paralytic-monitoring': 'monitoring',
                'recruitment-monitoring': 'monitoring',
                'proning-monitoring': 'monitoring',
                'hfov-escalation': 'escalation',
                'aprv-escalation': 'escalation',
                'ecmo-escalation': 'escalation',
              },
            },
            review: { sourceReferences: inoQuizReferences },
          },
          {
            id: 'ino-scenario-pulmonary-hypertension',
            interaction: 'mcq',
            prompt:
              'A patient has severe hypoxemia and suspected pulmonary hypertension. What is the best adjunct?',
            choices: [
              { id: 'scenario-ino', text: 'iNO' },
              { id: 'scenario-sedation', text: 'sedation or paralytic' },
              { id: 'scenario-proning', text: 'proning' },
              { id: 'scenario-recruitment', text: 'recruitment strategy' },
            ],
            answer: { interaction: 'mcq', correctChoiceIds: ['scenario-ino'] },
            review: { sourceReferences: inoQuizReferences },
          },
          {
            id: 'ino-scenario-dyssynchrony',
            interaction: 'mcq',
            prompt:
              'A patient is fighting the ventilator and has large swings in pressure. What does the source identify as the best adjunct?',
            choices: [
              { id: 'dyssynchrony-sedation', text: 'sedation or paralytic' },
              { id: 'dyssynchrony-ino', text: 'iNO' },
              { id: 'dyssynchrony-proning', text: 'proning' },
              { id: 'dyssynchrony-recruitment', text: 'recruitment strategy' },
            ],
            answer: { interaction: 'mcq', correctChoiceIds: ['dyssynchrony-sedation'] },
            review: { sourceReferences: inoQuizReferences },
          },
          {
            id: 'ino-scenario-ards',
            interaction: 'mcq',
            prompt:
              'A patient with ARDS has poor oxygenation despite high FiO₂. What does the source identify as the best adjunct?',
            choices: [
              { id: 'ards-proning', text: 'proning' },
              { id: 'ards-ino', text: 'iNO' },
              { id: 'ards-sedation', text: 'sedation or paralytic' },
              { id: 'ards-recruitment', text: 'recruitment strategy' },
            ],
            answer: { interaction: 'mcq', correctChoiceIds: ['ards-proning'] },
            review: { sourceReferences: inoQuizReferences },
          },
          {
            id: 'ino-scenario-collapse',
            interaction: 'mcq',
            prompt:
              'A patient has alveolar collapse. What does the source identify as the best adjunct?',
            choices: [
              { id: 'collapse-recruitment', text: 'recruitment strategy' },
              { id: 'collapse-ino', text: 'iNO' },
              { id: 'collapse-proning', text: 'proning' },
              { id: 'collapse-sedation', text: 'sedation or paralytic' },
            ],
            answer: { interaction: 'mcq', correctChoiceIds: ['collapse-recruitment'] },
            review: { sourceReferences: inoQuizReferences },
          },
        ],
      },
      provenance: inoQuizReferences,
    },
    {
      activityId: 'mp-13',
      islandId: 'mount-pneumora',
      sequence: 13,
      title: 'Understanding the non-CMV Interface',
      description:
        'The blueprint names two cases (one HFOV and one APRV), but no case settings, interface controls, or completed interactive lab payload were recovered.',
      estimatedMinutes: 20,
      peepPointsValue: 5,
      countsTowardProgress: true,
      contentStatus: 'unavailable',
      content: null,
      provenance: [
        fileRef(
          outlinePath,
          'review',
          'Understanding the non-CMV Interface is listed as a Vent Lab with two cases.'
        ),
        fileRef(
          hfovScriptCorpusPath,
          'review',
          'Blueprint names two vent-lab cases: one HFOV and one APRV, without case settings or controls.'
        ),
        fileRef(
          blankHfovPath,
          'review',
          'HFOV companion PPTX is blank with placeholder shapes and no text or media.'
        ),
        fileRef(
          aprvPath,
          'review',
          'APRV deck is teaching reference material, not a two-case interactive lab.'
        ),
      ],
      conflictIds: ['mp-interface-payload'],
      type: 'vent_lab',
    },
    {
      activityId: 'mp-14',
      islandId: 'mount-pneumora',
      sequence: 14,
      title: 'Understanding the non-CMV Rationale',
      description:
        'A real bedside investigation flow is available, but the poster/script differ on RT versus RT/provider roles and the PEEP-points QR/final-question mechanism is unresolved.',
      estimatedMinutes: 20,
      peepPointsValue: 10,
      countsTowardProgress: true,
      contentStatus: 'ready',
      type: 'quest',
      content: {
        instructions: `Step 1 — Identify and observe a patient currently on non-conventional mechanical ventilation, such as HFOV or APRV/Bi-Vent. Record the patient’s primary diagnosis or lung pathology, what concerns may have led to escalation from conventional ventilation, and what you notice about the ventilator interface and displayed values.

Step 2 — Engage an expert. Ask an RT or provider to walk through the patient with you and ask: “Can you help me understand why this patient is on this mode instead of conventional ventilation?” “What problem are we trying to solve with this mode?” and “Which settings are most important right now and what are they targeting?”

Step 3 — Connect physiology to the ventilator. Identify what aspect of oxygenation and/or ventilation is failing, how HFOV or APRV addresses that problem differently than conventional ventilation, and what trends or clinical signs indicate improvement or worsening.

Step 4 — Reflect and summarize with the expert. Explain why this patient requires non-conventional ventilation, what the key ventilator settings are trying to achieve, and one new insight you gained from the conversation.`,
        supervisorRole: 'Respiratory therapist or provider',
        offlineValidation: {
          method: 'supervisor_confirmation',
          evidenceFields: [
            'patientMode',
            'diagnosisOrLungPathology',
            'reasonForEscalation',
            'keySettingsAndTargets',
            'improvementOrWorseningTrends',
            'expertFeedback',
            'newInsight',
          ],
        },
        review: {
          notes:
            'The script considers either a final question or a QR code for PEEP points, while the poster directs the learner to an RT email/office QR code. No QR code is embedded in the verified poster image, so this scoring mechanism remains unresolved.',
          sourceReferences: [
            fileRef(
              hfovScriptCorpusPath,
              'content',
              'Quest blueprint with four steps: identify/observe, engage an expert, connect physiology, reflect/summarize.'
            ),
            fileRef(
              questPath,
              'media',
              'QUEST #8 poster asks the learner to find an RT partner, observe HFOV or APRV/Bi-Vent, discuss diagnosis, settings, trends, adjuncts, and obtain RT feedback.'
            ),
          ],
        },
      },
      provenance: [
        fileRef(
          hfovScriptCorpusPath,
          'content',
          'Why Not Conventional? quest instructions and prompts.'
        ),
        fileRef(questPath, 'media', 'QUEST #8 bedside poster.'),
      ],
      conflictIds: ['mp-quest-flow', 'mp-quest-qr'],
    },
    {
      activityId: 'mp-final-exam',
      islandId: 'mount-pneumora',
      sequence: 15,
      title: 'Mount Pneumora Final Exam',
      description:
        'The canonical final-exam slot is required, but no final-exam questions or answer key are present in the verified corpus.',
      estimatedMinutes: 20,
      peepPointsValue: 0,
      countsTowardProgress: false,
      contentStatus: 'unavailable',
      content: null,
      provenance: [
        fileRef(
          outlinePath,
          'review',
          'Canonical roster requires Mount Pneumora Final Exam as a Quiz slot.'
        ),
        fileRef(
          hfovQuizPath,
          'review',
          'Verified HFOV/APRV quiz is an instructional source, not a final-exam payload.'
        ),
        fileRef(
          inoQuizPath,
          'review',
          'Verified iNO adjunct quiz is an instructional source, not a final-exam payload.'
        ),
        fileRef(
          casePath,
          'review',
          'Verified escalation case is an instructional source, not a final-exam payload.'
        ),
      ],
      conflictIds: ['mp-final-exam-missing'],
      type: 'quiz',
    },
  ],
  conflicts: [
    {
      conflictId: 'mp-outline-spelling',
      scope: 'mapping',
      status: 'ready',
      message:
        'The canonical outline names the island Mount Pneumora, while the corpus folder and several filenames use Mount Pneumonora. The stable island ID is mount-pneumora.',
      sourceIds: [outlineSourceId, hfovScriptSourceId],
      field: 'name',
      declaredValue: 'Mount Pneumora',
      observedValue: 'Mount Pneumonora',
    },
    {
      conflictId: 'mp-outline-totals',
      scope: 'totals',
      status: 'ready',
      message:
        'GameOutline declares 12 activities, 130 minutes, and 32 PEEP Points, while its visible raw rows contain 13 rows totaling 135 minutes and 33 points. The canonical roster requires 15 records (including Case 2 and the final exam), observed here as 165 minutes and 36 points.',
      sourceIds: [outlineSourceId, caseSourceId, hfovScriptSourceId],
      declaredValue: { activityCount: 12, estimatedMinutes: 130, peepPoints: 32 },
      observedValue: { activityCount: 15, estimatedMinutes: 165, peepPoints: 36 },
    },
    {
      conflictId: 'mp-dysynchrony-video',
      scope: 'activity',
      status: 'unavailable',
      message:
        'The roster expects a dedicated Ventilator Dys-synchrony video, but the verified corpus supplies only related text references and no video payload.',
      sourceIds: [outlineSourceId, hfovScriptSourceId],
      activityIds: ['mp-01'],
    },
    {
      conflictId: 'mp-sedation-video',
      scope: 'activity',
      status: 'unavailable',
      message:
        'The roster expects a dedicated Sedation Considerations video; sedation text appears in adjunct/HFOV materials, but no dedicated video payload was recovered.',
      sourceIds: [outlineSourceId, inoReadingSourceId, hfovScriptSourceId],
      activityIds: ['mp-02'],
    },
    {
      conflictId: 'mp-hfov-video-draft',
      scope: 'content',
      status: 'unavailable',
      message:
        'HFOV script content is available, but the expected Introduction and Welcome-to-My-Crib videos are not packaged. The alternate HFOV PPTX is a genuinely blank two-slide shell with no text or media.',
      sourceIds: [outlineSourceId, hfovScriptSourceId, blankHfovSourceId],
      activityIds: ['mp-03', 'mp-04'],
    },
    {
      conflictId: 'mp-aprv-video-draft',
      scope: 'content',
      status: 'unavailable',
      message:
        'The APRV source is a four-slide teaching deck, not either expected APRV video. It retains [Enter Module Name], [Enter Lecture Name], ???, and *** placeholders, and its visual content is partly rasterized.',
      sourceIds: [outlineSourceId, aprvSourceId],
      activityIds: ['mp-05', 'mp-06'],
    },
    {
      conflictId: 'mp-case-split',
      scope: 'mapping',
      status: 'ready',
      message:
        'The verified escalation DOCX contains one case with Case part 1 and Case part 2. The canonical roster intentionally exposes those source segments as Case 1 and Case 2 activities.',
      sourceIds: [outlineSourceId, caseSourceId],
      activityIds: ['mp-07', 'mp-08'],
    },
    {
      conflictId: 'mp-case-vt-ambiguity',
      scope: 'content',
      status: 'ready',
      message:
        'The escalation source labels increased Vt and decreased Vt as Maybe options rather than Expected or Incorrect. The Case 2 answer accepts only the explicitly Expected interventions.',
      sourceIds: [caseSourceId],
      activityIds: ['mp-08'],
    },
    {
      conflictId: 'mp-weaning-media-review',
      scope: 'source',
      status: 'ready',
      message:
        'The non-CMV MP4 is available with a verified 387.697-second duration but no transcript, captions, or chapter text. The release accepts the filename and roster mapping while presenting the original audiovisual source unchanged.',
      sourceIds: [outlineSourceId, weaningSourceId],
      activityIds: ['mp-10'],
    },
    {
      conflictId: 'mp-ino-raster',
      scope: 'content',
      status: 'ready',
      message:
        'The adjunct graphic deck has six PNG slides. Only slide 2 has structured text; slides 1 and 3–6 are raster-only, so their complete labels cannot be safely transcribed into the reading.',
      sourceIds: [inoReadingSourceId, inoGraphicSourceId],
      activityIds: ['mp-11'],
    },
    {
      conflictId: 'mp-interface-payload',
      scope: 'activity',
      status: 'unavailable',
      message:
        'The HFOV script blueprint names two vent-lab cases, one HFOV and one APRV, but no case settings, interface controls, target states, or feedback payload is present. The companion HFOV PPTX is blank.',
      sourceIds: [outlineSourceId, hfovScriptSourceId, blankHfovSourceId, aprvSourceId],
      activityIds: ['mp-13'],
    },
    {
      conflictId: 'mp-quest-flow',
      scope: 'mapping',
      status: 'ready',
      message:
        'The script gives a four-step RT/provider investigation and reflection flow. The QUEST #8 poster uses an RT partner, four numbered steps, and adds oxygenation/adjunct prompts. Both are preserved as source variants.',
      sourceIds: [hfovScriptSourceId, questSourceId],
      activityIds: ['mp-14'],
    },
    {
      conflictId: 'mp-quest-qr',
      scope: 'content',
      status: 'ready',
      message:
        'The poster directs the learner to scan an RT external email/office QR code for points, but no QR code is embedded in the verified PNG. The script is uncertain whether to use a QR code or a standard final question.',
      sourceIds: [hfovScriptSourceId, questSourceId],
      activityIds: ['mp-14'],
    },
    {
      conflictId: 'mp-final-exam-missing',
      scope: 'activity',
      status: 'unavailable',
      message:
        'The canonical roster requires one Mount Pneumora Final Exam quiz slot, but the verified source set contains no final-exam question set or answer key.',
      sourceIds: [outlineSourceId, hfovQuizSourceId, inoQuizSourceId, caseSourceId],
      activityIds: ['mp-final-exam'],
    },
  ],
}
