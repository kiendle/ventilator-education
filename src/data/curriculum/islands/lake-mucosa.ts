import type { CurriculumIsland } from '../types'
import { mediaRefForSource, sourceRef } from '../generated-data'

const lakeMucosaIsland: CurriculumIsland = {
  id: 'lake-mucosa',
  order: 1,
  name: 'Lake Mucosa',
  description:
    'Review of the basics, introduction to respiratory and airway anatomy and physiology, oxygenation, ventilation, and ventilator interfaces.',
  declaredTotals: {
    activityCount: 16,
    estimatedMinutes: 130,
    peepPoints: 45,
  },
  observedTotals: {
    activityCount: 17,
    estimatedMinutes: 150,
    peepPoints: 45,
  },
  conflicts: [
    {
      conflictId: 'lm-roster-total-excludes-final',
      scope: 'totals',
      status: 'needs_review',
      message:
        'GameOutline declares 16 activities, 130 minutes, and 45 PEEP Points for Lake Mucosa. The canonical roster adds the required 20-minute final-exam descriptor, so the observed catalog contains 17 slots and 150 minutes while preserving the source-declared instructional total.',
      sourceIds: ['source-7effcb159366c230bc93'],
      activityIds: ['lm-final-exam'],
      field: 'declaredTotals',
      declaredValue: { activityCount: 16, estimatedMinutes: 130, peepPoints: 45 },
      observedValue: { activityCount: 17, estimatedMinutes: 150, peepPoints: 45 },
    },
    {
      conflictId: 'lm-ventilation-title-normalization',
      scope: 'mapping',
      status: 'needs_review',
      message:
        'The GameOutline labels the ventilation topic “Ventilation (& Minute Ventilation)”; the canonical roster uses “Ventilation & Minute Ventilation”.',
      sourceIds: ['source-7effcb159366c230bc93'],
      activityIds: ['lm-04', 'lm-05', 'lm-06'],
      field: 'title',
      declaredValue: 'Ventilation (& Minute Ventilation)',
      observedValue: 'Ventilation & Minute Ventilation',
    },
    {
      conflictId: 'lm-oxygenation-multi-answer-shape',
      scope: 'content',
      status: 'needs_review',
      message:
        'Oxygenation & MAP Quiz question 2 explicitly marks both FiO₂ and PEEP as correct, while the current mcq discriminated shape exposes one correctChoiceId. The source answer is retained in the review text and this representation is flagged for schema review.',
      sourceIds: ['source-9a35f406920f298d2898'],
      activityIds: ['lm-03'],
      field: 'content.questions[1].answer',
      declaredValue: ['FiO₂', 'PEEP'],
      observedValue: 'FiO₂',
    },
    {
      conflictId: 'lm-oxygenation-reading-glyphs',
      scope: 'content',
      status: 'needs_review',
      message:
        'The PDF extraction substitutes glyphs such as 4, ¢, and � in punctuation and O₂/CO₂ tokens. The raw extracted wording is retained and requires rendered-page verification.',
      sourceIds: ['source-207040924f5e8da2281c'],
      activityIds: ['lm-02'],
      field: 'content.body',
    },
    {
      conflictId: 'lm-ventilation-reading-glyphs',
      scope: 'content',
      status: 'needs_review',
      message:
        'The PDF extraction substitutes � inside words including Fra�ework, Eli�i�ated, Pre��ure Co�trol, and Sce�ario. The raw extracted wording is retained and requires rendered-page verification.',
      sourceIds: ['source-b4e00ead889bf9410184'],
      activityIds: ['lm-05'],
      field: 'content.body',
    },
    {
      conflictId: 'lm-pulmonary-lobe-wording',
      scope: 'content',
      status: 'needs_review',
      message:
        'The Pulmonary Anatomy speaker note says the bronchi separate into three lobes on the right and two lobes on the right. This contradiction is preserved verbatim rather than corrected to left.',
      sourceIds: ['source-eddb8cc88e8f7218283d'],
      activityIds: ['lm-08'],
      field: 'content.body',
    },
    {
      conflictId: 'lm-monitoring-dragdrop-mapping',
      scope: 'mapping',
      status: 'needs_review',
      message:
        'The TCOM-vs-EtCO2 document presents category labels and scenario Likely/Problem lines, but does not mark every drag item with a separate answer key. Placements follow the source category headings.',
      sourceIds: ['source-f849ae831ec912bfb643'],
      activityIds: ['lm-10'],
      field: 'content.questions[0].answer.placements',
    },
    {
      conflictId: 'lm-oxygenation-ventilation-dragdrop-mapping',
      scope: 'mapping',
      status: 'needs_review',
      message:
        'The Oxygenation vs. Ventilation document supplies category headings and a directly stated bonus answer, but does not explicitly mark every drag item with answer formatting. Placements follow those source headings.',
      sourceIds: ['source-edf7ae981cb8be241867'],
      activityIds: ['lm-11'],
      field: 'content.questions[0].answer.placements',
    },
    {
      conflictId: 'lm-interface-video-mapping',
      scope: 'mapping',
      status: 'unavailable',
      message:
        'The VentInterfacesLakeMucosa deck contains image-only interface demonstrations without textual labels, slide titles, or transcript. The available extraction cannot identify which embedded clip belongs to Drager, Servo i/u, or Breas without inventing a mapping.',
      sourceIds: ['source-2e113d0e60ce8364a1bf', 'source-f70f88a6b44b4db683dd'],
      activityIds: ['lm-12', 'lm-13', 'lm-14'],
      field: 'content',
    },
    {
      conflictId: 'lm-ventlab-star-control',
      scope: 'content',
      status: 'needs_review',
      message:
        'The VentLab source marks the correct control with a star in the visual interface and lists control/value labels, but the exact star-target control is not recoverable from text extraction. The objective and visible labels are retained; the target mapping remains for review.',
      sourceIds: ['source-2e113d0e60ce8364a1bf'],
      activityIds: ['lm-15'],
      field: 'content.targetState',
    },
    {
      conflictId: 'lm-suction-quest-wording',
      scope: 'content',
      status: 'needs_review',
      message:
        'The quest image uses the grammatically ambiguous question “ARE THERE ANY PATIENTS YOU PRE-OXYGENATE SUCTIONING?”; the wording is preserved exactly.',
      sourceIds: ['source-dd99f2a0d3e187cc8404'],
      activityIds: ['lm-16'],
      field: 'content.instructions',
    },
    {
      conflictId: 'lm-final-exam-payload-unavailable',
      scope: 'activity',
      status: 'unavailable',
      message:
        'The canonical roster requires a Lake Mucosa final-exam slot, but the corpus contains no final-exam questions or answer key. The descriptor remains addressable with an unavailable payload.',
      sourceIds: ['source-7effcb159366c230bc93'],
      activityIds: ['lm-final-exam'],
      field: 'content',
    },
  ],
  activities: [
    {
      activityId: 'lm-01',
      islandId: 'lake-mucosa',
      sequence: 1,
      type: 'video',
      title: 'Oxygenation & Mean Airway Pressure',
      description: 'Oxygenation and mean-airway-pressure teaching video.',
      estimatedMinutes: 10,
      peepPointsValue: 3,
      countsTowardProgress: true,
      contentStatus: 'ready',
      provenance: [
        sourceRef(
          '1. Lake Mucosa/Oxygenation & MAP_Video.mp4',
          { kind: 'whole_file' },
          'content',
          'Primary oxygenation and mean-airway-pressure teaching video; duration 277.017 seconds.'
        ),
        sourceRef(
          'GameOutline.docx',
          { kind: 'whole_file' },
          'content',
          'Lake Mucosa roster row: Oxygenation & Mean Airway Pressure; Video; 10 minutes; 3 PEEP Points.'
        ),
      ],
      content: {
        media: mediaRefForSource('1. Lake Mucosa/Oxygenation & MAP_Video.mp4'),
        durationSeconds: 277.017,
        completionCondition: { kind: 'ended' },
      },
    },
    {
      activityId: 'lm-02',
      islandId: 'lake-mucosa',
      sequence: 2,
      type: 'reading',
      title: 'Oxygenation & Mean Airway Pressure',
      description: 'Why I Never Made It to the Mitochondria: Memoirs of an Oxygen Molecule.',
      estimatedMinutes: 5,
      peepPointsValue: 2,
      countsTowardProgress: true,
      contentStatus: 'needs_review',
      conflictIds: ['lm-oxygenation-reading-glyphs'],
      provenance: [
        sourceRef(
          '1. Lake Mucosa/Oxygenation & MAP_Reading.pdf',
          { kind: 'whole_file' },
          'content',
          'Ten-page reading titled “Why I Never Made It to the Mitochondria: Memoirs of an Oxygen Molecule”; raw PDF extraction retained.'
        ),
        sourceRef(
          'GameOutline.docx',
          { kind: 'whole_file' },
          'content',
          'Lake Mucosa roster row: Oxygenation & Mean Airway Pressure; Reading/Graphic; 5 minutes; 2 PEEP Points.'
        ),
      ],
      content: {
        body: `Why I Never Made It to the Mitochondria: Memoirs of an Oxygen Molecule

Dear Fellow Healthcare Warriors, buckle up for a wild ride through the respiratory system4told from the perspective of yours truly, a humble O¢ molecule just trying to make it to the mitochondria. Spoiler alert: I don't always make it. In fact, there are FIVE major reasons why I might fail this mission, leaving your patient hypoxic and you scratching your head. Think of this as my travel diary, documenting all the obstacles between freedom (sweet, sweet ambient air) and my final destination (cellular respiration).

Stop #1: The Starting Line4Partial Pressure. Ambient air is 21% oxygen concentration. At Denver/mountain altitude the partial pressure of oxygen (PaO¢) drops; atmospheric pressure matters before inhalation.

Stop #2: The Ventilation Station4When Breathing. Hypoventilation means a lower rate or shallower tidal volumes, decreasing the area under the MAP curve. Less area means less mean airway pressure and less oxygenation. Hypoventilation also lets CO₂ build up, and CO₂ crowds/displaces oxygen in the alveoli. Smaller tidal volumes mean less tidal volume and fewer opportunities for oxygen to get in (decreased MAP). The source card reads “CO¢ Buildup” and “increased CO2”.

Stop #3: The Diffusion Disaster4Crossing the Alveolar Wall. After reaching an alveolus, oxygen must diffuse across the alveolar wall into a capillary. Fluid, stiffness, thickness, or blockage can make this like walking through a brick wall. Examples are Fluid Overload & Pulmonary Edema, Interstitial Lung Disease, and Bronchopulmonary Dysplasia (BPD).

Stop #4: The Cardiac Shunt Shuffle4Taking Wrong oxygen delivery. A right-to-left shunt sends deoxygenated right-sided blood into systemic circulation; a left-to-right shunt recirculates oxygenated left-sided blood to the right, floods the lungs, and can lead to pulmonary overcirculation and eventual heart failure.

Stop #5: The V/Q Mismatch Maze4When Timing Is Everything. Ventilation and perfusion may both exist but be uncoordinated. Oxygen molecules are passengers and blood flow is a taxi service, but taxis arrive at empty corners while passengers wait elsewhere.

Ventilation Problems (V): mucous plugging, obstructive processes such as asthma exacerbations and bronchospasm, and atelectasis. Perfusion Problems (Q): septic shock and hypotension, pulmonary embolism, and severe pulmonary hypertension.

My Journey Map4The Complete Oxygen Odyssey: 1. Partial Pressure of O¢; 2. Hypoventilation; 3. Diffusion Problems; 4. Cardiac Shunting; 5. V/Q Mismatch. Use this journey when troubleshooting hypoxia: identify whether the failure is altitude/FiO₂, ventilation, diffusion barrier, cardiac shunting, or V/Q mismatch, then target intervention.

Final Words from Your Friendly Neighborhood O¢ Molecule: trace where oxygen is getting stuck rather than only watching monitor numbers. The source closes with “HYPOXIA MAN (this is embarrassing, but here we go)” and says that adjusting ventilator settings, treating an underlying infection, diuresing fluid overload, and managing a cardiac defect all help oxygen reach mitochondria and produce ATP.`,
        confirmationQuestion: {
          prompt: 'According to the reading, which roadblock asks whether ventilation and perfusion happen in the same place at the same time?',
          choices: [
            { id: 'partial-pressure', text: 'Partial Pressure of O¢' },
            { id: 'diffusion', text: 'Diffusion Problems' },
            { id: 'vq-mismatch', text: 'V/Q Mismatch' },
            { id: 'cardiac-shunting', text: 'Cardiac Shunting' },
          ],
          answer: { correctChoiceId: 'vq-mismatch' },
          review: {
            explanation:
              'The reading states that V/Q mismatch means ventilation and perfusion are not matched in place or time.',
            sourceReferences: [
              sourceRef(
                '1. Lake Mucosa/Oxygenation & MAP_Reading.pdf',
                { kind: 'page', page: 6 },
                'answer',
                'Stop #5: The V/Q Mismatch Maze; ventilation and perfusion are not matched in place/time.'
              ),
            ],
          },
        },
      },
    },
    {
      activityId: 'lm-03',
      islandId: 'lake-mucosa',
      sequence: 3,
      type: 'quiz',
      title: 'Oxygenation & Mean Airway Pressure',
      description: 'Oxygenation Quiz (6 pt).',
      estimatedMinutes: 10,
      peepPointsValue: 3,
      countsTowardProgress: true,
      contentStatus: 'needs_review',
      conflictIds: ['lm-oxygenation-multi-answer-shape'],
      provenance: [
        sourceRef(
          '1. Lake Mucosa/Oxygenation & MAP_Quiz.docx',
          { kind: 'whole_file' },
          'content',
          'Answer-marked six-question Oxygenation Quiz (6 pt).'
        ),
        sourceRef(
          'GameOutline.docx',
          { kind: 'whole_file' },
          'content',
          'Lake Mucosa roster row: Oxygenation & Mean Airway Pressure; Quiz; 10 minutes; 3 PEEP Points.'
        ),
      ],
      content: {
        questions: [
          {
            id: 'q1',
            prompt: 'Which ventilator settings affect oxygenation? Select all that apply.',
            interaction: 'mcq',
            choices: [
              { id: 'rr', text: 'RR' },
              { id: 'vt', text: 'Vt' },
              { id: 'pip', text: 'PIP' },
              { id: 'fio2', text: 'FiO₂' },
              { id: 'itime', text: 'I‑time' },
              { id: 'ps', text: 'Pressure Support (PS)' },
              { id: 'peep', text: 'PEEP' },
              { id: 'all', text: 'All of the above' },
            ],
            answer: { interaction: 'mcq', correctChoiceId: 'all' },
            review: {
              explanation:
                'Any setting that changes mean airway pressure (MAP) can affect oxygenation. The source uses a pressure‑versus‑time curve and area under the curve (AUC); Pressure Support contributes to MAP and therefore oxygenation.',
              sourceReferences: [
                sourceRef(
                  '1. Lake Mucosa/Oxygenation & MAP_Quiz.docx',
                  { kind: 'whole_file' },
                  'answer',
                  'Question 1 bold answer: All of the above; explanation on MAP and AUC.'
                ),
              ],
            },
          },
          {
            id: 'q2',
            prompt: 'Which TWO ventilator settings have the biggest impact on oxygenation? (select two)',
            interaction: 'mcq',
            choices: [
              { id: 'rr', text: 'RR' },
              { id: 'vt', text: 'Vt' },
              { id: 'pip', text: 'PIP' },
              { id: 'fio2', text: 'FiO₂' },
              { id: 'itime', text: 'I‑time' },
              { id: 'ps', text: 'Pressure Support (PS)' },
              { id: 'peep', text: 'PEEP' },
            ],
            answer: { interaction: 'mcq', correctChoiceId: 'fio2' },
            review: {
              explanation:
                'The source marks FiO₂ and PEEP. FiO₂ directly increases oxygen delivered to the alveoli, while PEEP most greatly impacts mean airway pressure and helps keep alveoli open.',
              sourceReferences: [
                sourceRef(
                  '1. Lake Mucosa/Oxygenation & MAP_Quiz.docx',
                  { kind: 'whole_file' },
                  'answer',
                  'Question 2 bold answers: FiO₂ and PEEP.'
                ),
              ],
            },
          },
          {
            id: 'q3',
            prompt: 'What is the main cause of hypoxia in an infant with bronchiolitis?',
            interaction: 'mcq',
            choices: [
              { id: 'reduced-inspired-oxygen', text: 'Reduced inspired oxygen' },
              { id: 'hypoventilation', text: 'Hypoventilation' },
              {
                id: 'vq-v',
                text: 'Ventilation/perfusion (V/Q) mismatch – primarily a V problem',
              },
              {
                id: 'vq-q',
                text: 'Ventilation/perfusion (V/Q) mismatch – primarily a Q problem',
              },
              { id: 'diffusion', text: 'Diffusion limitations' },
              { id: 'shunting', text: 'Cardiac shunting' },
            ],
            answer: { interaction: 'mcq', correctChoiceId: 'vq-v' },
            review: {
              explanation:
                'The source explains that bronchiolitis mucous plugging and airway inflammation impair ventilation while perfusion remains relatively preserved, creating a V/Q mismatch primarily due to a V problem.',
              sourceReferences: [
                sourceRef(
                  '1. Lake Mucosa/Oxygenation & MAP_Quiz.docx',
                  { kind: 'whole_file' },
                  'answer',
                  'Question 3 bold answer and explanation.'
                ),
              ],
            },
          },
          {
            id: 'q4',
            prompt: 'What is the main cause of hypoxia in a 9-month old, ex-25 week infant with chronic lung disease who is experiencing a severe pulmonary hypertensive crisis?',
            interaction: 'mcq',
            choices: [
              { id: 'reduced-inspired-oxygen', text: 'Reduced inspired oxygen' },
              { id: 'hypoventilation', text: 'Hypoventilation' },
              {
                id: 'vq-v',
                text: 'Ventilation/perfusion (V/Q) mismatch – primarily a V problem',
              },
              {
                id: 'vq-q',
                text: 'Ventilation/perfusion (V/Q) mismatch – primarily a Q problem',
              },
              { id: 'diffusion', text: 'Diffusion limitations' },
              { id: 'shunting', text: 'Cardiac shunting' },
            ],
            answer: { interaction: 'mcq', correctChoiceId: 'vq-q' },
            review: {
              explanation:
                'The source explains that pulmonary hypertension redirects blood flow away from well-ventilated alveoli because of high pulmonary vascular resistance, creating a perfusion problem.',
              sourceReferences: [
                sourceRef(
                  '1. Lake Mucosa/Oxygenation & MAP_Quiz.docx',
                  { kind: 'whole_file' },
                  'answer',
                  'Question 4 bold answer and explanation.'
                ),
              ],
            },
          },
          {
            id: 'q5',
            prompt: 'What is the MOST LIKELY cause of hypoxia in an obese adolescent male post‑tonsillectomy/adenoidectomy (TNA) for severe OSA, who is saturating 85% on room air? You can hear him snoring down the hall…',
            interaction: 'mcq',
            choices: [
              { id: 'reduced-inspired-oxygen', text: 'Reduced inspired oxygen' },
              { id: 'hypoventilation', text: 'Hypoventilation' },
              {
                id: 'vq-v',
                text: 'Ventilation/perfusion (V/Q) mismatch – primarily a V problem',
              },
              {
                id: 'vq-q',
                text: 'Ventilation/perfusion (V/Q) mismatch – primarily a Q problem',
              },
              { id: 'diffusion', text: 'Diffusion limitation' },
              { id: 'shunting', text: 'Cardiac shunting' },
            ],
            answer: { interaction: 'mcq', correctChoiceId: 'hypoventilation' },
            review: {
              explanation:
                'The source marks hypoventilation as most likely because upper-airway obstruction from residual anesthesia or severe OSA leads to inadequate ventilation and CO₂ retention. It also says post-obstructive pulmonary edema is important to consider if repositioning and fixing hypoventilation does not work.',
              sourceReferences: [
                sourceRef(
                  '1. Lake Mucosa/Oxygenation & MAP_Quiz.docx',
                  { kind: 'whole_file' },
                  'answer',
                  'Question 5 bold answer and explanation, including the post-obstructive pulmonary-edema caveat.'
                ),
              ],
            },
          },
          {
            id: 'q6',
            prompt: 'A chest X‑ray of an intubated pediatric patient with bronchiolitis is shown below. The child has copious secretions and is saturating 82%, requiring frequent FiO₂ increases. Which ventilator setting change would be MOST effective for improving this child’s oxygen saturation?',
            promptMedia: {
              ...mediaRefForSource(
                '1. Lake Mucosa/Oxygenation & MAP_Quiz.docx',
                'word/media/image1.png'
              ),
              altText: 'Chest X-ray of an intubated pediatric patient with bronchiolitis.',
            },
            interaction: 'mcq',
            choices: [
              { id: 'rr', text: 'RR' },
              { id: 'vt', text: 'Vt' },
              { id: 'fio2', text: 'FiO₂' },
              { id: 'itime', text: 'I‑time' },
              { id: 'ps', text: 'Pressure Support (PS)' },
              { id: 'peep', text: 'PEEP' },
            ],
            answer: { interaction: 'mcq', correctChoiceId: 'peep' },
            review: {
              explanation:
                'The source explains that atelectasis causes hypoxia through V/Q mismatch from under-ventilated lung regions and marks PEEP as the most effective change to recruit collapsed alveoli.',
              sourceReferences: [
                sourceRef(
                  '1. Lake Mucosa/Oxygenation & MAP_Quiz.docx',
                  { kind: 'whole_file' },
                  'answer',
                  'Question 6 bold answer: PEEP; explanation on atelectasis and recruitment.'
                ),
                sourceRef(
                  '1. Lake Mucosa/Oxygenation & MAP_Quiz.docx',
                  { kind: 'whole_file' },
                  'media',
                  'The source states that an embedded chest X-ray is shown.'
                ),
              ],
            },
          },
        ],
      },
    },
    {
      activityId: 'lm-04',
      islandId: 'lake-mucosa',
      sequence: 4,
      type: 'video',
      title: 'Ventilation & Minute Ventilation',
      description: 'Ventilation and minute-ventilation teaching video.',
      estimatedMinutes: 10,
      peepPointsValue: 3,
      countsTowardProgress: true,
      contentStatus: 'ready',
      provenance: [
        sourceRef(
          '1. Lake Mucosa/Ventilation & MV_Video.mp4',
          { kind: 'whole_file' },
          'content',
          'Primary ventilation and minute-ventilation teaching video; duration 431.701 seconds.'
        ),
        sourceRef(
          'GameOutline.docx',
          { kind: 'whole_file' },
          'content',
          'Lake Mucosa roster row: Ventilation (& Minute Ventilation); Video; 10 minutes; 3 PEEP Points.'
        ),
      ],
      content: {
        media: mediaRefForSource('1. Lake Mucosa/Ventilation & MV_Video.mp4'),
        durationSeconds: 431.701,
        completionCondition: { kind: 'ended' },
      },
    },
    {
      activityId: 'lm-05',
      islandId: 'lake-mucosa',
      sequence: 5,
      type: 'reading',
      title: 'Ventilation & Minute Ventilation',
      description: 'A Fra�ework for VENTILATION.',
      estimatedMinutes: 5,
      peepPointsValue: 2,
      countsTowardProgress: true,
      contentStatus: 'needs_review',
      conflictIds: ['lm-ventilation-reading-glyphs'],
      provenance: [
        sourceRef(
          '1. Lake Mucosa/Ventilation & MV_Reading.pdf',
          { kind: 'whole_file' },
          'content',
          'One-page ventilation reading with MV formula, pressure-control compliance, and two clinical scenarios; raw PDF extraction retained.'
        ),
        sourceRef(
          'GameOutline.docx',
          { kind: 'whole_file' },
          'content',
          'Lake Mucosa roster row: Ventilation (& Minute Ventilation); Reading/Graphic; 5 minutes; 2 PEEP Points.'
        ),
      ],
      content: {
        body: `A Fra�ework for VENTILATION

VENTILATION: How CO₂ I� Eli�i�ated. Minute Ventilation (MV) = Tidal Volume (Vt) × Respiratory Rate (RR). MV is the primary determinant of PaCO₂ removal or retention. If MV increases → PaCO₂ decreases. If MV decreases → PaCO₂ increases. Respiratory acidosis indicates inadequate ventilation.

Pre��ure Co�trol Still Deliver� Tidal Volu�e. Compliance = ΔV / ΔP. In Pressure Control (PC), peak inspiratory pressure (PIP) is set. Delivered tidal volume depends on lung compliance. Increasing pressure (ΔP) increases ΔV if compliance is unchanged. Higher Vt → Higher MV → Improved CO₂ clearance.

Clinical Case w/ SBAR: Situation: Intubated bronchiolitic with superimposed bacterial pneumonia. Background: Ventilator mode: SIMV / PC. CBG: 7.27 / 89 / 75 / 30 / +3. Assessment: Respiratory acidosis with metabolic compensation indicates inadequate ventilation. Recommendations: increase MV → increase either Vt or RR.

Sce�ario 1: Hig� Peak Pre��ure�. Settings: PIP 32 giving you Vt 6 mL/kg | PEEP 7 | RR 25. Physiologic tidal volume is achieved with high PIP (poor compliance); RR is low–normal; further pressure increases risk barotrauma. Preferred adjustment: increase RR to increase MV.

Sce�ario 2: Hig� Re�piratory Rate. Settings: PIP 17 giving you Vt 5.5 mL/kg | PEEP 7 | RR 35. Peak pressures are low; tidal volumes are slightly low–normal; RR is already elevated; further RR increase risks air trapping and auto-PEEP. Preferred adjustment: increase PIP to raise Vt and MV.

TAKE AWAY PEARLS: Respiratory acidosis or hypercarbia = inadequate VENTILATION = go back to your Minute Ventilation formula. When in doubt, if Co2 is too high… MV = Vt × RR. Select the adjustment that improves ventilation while minimizing ventilator-associated harm. The same blood gas can prompt different ventilator changes (Vt vs. RR) in different ventilator contexts.`,
        confirmationQuestion: {
          prompt: 'According to the reading, which formula denotes minute ventilation?',
          choices: [
            { id: 'mv-vt-rr', text: 'MV = Vt × RR' },
            { id: 'mv-pip-rr', text: 'MV = PIP × RR' },
            { id: 'mv-peep-rr', text: 'MV = PEEP × RR' },
          ],
          answer: { correctChoiceId: 'mv-vt-rr' },
          review: {
            explanation:
              'The reading states: Minute Ventilation (MV) = Tidal Volume (Vt) × Respiratory Rate (RR).',
            sourceReferences: [
              sourceRef(
                '1. Lake Mucosa/Ventilation & MV_Reading.pdf',
                { kind: 'whole_file' },
                'answer',
                'The opening formula explicitly defines MV = Vt × RR.'
              ),
            ],
          },
        },
      },
    },
    {
      activityId: 'lm-06',
      islandId: 'lake-mucosa',
      sequence: 6,
      type: 'quiz',
      title: 'Ventilation & Minute Ventilation',
      description: 'Ventilation & MV quiz.',
      estimatedMinutes: 10,
      peepPointsValue: 3,
      countsTowardProgress: true,
      contentStatus: 'ready',
      provenance: [
        sourceRef(
          '1. Lake Mucosa/Ventilation & MV_Quiz.docx',
          { kind: 'whole_file' },
          'content',
          'Four-question answer-marked ventilation and minute-ventilation quiz.'
        ),
        sourceRef(
          'GameOutline.docx',
          { kind: 'whole_file' },
          'content',
          'Lake Mucosa roster row: Ventilation (& Minute Ventilation); Quiz; 10 minutes; 3 PEEP Points.'
        ),
      ],
      content: {
        questions: [
          {
            id: 'q1',
            prompt: 'Hypercarbia (elevated PCO2) most commonly indicates problems with ____',
            interaction: 'mcq',
            choices: [
              { id: 'oxygenation', text: 'Oxygenation' },
              { id: 'ventilation', text: 'Ventilation' },
            ],
            answer: { interaction: 'mcq', correctChoiceId: 'ventilation' },
            review: {
              explanation: 'Refer back to the oxygenation and ventilation videos in Lake Mucosa for questions.',
              sourceReferences: [
                sourceRef(
                  '1. Lake Mucosa/Ventilation & MV_Quiz.docx',
                  { kind: 'whole_file' },
                  'answer',
                  'Question 1 bold answer: Ventilation.'
                ),
              ],
            },
          },
          {
            id: 'q2',
            prompt: 'Ventilation is best denoted by which of the following?',
            interaction: 'mcq',
            choices: [
              { id: 'mean-airway-pressure', text: 'Mean Airway Pressure' },
              { id: 'mv-rr-vt', text: 'MV = RR x Vt' },
              { id: 'mv-rr-pip', text: 'MV = RR x PIP' },
            ],
            answer: { interaction: 'mcq', correctChoiceId: 'mv-rr-vt' },
            review: {
              explanation:
                'Whenever there is a hypercarbic patient, use the minute-ventilation equation and consider whether rate or tidal volume is insufficient. The source notes that PRVC guarantees minute ventilation, while PIP alone does not.',
              sourceReferences: [
                sourceRef(
                  '1. Lake Mucosa/Ventilation & MV_Quiz.docx',
                  { kind: 'whole_file' },
                  'answer',
                  'Question 2 bold answer: MV = RR x Vt; full source explanation retained in review.'
                ),
              ],
            },
          },
          {
            id: 'q3',
            prompt: 'When a ventilator is alarming for minute ventilation, which patient or ventilator parameter is most likely to indicate the problem?',
            interaction: 'mcq',
            choices: [
              { id: 'pip', text: 'PIP' },
              { id: 'spo2', text: 'SpO2' },
              {
                id: 'vti-vte-difference',
                text: 'Difference between inhaled tidal volume (VTi) and exhaled tidal volume (VTe)',
              },
            ],
            answer: { interaction: 'mcq', correctChoiceId: 'vti-vte-difference' },
            review: {
              explanation:
                'The source says to check that the problem is ventilator versus patient, including condensation, airway position, secretions, tube position, and end-tidal CO2; a difference between inhaled and exhaled tidal volume most likely indicates the issue.',
              sourceReferences: [
                sourceRef(
                  '1. Lake Mucosa/Ventilation & MV_Quiz.docx',
                  { kind: 'whole_file' },
                  'answer',
                  'Question 3 bold answer and explanation.'
                ),
              ],
            },
          },
          {
            id: 'q4',
            prompt: 'When a patient needs additional support with ventilation, which answer choice will NOT typically assist them in blowing off CO2?',
            interaction: 'mcq',
            choices: [
              { id: 'increasing-rr', text: 'Increasing RR' },
              {
                id: 'decreasing-itime',
                text: 'Decreasing the iTime, allowing more time for exhalation (“more eTime”)',
              },
              { id: 'increasing-peep', text: 'Increasing the PEEP to increase mean airway pressure' },
              {
                id: 'suctioning',
                text: 'Suctioning the airway. Removing secretions blocking the upper airway may assist delivering the set tidal volumes to the lungs',
              },
              {
                id: 'increasing-pip',
                text: 'Increasing the PIP in a PC mode of ventilation to allow for larger tidal volumes in a lung with good compliance',
              },
            ],
            answer: { interaction: 'mcq', correctChoiceId: 'increasing-peep' },
            review: {
              explanation:
                'The source marks increasing PEEP to increase mean airway pressure as the choice that will not typically assist in blowing off CO2. It explains that increasing RR, allowing more eTime, suctioning, and increasing PIP can affect Vt or RR and improve ventilation, while PEEP is a maneuver to increase oxygenation more than ventilation.',
              sourceReferences: [
                sourceRef(
                  '1. Lake Mucosa/Ventilation & MV_Quiz.docx',
                  { kind: 'whole_file' },
                  'answer',
                  'Question 4 bold answer: Increasing the PEEP to increase mean airway pressure.'
                ),
              ],
            },
          },
        ],
      },
    },
    {
      activityId: 'lm-07',
      islandId: 'lake-mucosa',
      sequence: 7,
      type: 'reading',
      title: 'Airway Anatomy',
      description: 'Airway Anatomy slide-based reading.',
      estimatedMinutes: 5,
      peepPointsValue: 1,
      countsTowardProgress: true,
      contentStatus: 'ready',
      provenance: [
        sourceRef(
          '1. Lake Mucosa/Airway Anatomy.pptx',
          { kind: 'slide', slide: 2 },
          'content',
          'Normal airway module and upper/lower respiratory tract distinction.'
        ),
        sourceRef(
          '1. Lake Mucosa/Airway Anatomy.pptx',
          { kind: 'slide', slide: 6 },
          'content',
          'Subglottic anatomy note: adult airway cylindrical; infant airway reverse pyramid and sensitive to swelling.'
        ),
        sourceRef(
          'GameOutline.docx',
          { kind: 'whole_file' },
          'content',
          'Lake Mucosa roster row: Airway Anatomy; Reading/Graphic; 5 minutes; 1 PEEP Point.'
        ),
      ],
      content: {
        body: `Airway Anatomy

Module: Airway Anatomy and Physiology (Normal and Abnormal).

Normal Airway: This is a picture of a normal airway. This is what the airway should look like when we do a direct laryngoscopy for intubation.

Child vs. Adult Larynx. The pediatric larynx: Omega (or upside down u) shaped epiglottis; more likely to collapse. The adult larynx: thin and horizontal epiglottis; less floppy.

Normal Infant Airway: Small mouth; ± larger tongue; angled / stubby epiglottis; location higher in the neck; angled vocal cords; narrow subglottic region.

The top of the larynx is located higher in the neck in preterm infants.

Subglottic Anatomy: The adult airway is more cylindrical whereas the infant airway is a reverse pyramid shape. This means that the infant airway narrows beneath the level of the glottis and can make it difficult to pass an endo tracheal tube. The narrowing also means that the airway is more sensitive to swelling.

Source credits in the deck include Coté Chapter 14, p 302, p 298, and p 301 in Coté, Lerman, Anderson: A Practice of Anesthesia for Infants and Children 2019, and http://www.learnpicu.com/respiratory/upper-airway-abnormalities.`,
        confirmationQuestion: {
          prompt: 'According to the source, what shape is the infant airway below the glottis?',
          choices: [
            { id: 'reverse-pyramid', text: 'A reverse pyramid shape' },
            { id: 'cylinder', text: 'A cylindrical shape' },
          ],
          answer: { correctChoiceId: 'reverse-pyramid' },
          review: {
            explanation:
              'The speaker note says the adult airway is more cylindrical whereas the infant airway is a reverse pyramid shape, narrowing beneath the glottis.',
            sourceReferences: [
              sourceRef(
                '1. Lake Mucosa/Airway Anatomy.pptx',
                { kind: 'slide', slide: 6 },
                'answer',
                'Speaker note explicitly states that the infant airway is a reverse pyramid shape.'
              ),
            ],
          },
        },
      },
    },
    {
      activityId: 'lm-08',
      islandId: 'lake-mucosa',
      sequence: 8,
      type: 'reading',
      title: 'Pulmonary Anatomy',
      description: 'Pulmonary Anatomy slide-based reading.',
      estimatedMinutes: 5,
      peepPointsValue: 1,
      countsTowardProgress: true,
      contentStatus: 'needs_review',
      conflictIds: ['lm-pulmonary-lobe-wording'],
      provenance: [
        sourceRef(
          '1. Lake Mucosa/Pulmonary Anatomy.pptx',
          { kind: 'slide', slide: 2 },
          'content',
          'Respiratory System Overview; parenchyma and external process labels.'
        ),
        sourceRef(
          '1. Lake Mucosa/Pulmonary Anatomy.pptx',
          { kind: 'slide', slide: 3 },
          'content',
          'Speaker note on tracheal division, bronchi, bronchioles, and alveolus.'
        ),
        sourceRef(
          '1. Lake Mucosa/Pulmonary Anatomy.pptx',
          { kind: 'slide', slide: 4 },
          'content',
          'Speaker note on pulmonary arteries carrying de-oxygenated blood and following the bronchial tree to the alveoli.'
        ),
        sourceRef(
          '1. Lake Mucosa/Pulmonary Anatomy.pptx',
          { kind: 'slide', slide: 6 },
          'content',
          'Speaker note: Alveoli is where gas exchange happens; CO2 out, O2 in.'
        ),
        sourceRef(
          'GameOutline.docx',
          { kind: 'whole_file' },
          'content',
          'Lake Mucosa roster row: Pulmonary Anatomy; Reading/Graphic; 5 minutes; 1 PEEP Point.'
        ),
      ],
      content: {
        body: `Pulmonary Anatomy

Module: Respiratory System Overview. The deck labels parenchyma and “External Process- Intra Pleural & Thorax”.

The trachea divides into the right and left primary bronchi, theses then divide further separating into the three lobes on the right (superior, middle, and lower) and two lobes on the right (Upper and lower). The bronchi continue to divide until they become bronchioles which continue to branch and divide until you reach the alveolus.

The Pulmonary Arteries are the only arteries in the body that carry DE-oxygenated blood. The follow the bronchiole tree very closely and divide with the bronchi and bronchioles until reaching the alveoli.

This image showes the relationship between blood flow and bronchial tree and how closely they form with each other. The bronchioles still consist of smooth muscle.

Alveoli is where gas exchange happens! CO2 out, O2 in!

The source note's lobe wording is preserved exactly, including the repeated “right” reference.`,
        confirmationQuestion: {
          prompt: 'According to the source, where does gas exchange happen?',
          choices: [
            { id: 'alveoli', text: 'The alveoli' },
            { id: 'trachea', text: 'The trachea' },
            { id: 'bronchioles', text: 'The bronchioles' },
          ],
          answer: { correctChoiceId: 'alveoli' },
          review: {
            explanation: 'The slide note states: “Alveoli is where gas exchange happens! CO2 out, O2 in!”',
            sourceReferences: [
              sourceRef(
                '1. Lake Mucosa/Pulmonary Anatomy.pptx',
                { kind: 'slide', slide: 6 },
                'answer',
                'Speaker note explicitly identifies alveoli as the site of gas exchange.'
              ),
            ],
          },
        },
      },
    },
    {
      activityId: 'lm-09',
      islandId: 'lake-mucosa',
      sequence: 9,
      type: 'quiz',
      title: 'Airway Sounds',
      description: 'Lung Sounds Quiz.',
      estimatedMinutes: 10,
      peepPointsValue: 3,
      countsTowardProgress: true,
      contentStatus: 'ready',
      provenance: [
        sourceRef(
          '1. Lake Mucosa/Lung Sounds Quiz.docx',
          { kind: 'whole_file' },
          'content',
          'Four-question answer-marked lung-sound quiz with links to two audio samples.'
        ),
        sourceRef(
          '1. Lake Mucosa/Lung Sounds Quiz AUDIO 1.mp3',
          { kind: 'whole_file' },
          'media',
          'Audio sample linked by source Question 1.'
        ),
        sourceRef(
          '1. Lake Mucosa/Lung Sounds Quiz AUDIO 2.mp3',
          { kind: 'whole_file' },
          'media',
          'Audio sample linked by source Question 3.'
        ),
        sourceRef(
          'GameOutline.docx',
          { kind: 'whole_file' },
          'content',
          'Lake Mucosa roster row: Airway Sounds; Quiz; 10 minutes; 3 PEEP Points.'
        ),
      ],
      content: {
        questions: [
          {
            id: 'q1',
            prompt:
              'This high-pitched, harsh airway sound usually signals partial blockage of the upper airway. It may be described as sharp or squeaky, and is often more pronounced when the child is crying or lying down. (Listen to an example HERE.)',
            promptMedia: {
              ...mediaRefForSource('1. Lake Mucosa/Lung Sounds Quiz AUDIO 1.mp3'),
              altText: 'Lung Sounds Quiz AUDIO 1 audio sample.',
            },
            interaction: 'mcq',
            choices: [
              { id: 'stertor', text: 'Stertor' },
              { id: 'expiratory-wheeze', text: 'Expiratory wheeze' },
              { id: 'grunting', text: 'Grunting' },
              { id: 'stridor', text: 'Stridor' },
            ],
            answer: { interaction: 'mcq', correctChoiceId: 'stridor' },
            review: {
              explanation:
                'Stridor occurs due to inflammation or obstruction of the upper airway and produces a sharp, musical sound. The source says it can be biphasic but is usually most noticeable on inspiration, with causes including viral inflammation, foreign body aspiration, allergic swelling, and congenital airway abnormalities.',
              sourceReferences: [
                sourceRef(
                  '1. Lake Mucosa/Lung Sounds Quiz.docx',
                  { kind: 'whole_file' },
                  'answer',
                  'Question 1 bold answer: Stridor; linked audio is Lung Sounds Quiz AUDIO 1.'
                ),
              ],
            },
          },
          {
            id: 'q2',
            prompt: 'Which of the following is NOT true regarding wheezing?',
            interaction: 'mcq',
            choices: [
              { id: 'asthma-bronchiolitis', text: 'It is commonly heard in children with asthma and bronchiolitis' },
              {
                id: 'inspiration',
                text: 'It is more pronounced on inspiration when airways are naturally more narrowed',
              },
              { id: 'continuous-whistling', text: 'It is a continuous, high-pitched whistling sound' },
              {
                id: 'diffuse-localized',
                text: 'Diffuse wheezing often indicates causes like asthma, allergic reaction, or viral infection while localized wheezing may indicate foreign body aspiration',
              },
            ],
            answer: { interaction: 'mcq', correctChoiceId: 'inspiration' },
            review: {
              explanation:
                'The source marks the inspiration statement as not true. Wheezing is more pronounced on expiration, not inspiration, because that is when airways are naturally more narrowed.',
              sourceReferences: [
                sourceRef(
                  '1. Lake Mucosa/Lung Sounds Quiz.docx',
                  { kind: 'whole_file' },
                  'answer',
                  'Question 2 bold answer and explanation.'
                ),
              ],
            },
          },
          {
            id: 'q3',
            prompt:
              'Sometimes described as sounding like Velcro, intermittent pops, or like rubbing your hair between your fingers next to your ear, this discontinuous lung sound is often indicative of fluid accumulated in the alveoli and small airways. (Listen to an example HERE.)',
            promptMedia: {
              ...mediaRefForSource('1. Lake Mucosa/Lung Sounds Quiz AUDIO 2.mp3'),
              altText: 'Lung Sounds Quiz AUDIO 2 audio sample.',
            },
            interaction: 'mcq',
            choices: [
              { id: 'crackles', text: 'Crackles' },
              { id: 'bronchovesicular', text: 'Bronchovesicular' },
              { id: 'rhonchi', text: 'Rhonchi' },
              { id: 'pleural-rub', text: 'Pleural Rub' },
            ],
            answer: { interaction: 'mcq', correctChoiceId: 'crackles' },
            review: {
              explanation:
                'The source says crackles result from collapsed alveoli or small airways “popping” open, primarily during inspiration, and may be categorized as “fine” or “course”.',
              sourceReferences: [
                sourceRef(
                  '1. Lake Mucosa/Lung Sounds Quiz.docx',
                  { kind: 'whole_file' },
                  'answer',
                  'Question 3 bold answer: Crackles; linked audio is Lung Sounds Quiz AUDIO 2.'
                ),
              ],
            },
          },
          {
            id: 'q4',
            prompt: 'Which of the following describes rhonchi most accurately?',
            interaction: 'mcq',
            choices: [
              {
                id: 'bronchospasm',
                text: 'Discontinuous, low-pitched sounds resulting from intermittent bronchospasm',
              },
              {
                id: 'wet-inspiration',
                text: 'Almost exclusively heard on inspiration, these low “wet” sounds are the result of increased mucus burden in children with difficulty clearing secretions',
              },
              {
                id: 'large-airways',
                text: 'Deep rumbling or snoring-like sounds coming from the larger airways that often improve after suctioning',
              },
              {
                id: 'pleural-rub',
                text: 'Dry, harsh, grating sounds that are typically localized to a specific area of the chest and heard during both inspiration and expiration.',
              },
            ],
            answer: { interaction: 'mcq', correctChoiceId: 'large-airways' },
            review: {
              explanation:
                'Rhonchi result from air moving through large airways partially blocked by mucus or secretions. The source distinguishes them from bronchospasm and pleural rub and says they often improve after suctioning.',
              sourceReferences: [
                sourceRef(
                  '1. Lake Mucosa/Lung Sounds Quiz.docx',
                  { kind: 'whole_file' },
                  'answer',
                  'Question 4 bold answer and explanation.'
                ),
              ],
            },
          },
        ],
      },
    },
    {
      activityId: 'lm-10',
      islandId: 'lake-mucosa',
      sequence: 10,
      type: 'quiz',
      title: 'Non-invasive Ventilation Monitoring (TCOM vs EtCO2)',
      description: 'TCOM vs. ETCO2 Drag & Drop Game.',
      estimatedMinutes: 10,
      peepPointsValue: 3,
      countsTowardProgress: true,
      contentStatus: 'needs_review',
      conflictIds: ['lm-monitoring-dragdrop-mapping'],
      provenance: [
        sourceRef(
          '1. Lake Mucosa/Non-Invasive Monitoring TCOM vs. ETCO2 Quiz.docx',
          { kind: 'whole_file' },
          'content',
          'TCOM vs. ETCO2 Drag & Drop Game with four category headings and three high-yield scenarios.'
        ),
        sourceRef(
          'GameOutline.docx',
          { kind: 'whole_file' },
          'content',
          'Lake Mucosa roster row: Non-invasive ventilation monitoring (TCOM vs. EtCO2); Quiz; 10 minutes; 3 PEEP Points.'
        ),
      ],
      content: {
        questions: [
          {
            id: 'q1',
            prompt: 'Place each statement in the source category it belongs to: ETCO2, TCOM, Suspect Equipment Issue, or Reflects Patient Pathophysiology.',
            interaction: 'drag_drop',
            choices: [
              { id: 'etco2-end-exhalation', text: 'Measures CO2 at the end of exhalation' },
              { id: 'etco2-realtime', text: 'Reflects ventilation in real time' },
              { id: 'etco2-waveform', text: 'Displays a waveform' },
              { id: 'etco2-airway-placement', text: 'Used to confirm airway placement' },
              { id: 'etco2-airway-issues', text: 'Sensitive to airway issues (dislodgement, obstruction)' },
              { id: 'etco2-rapid', text: 'Can change rapidly' },
              { id: 'tcom-diffusion', text: 'Measures CO2 via skin diffusion' },
              { id: 'tcom-trend', text: 'Reflects trend over time' },
              { id: 'tcom-warmup', text: 'Requires warm-up/calibration' },
              { id: 'tcom-perfusion', text: 'Affected by perfusion' },
              { id: 'tcom-slow', text: 'Slower to respond to changes' },
              { id: 'tcom-continuous', text: 'Useful for continuous trending' },
              { id: 'equipment-flat', text: 'Flat ETCO2 waveform but patient stable' },
              { id: 'equipment-movement', text: 'Sudden loss of ETCO2 after movement' },
              { id: 'equipment-picture', text: 'TCOM not correlating with clinical picture' },
              { id: 'equipment-adhesion', text: 'Poor probe adhesion' },
              { id: 'equipment-monitors', text: 'Inconsistent readings between monitors' },
              { id: 'patient-rising-etco2', text: 'Rising ETCO2 with hypoventilation' },
              { id: 'patient-tcom-increase', text: 'Gradual increase in TCOM over time' },
              { id: 'patient-improved', text: 'Decreasing CO2 with improved ventilation' },
              { id: 'patient-correlated', text: 'Changes that correlate with clinical status' },
            ],
            targets: [
              { id: 'etco2', text: 'ETCO2' },
              { id: 'tcom', text: 'TCOM' },
              { id: 'equipment', text: 'Suspect Equipment Issue' },
              { id: 'pathophysiology', text: 'Reflects Patient Pathophysiology' },
            ],
            answer: {
              interaction: 'drag_drop',
              placements: {
                'etco2-end-exhalation': 'etco2',
                'etco2-realtime': 'etco2',
                'etco2-waveform': 'etco2',
                'etco2-airway-placement': 'etco2',
                'etco2-airway-issues': 'etco2',
                'etco2-rapid': 'etco2',
                'tcom-diffusion': 'tcom',
                'tcom-trend': 'tcom',
                'tcom-warmup': 'tcom',
                'tcom-perfusion': 'tcom',
                'tcom-slow': 'tcom',
                'tcom-continuous': 'tcom',
                'equipment-flat': 'equipment',
                'equipment-movement': 'equipment',
                'equipment-picture': 'equipment',
                'equipment-adhesion': 'equipment',
                'equipment-monitors': 'equipment',
                'patient-rising-etco2': 'pathophysiology',
                'patient-tcom-increase': 'pathophysiology',
                'patient-improved': 'pathophysiology',
                'patient-correlated': 'pathophysiology',
              },
            },
            review: {
              explanation:
                'The source objective is to differentiate what ETCO2 and TCOM measure, when to trust each, and when to suspect an equipment versus patient issue. Placements use the document’s ETCO2, TCOM, Suspect Equipment Issue, and Reflects Patient Pathophysiology headings.',
              sourceReferences: [
                sourceRef(
                  '1. Lake Mucosa/Non-Invasive Monitoring TCOM vs. ETCO2 Quiz.docx',
                  { kind: 'whole_file' },
                  'review',
                  'Objective and category headings for the drag/drop mappings.'
                ),
              ],
            },
          },
          {
            id: 'q2',
            prompt: 'Match each high-yield scenario to the source’s likely problem.',
            interaction: 'matching',
            choices: [
              { id: 's1', text: 'ETCO2 suddenly drops to zero during transport' },
              { id: 's2', text: 'TCOM slowly rising over several hours' },
              { id: 's3', text: 'Normal ETCO2 but worsening SpO2' },
              { id: 'r1', text: 'airway dislodgement OR equipment issue' },
              { id: 'r2', text: 'worsening ventilation' },
              { id: 'r3', text: 'oxygenation NOT ventilation' },
            ],
            answer: {
              interaction: 'matching',
              pairs: [
                { leftChoiceId: 's1', rightChoiceId: 'r1' },
                { leftChoiceId: 's2', rightChoiceId: 'r2' },
                { leftChoiceId: 's3', rightChoiceId: 'r3' },
              ],
            },
            review: {
              explanation: 'The source provides these three scenario-to-likely-problem mappings verbatim.',
              sourceReferences: [
                sourceRef(
                  '1. Lake Mucosa/Non-Invasive Monitoring TCOM vs. ETCO2 Quiz.docx',
                  { kind: 'whole_file' },
                  'answer',
                  'High-Yield Scenarios: three Likely/Problem mappings.'
                ),
              ],
            },
          },
        ],
      },
    },
    {
      activityId: 'lm-11',
      islandId: 'lake-mucosa',
      sequence: 11,
      type: 'quiz',
      title: 'Oxygenation vs Ventilation',
      description: 'Oxygenation vs. Ventilation Quiz (drag & drop quiz).',
      estimatedMinutes: 10,
      peepPointsValue: 3,
      countsTowardProgress: true,
      contentStatus: 'needs_review',
      conflictIds: ['lm-oxygenation-ventilation-dragdrop-mapping'],
      provenance: [
        sourceRef(
          '1. Lake Mucosa/Oxygenation vs. Ventilation Quiz.docx',
          { kind: 'whole_file' },
          'content',
          'Drag-and-drop quiz with oxygenation, ventilation, airway/placement, equipment-issue, and bonus sections.'
        ),
        sourceRef(
          'GameOutline.docx',
          { kind: 'whole_file' },
          'content',
          'Lake Mucosa roster row: Oxygenation vs. Ventilation; Quiz; 10 minutes; 3 PEEP Points.'
        ),
      ],
      content: {
        questions: [
          {
            id: 'q1',
            prompt: 'Place each item in the source category it belongs to: Oxygenation, Ventilation, Airway/Placement, or Suspected Equipment Issue.',
            interaction: 'drag_drop',
            choices: [
              { id: 'spo2', text: 'SpO2' },
              { id: 'pao2', text: 'PaO2' },
              { id: 'fio2', text: 'FiO2' },
              { id: 'peep', text: 'PEEP' },
              { id: 'map', text: 'Mean airway pressure' },
              { id: 'etco2', text: 'ETCO2' },
              { id: 'paco2', text: 'PaCO2' },
              { id: 'minute-ventilation', text: 'Minute ventilation' },
              { id: 'respiratory-rate', text: 'Respiratory rate' },
              { id: 'tidal-volume', text: 'Tidal volume' },
              { id: 'capnography', text: 'Capnography waveform' },
              { id: 'chest-rise', text: 'Chest rise' },
              { id: 'breath-sounds', text: 'Breath sounds' },
              { id: 'cxr', text: 'CXR confirmation' },
              { id: 'flat-etco2', text: 'Flat ETCO2 waveform but patient stable' },
              { id: 'poor-spo2-signal', text: 'Poor SpO2 signal not correlating with HR' },
              { id: 'tcom-drifting', text: 'TCOM drifting unexpectedly' },
              { id: 'inconsistent-monitors', text: 'Inconsistent readings across monitors' },
            ],
            targets: [
              { id: 'oxygenation', text: 'Oxygenation' },
              { id: 'ventilation', text: 'Ventilation' },
              { id: 'airway-placement', text: 'Airway/Placement' },
              { id: 'equipment', text: 'Suspected Equipment Issue' },
            ],
            answer: {
              interaction: 'drag_drop',
              placements: {
                spo2: 'oxygenation',
                pao2: 'oxygenation',
                fio2: 'oxygenation',
                peep: 'oxygenation',
                map: 'oxygenation',
                etco2: 'ventilation',
                paco2: 'ventilation',
                'minute-ventilation': 'ventilation',
                'respiratory-rate': 'ventilation',
                'tidal-volume': 'ventilation',
                capnography: 'airway-placement',
                'chest-rise': 'airway-placement',
                'breath-sounds': 'airway-placement',
                cxr: 'airway-placement',
                'flat-etco2': 'equipment',
                'poor-spo2-signal': 'equipment',
                'tcom-drifting': 'equipment',
                'inconsistent-monitors': 'equipment',
              },
            },
            review: {
              explanation:
                'The source defines oxygenation as getting oxygen into the blood and ventilation as removing carbon dioxide. Its category headings provide the intended placements; it warns that normal SpO₂ does not prove adequate ventilation and that high FiO₂ does not mean the problem is solved.',
              sourceReferences: [
                sourceRef(
                  '1. Lake Mucosa/Oxygenation vs. Ventilation Quiz.docx',
                  { kind: 'whole_file' },
                  'review',
                  'Pre-Quiz Content, category definitions, and Common Pitfalls.'
                ),
              ],
            },
          },
          {
            id: 'q2',
            prompt: 'SpO2 is 100%, ETCO2 is rising. Whats the problem?',
            interaction: 'mcq',
            choices: [
              { id: 'oxygenation', text: 'Oxygenation' },
              { id: 'ventilation', text: 'Ventilation' },
            ],
            answer: { interaction: 'mcq', correctChoiceId: 'ventilation' },
            review: {
              explanation: 'The source answer is Ventilation.',
              sourceReferences: [
                sourceRef(
                  '1. Lake Mucosa/Oxygenation vs. Ventilation Quiz.docx',
                  { kind: 'whole_file' },
                  'answer',
                  'Bonus Question source answer: Ventilation; source spelling “Whats” retained.'
                ),
              ],
            },
          },
        ],
      },
    },
    {
      activityId: 'lm-12',
      islandId: 'lake-mucosa',
      sequence: 12,
      type: 'video',
      title: 'Ventilator Interfaces 101 - Drager',
      estimatedMinutes: 5,
      peepPointsValue: 1,
      countsTowardProgress: true,
      contentStatus: 'unavailable',
      conflictIds: ['lm-interface-video-mapping'],
      provenance: [
        sourceRef(
          '1. Lake Mucosa/VentLab _Fio2Boost.pptx',
          { kind: 'slide', slide: 4 },
          'content',
          'Slide heading “Drager”; visual interface asset only.'
        ),
        sourceRef(
          '1. Lake Mucosa/VentInterfacesLakeMucosa.pptx',
          { kind: 'whole_file' },
          'media',
          'Image/video-only interface demonstration deck; exact interface labels are not extractable.'
        ),
        sourceRef(
          'GameOutline.docx',
          { kind: 'whole_file' },
          'content',
          'Lake Mucosa roster row: “Welcome to my Crib”: Ventilator interfaces 101 - Drager; Video; 5 minutes; 1 PEEP Point.'
        ),
      ],
      content: null,
    },
    {
      activityId: 'lm-13',
      islandId: 'lake-mucosa',
      sequence: 13,
      type: 'video',
      title: 'Ventilator Interfaces 101 - Servo i/u',
      estimatedMinutes: 5,
      peepPointsValue: 1,
      countsTowardProgress: true,
      contentStatus: 'unavailable',
      conflictIds: ['lm-interface-video-mapping'],
      provenance: [
        sourceRef(
          '1. Lake Mucosa/VentInterfacesLakeMucosa.pptx',
          { kind: 'whole_file' },
          'media',
          'Image/video-only interface demonstration deck; no textual labels identify the Servo i/u clip.'
        ),
        sourceRef(
          '1. Lake Mucosa/VentLab _Fio2Boost.pptx',
          { kind: 'slide', slide: 2 },
          'content',
          'SIMV/PC interface source includes Servo label among visible controls, but not a standalone Servo i/u video.'
        ),
        sourceRef(
          'GameOutline.docx',
          { kind: 'whole_file' },
          'content',
          'Lake Mucosa roster row: “Welcome to my Crib”: Ventilator interfaces 101 – Servo i/u; Video; 5 minutes; 1 PEEP Point.'
        ),
      ],
      content: null,
    },
    {
      activityId: 'lm-14',
      islandId: 'lake-mucosa',
      sequence: 14,
      type: 'video',
      title: 'Ventilator Interfaces 101 - Breas',
      estimatedMinutes: 5,
      peepPointsValue: 1,
      countsTowardProgress: true,
      contentStatus: 'unavailable',
      conflictIds: ['lm-interface-video-mapping'],
      provenance: [
        sourceRef(
          '1. Lake Mucosa/VentLab _Fio2Boost.pptx',
          { kind: 'slide', slide: 3 },
          'content',
          'Slide heading “Breas”; visual interface asset only.'
        ),
        sourceRef(
          '1. Lake Mucosa/VentInterfacesLakeMucosa.pptx',
          { kind: 'whole_file' },
          'media',
          'Image/video-only interface demonstration deck; exact Breas clip mapping is not extractable.'
        ),
        sourceRef(
          'GameOutline.docx',
          { kind: 'whole_file' },
          'content',
          'Lake Mucosa roster row: “Welcome to my Crib”: Ventilator interfaces 101 - Breas; Video; 5 minutes; 1 PEEP Point.'
        ),
      ],
      content: null,
    },
    {
      activityId: 'lm-15',
      islandId: 'lake-mucosa',
      sequence: 15,
      type: 'vent_lab',
      title: 'Boost FiO2 on All Vents',
      description: 'Emergency-time VentLab: temporarily boost a patient to 100% FiO2 on ventilator interfaces.',
      estimatedMinutes: 10,
      peepPointsValue: 5,
      countsTowardProgress: true,
      contentStatus: 'needs_review',
      conflictIds: ['lm-ventlab-star-control'],
      provenance: [
        sourceRef(
          '1. Lake Mucosa/VentLab _Fio2Boost.pptx',
          { kind: 'slide', slide: 1 },
          'content',
          'Emergency-time objective: temporarily “boost” the patient to 100% FiO2 on ventilator interfaces.'
        ),
        sourceRef(
          '1. Lake Mucosa/VentLab _Fio2Boost.pptx',
          { kind: 'slide', slide: 2 },
          'content',
          'SIMV/PC visible controls and wrong-choice feedback; star marks the correct target visually.'
        ),
        sourceRef(
          '1. Lake Mucosa/VentInterfacesLakeMucosa.pptx',
          { kind: 'whole_file' },
          'media',
          'Supporting interface screenshots and embedded demonstrations.'
        ),
        sourceRef(
          'GameOutline.docx',
          { kind: 'whole_file' },
          'content',
          'Lake Mucosa roster row: Boost FiO2 on all vents; Vent Lab; 10 minutes; 5 PEEP Points.'
        ),
      ],
      content: {
        controls: [
          { id: 'ppeak', label: 'PPeak', kind: 'number' },
          { id: 'pmean', label: 'Pmean', kind: 'number' },
          { id: 'peep-observed', label: 'PEEP', kind: 'number' },
          { id: 'o2', label: 'O2', kind: 'number' },
          { id: 'vti', label: 'VTi', kind: 'number' },
          { id: 'vte', label: 'Vte', kind: 'number' },
          { id: 'o2-conc', label: 'O2 conc.', kind: 'number', unit: '%' },
          { id: 'peep-set', label: 'PEEP', kind: 'number' },
          { id: 'rr', label: 'RR', kind: 'number' },
          { id: 'pc-above-peep', label: 'PC above PEEP', kind: 'number' },
          { id: 'ps-above-peep', label: 'PS above PEEP', kind: 'number' },
          { id: 'servo', label: 'Servo', kind: 'action' },
        ],
        objectives: [
          'Temporarily “boost” your patient to 100% FiO2 on the ventilator interfaces below by pressing on the button as you would in real life.',
          'If an incorrect button is selected, use the source feedback and start over again to select the right button.',
        ],
        feedback: {
          success: 'Correct control selected: temporarily boost the patient to 100% FiO2.',
          incorrect:
            'Try again! This silences vent alarms. Try again! These change alarm limits, show trends/views, and perform maneuvers. Try again! Are your dependent or observed values. Try again! Are your independent or set values. Try again! This controls your FiO2 and can make it 100%, but often takes longer in an emergency.',
          review: {
            notes:
              'The source authoring note says clickable boxes should use a star-labeled correct button, incorrect choices should display why they are wrong, and an incorrect learner should restart.',
            sourceReferences: [
              sourceRef(
                '1. Lake Mucosa/VentLab _Fio2Boost.pptx',
                { kind: 'slide', slide: 2 },
                'review',
                'Speaker note: boxes are clickable; correct button labeled with a star; incorrect choice gives feedback and directs restart.'
              ),
            ],
          },
        },
      },
    },
    {
      activityId: 'lm-16',
      islandId: 'lake-mucosa',
      sequence: 16,
      type: 'quest',
      title: 'Suctioning 101',
      description: 'QUEST #1: Patient bedside suctioning with an RT partner.',
      estimatedMinutes: 15,
      peepPointsValue: 10,
      countsTowardProgress: true,
      contentStatus: 'needs_review',
      conflictIds: ['lm-suction-quest-wording'],
      provenance: [
        sourceRef(
          '1. Lake Mucosa/Suctioning_Quest1.png',
          { kind: 'whole_file' },
          'content',
          'QUEST #1 instruction card: patient bedside suctioning, RT partner, four questions, feedback, and QR-code points instruction.'
        ),
        sourceRef(
          'GameOutline.docx',
          { kind: 'whole_file' },
          'content',
          'Lake Mucosa roster row: Suctioning 101; Quest #1; 15 minutes; 10 PEEP Points.'
        ),
      ],
      content: {
        instructions: `QUEST #1

TIME TO PUT YOUR KNOWLEDGE TO THE ULTIMATE TEST: PATIENT BEDSIDE

HOW TO GET YOUR PEEP POINTS:
1. FIND AN RT DURING YOUR NEXT SHIFT & ASK THEM TO BE YOUR PARTNER. BRING THEM TO A PATIENT WITH A VENTILATOR AND SUCTION THE PATIENT IN FRONT OF THEM. TALK THROUGH THE FOLLOWING QUESTIONS:
A. HOW MIGHT YOU TELL THE PATIENT NEEDS TO BE SUCTIONED USING THE VENTILATOR SCREEN? ARE THERE ANY CLUES?
B. HOW DO YOU KNOW HOW DEEP YOU CAN INSERT THE CATHETER?
C. ARE THERE ANY PATIENTS YOU PRE-OXYGENATE SUCTIONING?
D. WHAT ARE AT LEAST 2 RISKS & BENEFITS OF DOING AN OPEN SUCTION AS OPPOSED TO IN-LINE?
2. ELICIT AT LEAST ONE PIECE OF FEEDBACK ABOUT YOUR SUCTION.
3. SCAN YOUR RT’S QR CODE (IN THEIR EMAIL OR PRINTED IN RT OFFICE) TO GET POINTS`,
        supervisorRole: 'A respiratory therapist (RT) partner.',
        offlineValidation: {
          method: 'supervisor_confirmation',
          evidenceFields: ['rtPartner', 'patientBedsideDiscussion', 'feedback'],
        },
        review: {
          notes:
            'The source provides the bedside task and RT partnership instruction. QR-code points are source gameplay wording only; no QR target, authentication, persistence, or feedback-collection mechanism is present in the corpus.',
          sourceReferences: [
            sourceRef(
              '1. Lake Mucosa/Suctioning_Quest1.png',
              { kind: 'whole_file' },
              'review',
              'Quest card includes the QR-code instruction and asks for at least one piece of feedback.'
            ),
          ],
        },
      },
    },
    {
      activityId: 'lm-final-exam',
      islandId: 'lake-mucosa',
      sequence: 17,
      type: 'quiz',
      title: 'Lake Mucosa Final Exam',
      description: 'Canonical Lake Mucosa final-exam slot; question payload is not present in the source corpus.',
      estimatedMinutes: 20,
      peepPointsValue: 0,
      countsTowardProgress: false,
      contentStatus: 'unavailable',
      conflictIds: ['lm-final-exam-payload-unavailable'],
      provenance: [
        sourceRef(
          'GameOutline.docx',
          { kind: 'whole_file' },
          'content',
          'Canonical roster context for the Lake Mucosa final-exam slot; the source document lists competency end-of-curriculum exam logistics but no Lake-specific questions or answer key.'
        ),
      ],
      content: null,
    },
  ],
}

export { lakeMucosaIsland }
