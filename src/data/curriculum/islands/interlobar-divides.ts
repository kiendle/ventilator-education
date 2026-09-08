import type { CurriculumIsland } from '../types'
import { exactSourceBlocks, mediaRefForSource, sourceRef } from '../generated-data'

const OUTLINE = 'GameOutline.docx'
const F01 = '2. Interlobar Divides/Ventilator Modes_Graphic.png'
const F02 = '2. Interlobar Divides/Ventilator Settings_Clinical Case Vignette.pdf'
const F03 = '2. Interlobar Divides/Vent modes screens GAMER.pptx'
const F05 = '2. Interlobar Divides/SpecialVentilatorStrategiesInterlobarDivides.pptx'
const F07 = '2. Interlobar Divides/Lung Compliance_Video.mp4'
const F08 = '2. Interlobar Divides/Independent v Dependent variables_Movie.mp4'
const F09 = '2. Interlobar Divides/Determining Compliance_Quest3.png'
const F10 = '2. Interlobar Divides/CVICU Ventilator Considerations_Video.MOV'
const F11 = '2. Interlobar Divides/Determining Compliance_Quest2.png'
const F12 = '2. Interlobar Divides/CCDH considerations.MOV'
const F13 = '2. Interlobar Divides/Choosing a Ventilator Mode  Clinical Case.docx'

const outlineRoster = sourceRef(
  OUTLINE,
  { kind: 'whole_file' },
  'content',
  'GameOutline roster and declared Interlobar Divides totals.'
)

export const interlobarDividesIsland: CurriculumIsland = {
  id: 'interlobar-divides',
  order: 2,
  name: 'Interlobar Divides',
  description: 'Introduction to conventional mechanical ventilation modes & settings',
  activities: [
    {
      activityId: 'id-01',
      islandId: 'interlobar-divides',
      sequence: 1,
      title: 'Lung Compliance 101',
      description:
        'Video preparation for the compliance relationship used in conventional ventilation.',
      type: 'video',
      estimatedMinutes: 10,
      peepPointsValue: 1,
      countsTowardProgress: true,
      contentStatus: 'ready',
      content: {
        media: mediaRefForSource(F07),
        durationSeconds: 679.333,
        completionCondition: { kind: 'ended' },
      },
      provenance: [
        sourceRef(
          F07,
          { kind: 'whole_file' },
          'content',
          'Lung Compliance_Video.mp4; container duration was extracted, but no audiovisual transcript was available.'
        ),
        outlineRoster,
      ],
    },
    {
      activityId: 'id-02',
      islandId: 'interlobar-divides',
      sequence: 2,
      title: 'Ventilator Basics: Independent and Dependent Variables',
      description:
        'Video preparation for identifying controlled and observed ventilator variables.',
      type: 'video',
      estimatedMinutes: 15,
      peepPointsValue: 2,
      countsTowardProgress: true,
      contentStatus: 'ready',
      content: {
        media: mediaRefForSource(F08),
        durationSeconds: 517.75,
        completionCondition: { kind: 'ended' },
      },
      provenance: [
        sourceRef(
          F08,
          { kind: 'whole_file' },
          'content',
          'Independent v Dependent variables_Movie.mp4; container duration was extracted, but no audiovisual transcript was available.'
        ),
        outlineRoster,
      ],
    },
    {
      activityId: 'id-03',
      islandId: 'interlobar-divides',
      sequence: 3,
      title: 'Ventilator Basics: Independent and Dependent Variables',
      description:
        'Case-based exploration of airway-protection intubation, mode choice, and initial values for a healthy pediatric lung.',
      type: 'case_vignette',
      estimatedMinutes: 15,
      peepPointsValue: 5,
      countsTowardProgress: true,
      contentStatus: 'ready',
      content: {
        scenario:
          'Colby is a 3-year-old, 20 kg child with a seizure disorder who is intubated for airway protection during status epilepticus, not for primary respiratory failure. Her lungs are initially healthy. The case asks the learner to choose SIMV or AC, then PC, VC, or PRVC, and to select physiologic initial ventilator values while distinguishing independent from dependent variables.',
        decisions: [
          {
            id: 'simv',
            text: 'Choose SIMV: set mandatory breaths receive full support, while spontaneous breaths above the set rate receive pressure support; the source contrasts this with AC, where every breath receives full support and there is no pressure support.',
          },
          {
            id: 'prvc',
            text: 'Choose PRVC: the source describes volume as the independent variable and pressure as the dependent variable, with breath-to-breath pressure adjustment to deliver consistent tidal volume while limiting barotrauma.',
          },
          {
            id: 'healthy-values',
            text: 'For the healthy 20 kg child, select Vt 120 mL (6 mL/kg), PEEP 5, RR 30, and iTime 0.8 seconds as the case decision values.',
          },
        ],
        answer: {
          acceptedDecisionIds: ['simv', 'prvc', 'healthy-values'],
          rationale:
            'The source explicitly records the case decisions as SIMV, PRVC, and Vt 120 mL with PEEP 5, RR 30, and iTime 0.8 seconds. It defines compliance as C = ΔV / ΔP and explains which variable is independent or dependent in each mode.',
        },
        sbar: {
          prompt:
            'Summarize the indication for intubation, the child’s initial lung condition, the chosen mode, and the independent and dependent variables in an SBAR handoff to an RT or provider.',
          review: {
            sourceReferences: [
              sourceRef(
                F02,
                { kind: 'page', page: 2 },
                'content',
                'Airway protection indication and initial prompts.'
              ),
              sourceRef(
                F02,
                { kind: 'page', page: 3 },
                'content',
                'SIMV/AC definitions and compliance equation.'
              ),
              sourceRef(
                F02,
                { kind: 'page', page: 4 },
                'content',
                'PC, VC, and PRVC variable definitions.'
              ),
              sourceRef(
                F02,
                { kind: 'page', page: 5 },
                'content',
                'Healthy-child settings and recorded case decisions.'
              ),
            ],
          },
        },
      },
      provenance: [
        sourceRef(
          F02,
          { kind: 'page', page: 2 },
          'content',
          'Meet Colby: airway protection rather than respiratory failure.'
        ),
        sourceRef(F02, { kind: 'page', page: 3 }, 'content', 'SIMV versus AC and C = ΔV / ΔP.'),
        sourceRef(
          F02,
          { kind: 'page', page: 4 },
          'content',
          'PC, VC, and PRVC independent/dependent variables.'
        ),
        sourceRef(
          F02,
          { kind: 'page', page: 5 },
          'content',
          'Physiologic values and explicit initial-settings decision.'
        ),
        outlineRoster,
      ],
    },
    {
      activityId: 'id-04',
      islandId: 'interlobar-divides',
      sequence: 4,
      title: 'Ventilator Modes: The Decision Trees',
      description:
        'Roster-required decision-tree video slot; the verified source extraction does not contain a learner-readable decision-tree video payload.',
      type: 'video',
      estimatedMinutes: 5,
      peepPointsValue: 1,
      countsTowardProgress: true,
      contentStatus: 'unavailable',
      content: null,
      provenance: [
        outlineRoster,
        sourceRef(
          F03,
          { kind: 'slide', slide: 1 },
          'review',
          'The mode deck has a mode-determination title, but its extracted slides are a quiz rather than a decision-tree video.'
        ),
      ],
      conflictIds: ['id-04-payload-unavailable'],
    },
    {
      activityId: 'id-05',
      islandId: 'interlobar-divides',
      sequence: 5,
      title: 'Ventilator Modes: PC vs PRVC in the PICU',
      description:
        'Graphic comparison of pressure-control and pressure-regulated-volume-control priorities and their shared decelerating-flow waveform.',
      type: 'reading',
      estimatedMinutes: 5,
      peepPointsValue: 1,
      countsTowardProgress: true,
      contentStatus: 'ready',
      conflictIds: ['id-05-image-only-source'],
      content: {
        blocks: exactSourceBlocks(F01),
        body: 'PRVC is described as providing guaranteed tidal volume and stable minute ventilation by adjusting pressure breath by breath to deliver the set volume at the lowest necessary pressure. The graphic also warns that PRVC peak inspiratory pressures are variable and can rise as lung mechanics change. PC gives the clinician control of peak inspiratory pressure and is presented as useful for oxygenation and barotrauma prevention, but it does not guarantee tidal volume; increased fluid or secretions can reduce Vt for the same PIP. The graphic identifies a key overlap: both PC and PRVC use a decelerating flow waveform. It describes high initial flow that decreases as alveoli fill, improved distribution in stiff or low-compliance lungs, higher mean airway pressure for oxygenation, and more physiologic flow that can reduce patient–ventilator dyssynchrony. Its bottom strip names PRVC priority as CO₂ control and stable minute ventilation, PC priority as oxygenation and barotrauma prevention, and the shared advantage as decelerating flow for synchrony and distribution.',
        confirmationQuestion: {
          prompt:
            'According to the comparison graphic, which feature is shared by both PC and PRVC?',
          choices: [
            { id: 'decelerating-flow', text: 'A decelerating flow waveform' },
            { id: 'guaranteed-vt', text: 'Guaranteed tidal volume' },
            { id: 'fixed-pip', text: 'Fixed peak inspiratory pressure' },
            { id: 'no-monitoring', text: 'No need to monitor changing lung mechanics' },
          ],
          answer: { correctChoiceId: 'decelerating-flow' },
          review: {
            rationale:
              'The graphic explicitly labels decelerating flow as the key overlap between PC and PRVC; it distinguishes guaranteed Vt as a PRVC advantage and clinician-controlled PIP as a PC advantage.',
            sourceReferences: [
              sourceRef(
                F01,
                { kind: 'whole_file' },
                'content',
                'Visible comparison graphic and key-overlap panel.'
              ),
            ],
          },
        },
      },
      provenance: [
        sourceRef(F01, { kind: 'whole_file' }, 'content', 'PRVC versus PC comparison graphic.'),
        outlineRoster,
      ],
    },
    {
      activityId: 'id-06',
      islandId: 'interlobar-divides',
      sequence: 6,
      title: 'Ventilator Modes: Determining Which Mode You Are In',
      description:
        'Vent-lab mode identification using three ventilator-screen questions, their set and measured settings, and flow diagrams.',
      type: 'vent_lab',
      estimatedMinutes: 10,
      peepPointsValue: 3,
      countsTowardProgress: true,
      contentStatus: 'ready',
      content: {
        controls: [
          {
            id: 'screen',
            label: 'Ventilator screen',
            kind: 'select',
            options: ['Slide 2 / screen 1', 'Slide 3 / screen 2', 'Slide 4 / screen 3'],
          },
          {
            id: 'mode',
            label: 'Selected mode',
            kind: 'select',
            options: ['CPAP/PS', 'SIMV PRVC', 'SIMV PC', 'PRVC', 'PC'],
          },
        ],
        objectives: [
          'Use set settings, measured settings, and flow diagrams as the source prompts direct.',
          'Select the mode identified by the speaker-note answer key for each of the three screens.',
        ],
        feedback: {
          success:
            'The source answer key maps Slide 2 to SIMV PRVC, Slide 3 to SIMV PC, and Slide 4 to CPAP/PS.',
          incorrect:
            'Re-check the selected screen’s set settings, measured settings, and flow diagrams before choosing a mode.',
          review: {
            notes:
              'The deck’s ventilator-screen pixels were not OCR-transcribed. The mode labels, options, and speaker-note answer mapping are preserved; set/measured values are intentionally not recreated.',
            sourceReferences: [
              sourceRef(
                F03,
                { kind: 'slide', slide: 2 },
                'content',
                'Question/options and first ventilator-screen images.'
              ),
              sourceRef(
                F03,
                { kind: 'slide', slide: 3 },
                'content',
                'Question/options and second ventilator-screen images.'
              ),
              sourceRef(
                F03,
                { kind: 'slide', slide: 4 },
                'content',
                'Question/options and third ventilator-screen images.'
              ),
              sourceRef(
                F03,
                { kind: 'slide', slide: 2 },
                'answer',
                'Speaker-note answer: SIMV PRVC.'
              ),
              sourceRef(
                F03,
                { kind: 'slide', slide: 3 },
                'answer',
                'Speaker-note answer: SIMV PC.'
              ),
              sourceRef(
                F03,
                { kind: 'slide', slide: 4 },
                'answer',
                'Speaker-note answer: CPAP/PS.'
              ),
            ],
          },
        },
      },
      provenance: [
        sourceRef(
          F03,
          { kind: 'slide', slide: 2 },
          'content',
          'Mode-identification question and options.'
        ),
        sourceRef(
          F03,
          { kind: 'slide', slide: 3 },
          'content',
          'Mode-identification question and options.'
        ),
        sourceRef(
          F03,
          { kind: 'slide', slide: 4 },
          'content',
          'Mode-identification question and options.'
        ),
        sourceRef(
          F03,
          { kind: 'slide', slide: 2 },
          'answer',
          'Answer key mapping for first question.'
        ),
        sourceRef(
          F03,
          { kind: 'slide', slide: 3 },
          'answer',
          'Answer key mapping for second question.'
        ),
        sourceRef(
          F03,
          { kind: 'slide', slide: 4 },
          'answer',
          'Answer key mapping for third question.'
        ),
        outlineRoster,
      ],
      conflictIds: ['id-06-screen-media-gap'],
    },
    {
      activityId: 'id-07',
      islandId: 'interlobar-divides',
      sequence: 7,
      title: 'Ventilator Modes: Choosing a Mode',
      description:
        'Branching ventilator-settings case for an intubated patient with sickle-cell acute chest syndrome; incomplete source branches remain reviewable rather than receiving invented answers.',
      type: 'case_vignette',
      estimatedMinutes: 10,
      peepPointsValue: 5,
      countsTowardProgress: true,
      contentStatus: 'ready',
      content: {
        scenario:
          'An 18-year-old female weighing 60 kg has sickle-cell disease and acute chest syndrome. She worsens despite BiPAP and is intubated for hypoxemia after requiring high pressures while bagging (PIP 30, PEEP 10). The source asks the learner to choose a ventilator mode and then work through PEEP, pressure-control or tidal-volume, rate, FiO₂, and pressure-support branches. Several branches explicitly direct the author to “give remaining answers,” so those missing transitions are not supplied here.',
        decisions: [
          {
            id: 'simv-pc-ps',
            text: 'Choose SIMV PC PS and proceed through the source PEEP, pressure-control/delta-P, rate, FiO₂, and PS branch prompts.',
          },
          {
            id: 'simv-prvc-ps',
            text: 'Choose SIMV PRVC PS and proceed through the source PEEP, tidal-volume, rate, FiO₂, and PS branch prompts.',
          },
          {
            id: 'peep',
            text: 'Enter a source-listed PEEP branch value of 6, 8, 10, or 12 and observe the documented desaturation, consolidation, arterial-line, or hypotension outcome.',
          },
          {
            id: 'pressure-or-volume',
            text: 'For SIMV PC PS, enter pressure control/delta P 10, 20, or 30; for SIMV PRVC PS, enter tidal volume 200, 400, or 600 mL and follow the source-described pressure response.',
          },
          {
            id: 'rate',
            text: 'Enter a rate in the source’s 0–100 range; the source gives distinct feedback for 0–10, 11–24, and greater than 24.',
          },
          {
            id: 'fio2',
            text: 'Enter FiO₂ from 21%–100%; the source gives feedback for less than 40%, 40%–60%, and greater than 60%.',
          },
          {
            id: 'pressure-support',
            text: 'Enter pressure support; the source says the fellow approves and notes that the patient is paralyzed/not yet breathing, so PS can be adjusted as the patient wakes.',
          },
        ],
        sbar: {
          prompt:
            'Summarize the acute chest syndrome presentation, current ventilator mode and settings selected from the case, observed oxygenation/pressure response, and the next branch to discuss with the RT or provider.',
          review: {
            notes:
              'This alternate case implementation is partially authored. The source does not supply correct values or transitions for its “give remaining answers” prompts, and its PRVC tidal-volume branch asks for a pressure-control change.',
            sourceReferences: [
              sourceRef(
                F13,
                { kind: 'whole_file' },
                'review',
                'Incomplete branch authoring and terminology conflicts.'
              ),
            ],
          },
        },
      },
      provenance: [
        sourceRef(
          F13,
          { kind: 'whole_file' },
          'content',
          'Case start, mode options, branch values, and documented branch outcomes.'
        ),
        outlineRoster,
      ],
      conflictIds: ['id-07-incomplete-branches', 'id-07-prvc-parameter-conflict'],
    },
    {
      activityId: 'id-08',
      islandId: 'interlobar-divides',
      sequence: 8,
      title: 'Determining Compliance',
      description:
        'Bedside quest to identify mode variables and assess compliance with an RT partner; the source provides two repeat variants.',
      type: 'quest',
      estimatedMinutes: 15,
      peepPointsValue: 5,
      countsTowardProgress: true,
      repeatCount: 2,
      contentStatus: 'ready',
      content: {
        instructions:
          'During your next shift, find an RT and ask them to be your partner. Bring the RT to a patient with a ventilator and answer: (A) Is the patient in SIMV or AC, and PC, VC, or PRVC? (B) What is the dependent variable (for example, Vt in PC or PIP in PRVC)? (C) What is the independent variable (for example, PIP in PC or Vt in PRVC)? (D) What does this tell you about compliance? Ask the RT to review the pressure, volume, and flow scalars and whether they can identify the mode. Elicit at least one piece of feedback about your compliance assessment. The source instructs the learner to scan the RT’s QR code for points; this catalog records the offline supervisor interaction but does not implement QR or persistence.',
        supervisorRole:
          'Respiratory therapist partner who reviews the bedside mode, variables, scalars, compliance assessment, and feedback.',
        offlineValidation: {
          method: 'supervisor_confirmation',
          evidenceFields: [
            'modeAssessment',
            'dependentVariable',
            'independentVariable',
            'complianceAssessment',
            'rtFeedback',
          ],
        },
        repeatCount: 2,
        review: {
          notes:
            'Quest 2 and Quest 3 are near-template alternates. Quest 3 asks for a different RT and different patient; Quest 2 asks for an RT and a patient. Neither source supplies an answer key. Both images print the independent/dependent examples opposite to the canonical definitions used in F02: the images label PIP in PC and Vt in PRVC as dependent, and Vt in PC and PIP in PRVC as independent. The catalog keeps the F02-consistent mapping and flags this source contradiction for manual review.',
          sourceReferences: [
            sourceRef(F11, { kind: 'whole_file' }, 'content', 'Quest 2 bedside instructions.'),
            sourceRef(F09, { kind: 'whole_file' }, 'content', 'Quest 3 bedside instructions.'),
          ],
        },
      },
      provenance: [
        sourceRef(F11, { kind: 'whole_file' }, 'content', 'Determining Compliance Quest 2.'),
        sourceRef(F09, { kind: 'whole_file' }, 'content', 'Determining Compliance Quest 3.'),
        outlineRoster,
      ],
      conflictIds: ['id-08-variable-label-conflict'],
    },
    {
      activityId: 'id-09',
      islandId: 'interlobar-divides',
      sequence: 9,
      title: 'CVICU Ventilator Strategies and Norms',
      description: 'CVICU ventilator considerations video from the special-strategies media shell.',
      type: 'video',
      estimatedMinutes: 10,
      peepPointsValue: 1,
      countsTowardProgress: true,
      contentStatus: 'ready',
      content: {
        media: mediaRefForSource(F10),
        durationSeconds: 356.167,
        completionCondition: { kind: 'ended' },
      },
      provenance: [
        sourceRef(
          F10,
          { kind: 'whole_file' },
          'media',
          'Direct CVICU Ventilator Considerations_Video.MOV source copy; audiovisual transcript unavailable.'
        ),
        sourceRef(
          F05,
          { kind: 'slide', slide: 2 },
          'media',
          'Slide 2 embeds the matching CVICU Ventilator Considerations media item and poster.'
        ),
        outlineRoster,
      ],
    },
    {
      activityId: 'id-10',
      islandId: 'interlobar-divides',
      sequence: 10,
      title: 'CCDH Ventilator Strategies and Norms',
      description:
        'Named CCDH ventilator-considerations video; the verified binary source provides container metadata but no audiovisual transcript.',
      type: 'video',
      estimatedMinutes: 10,
      peepPointsValue: 1,
      countsTowardProgress: true,
      contentStatus: 'ready',
      content: {
        media: mediaRefForSource(F12),
        durationSeconds: 172.883,
        completionCondition: { kind: 'ended' },
      },
      provenance: [
        sourceRef(
          F12,
          { kind: 'whole_file' },
          'media',
          'CCDH considerations.MOV filename and container metadata; no audiovisual transcript was available.'
        ),
        sourceRef(
          F02,
          { kind: 'page', page: 4 },
          'review',
          'The case notes that CDH uses PC, which supports but does not establish the video topic mapping.'
        ),
        outlineRoster,
      ],
      conflictIds: ['id-10-topic-mapping'],
    },
    {
      activityId: 'id-11',
      islandId: 'interlobar-divides',
      sequence: 11,
      title: 'Ventilator Settings: Selecting Initial Settings for a Healthy Lung',
      description:
        'Clinical case from airway-protection intubation through rising PRVC pressures, oxygenation-index calculation, pARDS severity, and PC/ARDS confirmation.',
      type: 'case_vignette',
      estimatedMinutes: 20,
      peepPointsValue: 5,
      countsTowardProgress: true,
      contentStatus: 'ready',
      content: {
        scenario:
          'Colby is a 3-year-old, 20 kg female with influenza A, recurrent high fevers, status epilepticus, and a known seizure disorder. She is intubated primarily for airway protection while her lungs are initially healthy. The source records an initial SIMV/PRVC strategy with Vt 120 mL (6 mL/kg), PEEP 5, RR 30, and iTime 0.8 seconds. Twenty-four hours later, influenza A pneumonia worsens, peak pressures rise, oxygenation worsens, and FiO₂ requirements increase. The source then asks the learner to evaluate reversible causes, calculate OI from FiO₂ 0.60, MAP 14 cmH₂O, and arterial PaO₂ 70 mmHg, classify moderate pARDS, and follow the pressure–volume change to SIMV/PC with a fixed pressure in the “30s” and Vt 4 mL/kg.',
        decisions: [
          {
            id: 'airway-protection',
            text: 'Recognize airway protection, rather than primary respiratory failure, as the indication for intubation and begin with a healthy-lung strategy.',
          },
          {
            id: 'simv-prvc',
            text: 'Select SIMV/PRVC for the initial healthy-lung strategy; the source says PRVC guarantees minute ventilation while minimizing barotrauma.',
          },
          {
            id: 'initial-values',
            text: 'Use the recorded initial values Vt 120 mL, PEEP 5, RR 30, and iTime 0.8 seconds.',
          },
          {
            id: 'pressure-survival-guide',
            text: 'When PRVC peak pressure rises, evaluate the source-listed reversible causes: agitation, ETT placement, obstruction/secretions, right mainstem intubation, pneumothorax, and inadequate sedation.',
          },
          {
            id: 'oi-twelve',
            text: 'Calculate OI as (60 × 14) / 70 = 12 using the worked calculation printed in the source.',
          },
          {
            id: 'moderate-pards',
            text: 'Classify OI 12 as moderate pARDS because the source lists moderate OI as 8–<16.',
          },
          {
            id: 'pc-ards',
            text: 'Follow the source’s ARDS branch from SIMV/PRVC to SIMV/PC: with pressure set in the “30s,” Vt falls to 4 mL/kg as compliance worsens, and bilateral white-out CXR findings support pARDS.',
          },
        ],
        answer: {
          acceptedDecisionIds: [
            'airway-protection',
            'simv-prvc',
            'initial-values',
            'pressure-survival-guide',
            'oi-twelve',
            'moderate-pards',
            'pc-ards',
          ],
          rationale:
            'These decisions follow the explicit page-by-page case outcomes. The source preserves conflicting PIP units, OI fraction-versus-percentage notation, “30s” pressure wording, and a small iTime/I:E arithmetic mismatch; those source conflicts are not silently corrected.',
        },
        sbar: {
          prompt:
            'Give an SBAR handoff for Colby’s deterioration: state the influenza A insult and timing, current ventilator support and rising pressures, reversible checks completed, OI and pARDS severity, and the lung-protective mode/volume decision.',
          review: {
            sourceReferences: [
              sourceRef(
                F02,
                { kind: 'page', page: 5 },
                'content',
                'Initial healthy-lung settings.'
              ),
              sourceRef(
                F02,
                { kind: 'page', page: 6 },
                'content',
                'Rising PRVC pressures and reversible-cause guide.'
              ),
              sourceRef(
                F02,
                { kind: 'page', page: 7 },
                'content',
                'OI formula and worked calculation.'
              ),
              sourceRef(F02, { kind: 'page', page: 8 }, 'content', 'pARDS severity ranges.'),
              sourceRef(
                F02,
                { kind: 'page', page: 9 },
                'content',
                'Pressure–volume relationship and SIMV/PC branch.'
              ),
              sourceRef(
                F02,
                { kind: 'page', page: 10 },
                'content',
                'CXR findings and pARDS criteria.'
              ),
            ],
          },
        },
      },
      provenance: [
        sourceRef(F02, { kind: 'page', page: 1 }, 'content', 'Clinical case framing.'),
        sourceRef(
          F02,
          { kind: 'page', page: 5 },
          'content',
          'Initial settings for a healthy lung.'
        ),
        sourceRef(
          F02,
          { kind: 'page', page: 6 },
          'content',
          'Deterioration and rising peak-pressure branch.'
        ),
        sourceRef(F02, { kind: 'page', page: 7 }, 'content', 'Oxygenation-index calculation.'),
        sourceRef(F02, { kind: 'page', page: 8 }, 'content', 'pARDS severity classification.'),
        sourceRef(F02, { kind: 'page', page: 9 }, 'content', 'Pressure–volume relationship.'),
        sourceRef(F02, { kind: 'page', page: 10 }, 'content', 'CXR findings and pARDS criteria.'),
        sourceRef(F02, { kind: 'page', page: 11 }, 'content', 'Case summary and takeaways.'),
        outlineRoster,
      ],
      conflictIds: ['id-11-source-contradictions'],
    },
    {
      activityId: 'id-final-exam',
      islandId: 'interlobar-divides',
      sequence: 12,
      title: 'Interlobar Divides Final Exam',
      description:
        'Roster-required final-exam slot; no final-exam question set was present in the verified Interlobar source extraction.',
      type: 'quiz',
      estimatedMinutes: 20,
      peepPointsValue: 0,
      countsTowardProgress: false,
      contentStatus: 'unavailable',
      content: null,
      provenance: [
        outlineRoster,
        sourceRef(
          F02,
          { kind: 'whole_file' },
          'review',
          'The case is instructional source material, not a final-exam answer key or question set.'
        ),
      ],
      conflictIds: ['id-final-exam-content-unavailable'],
    },
  ],
  declaredTotals: {
    activityCount: 10,
    estimatedMinutes: 135,
    peepPoints: 34,
    repeatInstances: 2,
  },
  observedTotals: {
    activityCount: 12,
    estimatedMinutes: 145,
    peepPoints: 30,
    repeatInstances: 2,
  },
  conflicts: [
    {
      conflictId: 'id-04-payload-unavailable',
      scope: 'mapping',
      status: 'unavailable',
      message:
        'The canonical roster includes a five-minute “Ventilator Modes: The Decision Trees” video, but the verified Interlobar extraction contains no learner-readable decision-tree video payload. The nearby mode deck is a quiz with image-only screen captures.',
      sourceIds: ['source-7effcb159366c230bc93', 'source-942d72aaf32b9eb4ff35'],
      activityIds: ['id-04'],
    },
    {
      conflictId: 'id-06-screen-media-gap',
      scope: 'content',
      status: 'ready',
      message:
        'The three mode-identification answer mappings are present in speaker notes, but the embedded ventilator-screen pixels were not OCR-transcribed. The lab therefore does not invent screen values.',
      sourceIds: ['source-942d72aaf32b9eb4ff35'],
      activityIds: ['id-06'],
    },
    {
      conflictId: 'id-07-incomplete-branches',
      scope: 'content',
      status: 'ready',
      message:
        'The choosing-a-mode DOCX repeatedly asks the author to give remaining answers and supplies no correct values or transitions for those branches.',
      sourceIds: ['source-638af99195c598411f75'],
      activityIds: ['id-07'],
    },
    {
      conflictId: 'id-07-prvc-parameter-conflict',
      scope: 'content',
      status: 'ready',
      message:
        'The PRVC branch labels its parameter Tidal Volume but then asks what PC should change to; the source also may conflate pressure control/delta P with total PIP.',
      sourceIds: ['source-638af99195c598411f75'],
      activityIds: ['id-07'],
      field: 'content.decisions',
    },
    {
      conflictId: 'id-08-variable-label-conflict',
      scope: 'content',
      status: 'ready',
      message:
        'The Quest 2 and Quest 3 images label the independent/dependent examples opposite to the canonical definitions in the F02 case: PC sets pressure and observes Vt, while PRVC sets Vt and observes pressure. The catalog uses the canonical mapping and preserves the source labels for manual review.',
      sourceIds: [
        'source-bc09dd734ce7f408914b',
        'source-a7334f339fa443c85f65',
        'source-c5425d9e98ed0863a367',
      ],
      activityIds: ['id-08'],
      field: 'content.instructions',
    },
    {
      conflictId: 'id-10-topic-mapping',
      scope: 'mapping',
      status: 'ready',
      message:
        'The CCDH video is linked to this roster slot from its filename and the F02 note that CDH uses PC; no direct package relationship or audiovisual transcript establishes the topic.',
      sourceIds: ['source-5864f1afd209244c6281', 'source-c5425d9e98ed0863a367'],
      activityIds: ['id-10'],
    },
    {
      conflictId: 'id-11-source-contradictions',
      scope: 'content',
      status: 'ready',
      message:
        'F02 preserves printed PIP unit alternation (mmHg/cmH₂O), fraction-versus-percentage OI notation, “30s” pressure wording, and a small iTime/I:E arithmetic mismatch. The catalog carries the source values without correcting them.',
      sourceIds: ['source-c5425d9e98ed0863a367'],
      activityIds: ['id-11'],
    },
    {
      conflictId: 'id-roster-totals',
      scope: 'totals',
      status: 'ready',
      message:
        'GameOutline declares 10 activities, 135 minutes, and 34 PEEP points for Interlobar Divides (the 135/34 values include the Quest repeat). The canonical roster adds the Decision Trees slot and the final-exam slot, so observed catalog records are 12 activities, 145 minutes, and 30 points.',
      sourceIds: ['source-7effcb159366c230bc93'],
      activityIds: ['id-04', 'id-08', 'id-final-exam'],
      declaredValue: { activityCount: 10, estimatedMinutes: 135, peepPoints: 34 },
      observedValue: { activityCount: 12, estimatedMinutes: 145, peepPoints: 30 },
    },
    {
      conflictId: 'id-final-exam-content-unavailable',
      scope: 'activity',
      status: 'unavailable',
      message:
        'The canonical final-exam descriptor is required, but no final-exam question set or answer key appears in the verified Interlobar source corpus.',
      sourceIds: ['source-7effcb159366c230bc93', 'source-c5425d9e98ed0863a367'],
      activityIds: ['id-final-exam'],
    },
  ],
}
