import type { CurriculumIsland } from '../types'
import { exactSourceText, mediaRefForSource, sourceRef } from '../generated-data'

const GAME_OUTLINE = 'GameOutline.docx'
const DOPE_VIDEO = '6. Alveolar Highlands/GAMERICU_DOPE_Mnemonic_Airway_Emergencies_video.mp4'
const BVM_QUEST = '6. Alveolar Highlands/BVM_Quest9.png'
const BLOOD_GAS_QUEST = '6. Alveolar Highlands/Blood Gas Interpretation_Quest10.png'
const ERT_QUEST = '6. Alveolar Highlands/ERT_Quest11.png'
const ERT_CASE = '6. Alveolar Highlands/ERT clinical vignette GAMER.docx'
const ASTHMA_CASE =
  '6. Alveolar Highlands/GAMER-ICU- Alveolar highlands - Intubating an asthmatic – clinical case vignette.docx'
const ARDS_DECK = '6. Alveolar Highlands/ARDSCapturing_Case vignetteANSWERS.pptx'
const ARDS_PDF = '6. Alveolar Highlands/ARDSCapturing_CaseVignette.pdf'
const PRONING_SOURCE = '5. Mount Pneumonora/Ventilator Adjuncts Quiz Go from iNO to I KNOW.docx'

export const alveolarHighlandsIsland: CurriculumIsland = {
  id: 'alveolar-highlands',
  order: 6,
  name: 'Alveolar Highlands',
  description: 'Putting it all together!',
  activities: [
    {
      activityId: 'ah-01',
      islandId: 'alveolar-highlands',
      sequence: 1,
      title: 'DOPE and Other Considerations for Airway Emergencies',
      estimatedMinutes: 10,
      peepPointsValue: 1,
      countsTowardProgress: true,
      contentStatus: 'ready',
      type: 'video',
      content: {
        media: {
          ...mediaRefForSource(DOPE_VIDEO),
          altText:
            'GAMERICU DOPE mnemonic and airway emergencies video; instructional audio and visuals were not transcribed during extraction.',
        },
        durationSeconds: 608.12,
        completionCondition: { kind: 'ended' },
      },
      provenance: [
        sourceRef(
          DOPE_VIDEO,
          { kind: 'whole_file' },
          'media',
          'MP4 metadata identifies a 608.12-second DOPE/Mnemonic Airway Emergencies video; no transcript or chapters were extracted.'
        ),
      ],
      conflictIds: ['ah-conflict-dope-media'],
    },
    {
      activityId: 'ah-02',
      islandId: 'alveolar-highlands',
      sequence: 2,
      title: 'UE in the CT Scanner',
      estimatedMinutes: 15,
      peepPointsValue: 3,
      countsTowardProgress: true,
      contentStatus: 'unavailable',
      type: 'case_vignette',
      content: null,
      provenance: [
        sourceRef(
          GAME_OUTLINE,
          { kind: 'whole_file' },
          'content',
          'Canonical roster row ah-02: UE in the CT Scanner; Clinical Case Vignette; 15 minutes; 3 PEEP Points.'
        ),
      ],
      conflictIds: ['ah-conflict-missing-roster-evidence'],
    },
    {
      activityId: 'ah-03',
      islandId: 'alveolar-highlands',
      sequence: 3,
      title: 'Intubating an Asthmatic',
      description:
        'A five-part severe-critical-asthma case covering rescue escalation, SBAR, difficult bag-mask ventilation, post-intubation deterioration, and asthma ventilator decisions.',
      estimatedMinutes: 15,
      peepPointsValue: 3,
      countsTowardProgress: true,
      contentStatus: 'ready',
      type: 'case_vignette',
      content: {
        scenario: `Sue is an 11-year-old with food and environmental allergies and moderate persistent asthma who presents with severe critical asthma/status asthmaticus. She is awake and responsive but can speak only 2–3 words between breaths. Initial vital signs are T 99.1 degF, HR 130 bpm, RR 36, BP 90/60 mmHg, and SpO2 84% on room air, increasing to 93% with 11 LPM oxygen by simple face mask while albuterol is prepared. She has prolonged capillary refill, marked subcostal/intercostal/supraclavicular retractions, effortful exhalation with abdominal muscle use, poor diffuse air entry, and inspiratory and expiratory wheezing. The source says the CXR shows bilateral hyperinflation and no consolidation, but its sentence ends before the final finding.

She receives albuterol-ipratropium nebulizers, facemask oxygen, and IV steroids, with PICU admission planned. In PICU she receives BiPAP, continuous albuterol, continuous IV terbutaline, and magnesium. She later becomes stuporous with RR 9, BP 84/50, HR 140, SpO2 85% on BiPAP (inspiratory pressure 14, expiratory pressure 7, FiO2 40%); FiO2 is raised to 100%, with minimal air movement and poor capillary refill. Despite improved mask fit, IM epinephrine, and increased non-invasive pressures, she remains hypoxemic and altered, so the team intubates for impending respiratory arrest. High inspiratory pressures are needed for chest rise during two-provider bag-mask ventilation. One minute after intubation she is tachycardic with falling ETCO2, prolonged capillary refill, hypotension, falling saturations, and decreased right-sided breath sounds. After treatment of a tension pneumothorax, asthma ventilator management focuses on exhalation and avoiding worsened air trapping.

The case source labels interventions as Suggested, Maybe, or Probably incorrect rather than presenting a finalized answer key.`,
        decisions: [
          {
            id: 'asthma-niv',
            text: 'Use non-invasive ventilatory support with CPAP or BiPAP as a mainstay that may help avoid intubation.',
          },
          {
            id: 'asthma-magnesium',
            text: 'Give IV magnesium sulfate; the source describes smooth-muscle relaxation and bronchodilator action.',
          },
          {
            id: 'asthma-epinephrine',
            text: 'Consider epinephrine by the source-listed IV, subcutaneous, or intramuscular routes as a beta agonist/bronchodilator.',
          },
          {
            id: 'asthma-terbutaline',
            text: 'Consider IV or subcutaneous terbutaline as a beta agonist/bronchodilator.',
          },
          {
            id: 'asthma-fluid',
            text: 'Consider an IV fluid bolus because the source identifies volume depletion as common during tachypneic asthma attacks.',
          },
          {
            id: 'asthma-ketamine-review',
            text: 'Consider ketamine only as a source-marked Maybe: low doses below dissociation dose may relax bronchial smooth muscle.',
          },
          {
            id: 'asthma-blood-gas-review',
            text: 'Obtain a blood gas only as a source-marked Maybe; the source says it might or might not help.',
          },
          {
            id: 'asthma-delay-intubation',
            text: 'In the initial presentation, try rescue therapies before intubation because the source says absolute intubation indications are not yet present.',
          },
          {
            id: 'asthma-escalate',
            text: 'For the later stuporous, hypoxemic deterioration, activate immediate bedside help rather than relying on text/Epic chat.',
          },
          {
            id: 'asthma-sbar',
            text: 'Notify the attending with an SBAR describing Sue’s critical asthma, depressed consciousness, low respiratory rate, hypoxemia, poor air entry, tachycardia, hypotension, and FiO2 increase.',
          },
          {
            id: 'asthma-intubate',
            text: 'Proceed with intubation when the case progresses to impending respiratory arrest despite non-invasive rescue therapies.',
          },
          {
            id: 'asthma-bag-resistance',
            text: 'Attribute difficult bagging to increased airway resistance from bronchospasm and mucus plugging.',
          },
          {
            id: 'asthma-air-trapping',
            text: 'Attribute difficult bagging to air trapping from inadequate exhalation.',
          },
          {
            id: 'asthma-decompression',
            text: 'Treat the post-intubation deterioration as tension pneumothorax with immediate needle decompression or thoracostomy.',
          },
          {
            id: 'asthma-low-peep',
            text: 'The source marks zero or low PEEP as a strategy some clinicians use to allow maximum exhalation.',
          },
          {
            id: 'asthma-intrinsic-peep',
            text: 'The source marks matching measured intrinsic PEEP on an end-exhalation hold as another strategy some clinicians use to allow maximum exhalation.',
          },
          {
            id: 'asthma-avoid-rate',
            text: 'Do not respond to respiratory acidosis by automatically increasing respiratory rate; the source warns that this may worsen air trapping.',
          },
          {
            id: 'asthma-high-pip',
            text: 'Recognize that peak inspiratory pressure may be high because of airway resistance.',
          },
          {
            id: 'asthma-permissive-paco2',
            text: 'The source permits a strategy that tolerates elevated PaCO2 to allow a low respiratory rate and sufficient exhalation.',
          },
        ],
        answer: {
          acceptedDecisionIds: [
            'asthma-niv',
            'asthma-magnesium',
            'asthma-epinephrine',
            'asthma-terbutaline',
            'asthma-fluid',
            'asthma-delay-intubation',
            'asthma-escalate',
            'asthma-sbar',
            'asthma-intubate',
            'asthma-bag-resistance',
            'asthma-air-trapping',
            'asthma-decompression',
            'asthma-low-peep',
            'asthma-intrinsic-peep',
            'asthma-avoid-rate',
            'asthma-high-pip',
            'asthma-permissive-paco2',
          ],
          rationale:
            'The source explicitly marks these interventions or decisions as suggested/correct/true. Ketamine and obtaining a blood gas remain source-marked Maybe items and are intentionally not included in the accepted key.',
        },
        sbar: {
          prompt:
            'Phone the attending or bedside team and give an SBAR for Sue’s acute deterioration. Include the situation (11-year-old with critical asthma, depressed level of consciousness, low respiratory rate, and hypoxemia), background (initial response followed by slower breathing and reduced alertness), assessment (poor air entry, tachycardia, hypotension, minimal response to pain, and increased FiO2), and recommendation (come to the bedside emergently to assist).',
          review: {
            rationale:
              'The asthma case provides an expected S/B/A/R script and states that the code button is fastest for bringing help to the bedside; text/Epic chat is discouraged for an actively decompensating patient.',
            sourceReferences: [
              sourceRef(
                ASTHMA_CASE,
                { kind: 'whole_file' },
                'answer',
                'Case part two expected SBAR and suggested escalation methods.'
              ),
            ],
          },
        },
      },
      provenance: [
        sourceRef(
          ASTHMA_CASE,
          { kind: 'whole_file' },
          'content',
          'Five-part severe-critical-asthma/intubation case with rescue interventions, deterioration, SBAR, bagging, tension pneumothorax, and ventilator decisions.'
        ),
      ],
      conflictIds: ['ah-conflict-asthma-draft'],
    },
    {
      activityId: 'ah-04',
      islandId: 'alveolar-highlands',
      sequence: 4,
      title: 'ARDS: Capturing at Peak Illness',
      description:
        'A bone-marrow-transplant respiratory-failure case with acid-base interpretation, ETT review, oxygenation-index calculation, PEEP decision-making, proning evidence, and a captured/weaning outcome.',
      estimatedMinutes: 15,
      peepPointsValue: 3,
      countsTowardProgress: true,
      contentStatus: 'ready',
      type: 'case_vignette',
      content: {
        scenario: `You are the code nurse responding to a rapid response on the heme/onc floor for a 16-year-old with refractory cancer on day 13 after bone marrow transplantation. He has progressive sleepiness, skin sloughing, diarrhea, tachypnea, retractions, and hypoxemia to 89% on 4 L NC; the oncologist is concerned for engraftment syndrome. In PICU the team places him on full-face BiPAP and obtains a CXR, then he becomes febrile. Over the next 24 hours he becomes progressively tachypneic and hypoxic with ABG 7.10/60/47/18/-5. He is quickly intubated, then placed on SIMV/PRVC with Vt 7 ml/kg, PEEP 8, RR 30, and FiO2 50%; observed PIP is 27 and MAP is 14. Six hours later, after another fluid bolus, ABG is 7.2/56/48/17/-2.

The deck asks the learner to classify the acid-base disturbance, assess ETT position on CXR, calculate OI, choose a ventilator change, and then follow the patient to a CXR with diffuse bilateral hazy opacities consistent with moderate-to-severe ARDS. The deck says the patient is eventually captured after modest improvement and may begin weaning. A separate ventilator-adjunct source identifies proning as the best adjunct for a patient with ARDS and poor oxygenation despite high FiO2; that cross-island mapping is retained for review.`,
        decisions: [
          {
            id: 'ards-mixed-acidosis',
            text: 'Classify ABG 7.10/60/47/18/-5 as both a metabolic and respiratory acidosis, preserving the source’s malformed option E wording.',
          },
          {
            id: 'ards-ett-position-review',
            text: 'Review the CXR tube position: the source describes the ETT at approximately T2, with T3–T4 ideal and a position between the thoracic inlet and carina acceptable; the printed answer label is unresolved.',
          },
          {
            id: 'ards-oi-14',
            text: 'Calculate OI as (50 × 14) / 48 = 14 and classify the case as moderate ARDS using the deck’s OI bands.',
          },
          {
            id: 'ards-increase-peep',
            text: 'Increase PEEP to 10 to improve oxygenation by increasing mean airway pressure while the source treats the hypercarbia and mild acidosis as acceptable in context.',
          },
          {
            id: 'ards-prone-review',
            text: 'For severe hypoxemia despite high FiO2, review proning as the best adjunct in the separate ventilator-adjunct source; do not treat this cross-island mapping as an answer printed in the ARDS deck.',
          },
          {
            id: 'ards-capture-wean',
            text: 'After sufficient time and modest improvement in numbers and images, recognize the source’s captured outcome and begin weaning.',
          },
        ],
        answer: {
          acceptedDecisionIds: [
            'ards-mixed-acidosis',
            'ards-oi-14',
            'ards-increase-peep',
            'ards-capture-wean',
          ],
          rationale:
            'The deck explicitly explains mixed acidosis, OI 14/moderate ARDS, increasing PEEP to 10, and the captured/weaning outcome. ETT answer labeling and proning are intentionally review-marked rather than silently resolved.',
        },
        sbar: {
          prompt:
            'Phone the attending or RT and summarize this patient with SBAR: identify the day-13 post-BMT respiratory deterioration, the BiPAP-to-intubation course, ABG 7.2/56/48/17/-2, current SIMV/PRVC settings and observed PIP/MAP, your oxygenation assessment, and your recommendation to increase PEEP to 10 while preserving the source’s stated acceptable hypercarbia/acidosis range.',
          review: {
            rationale:
              'The global GameOutline requires case-vignette communication using SBAR; the ARDS deck supplies the patient course, blood gas, ventilator settings, and PEEP decision but does not supply a canonical SBAR answer.',
            sourceReferences: [
              sourceRef(
                ARDS_DECK,
                { kind: 'slide', slide: 17 },
                'content',
                'ABG, acceptable hypercarbia/acidosis, low PaO2, and recommendation to take PEEP to 10.'
              ),
              sourceRef(
                GAME_OUTLINE,
                { kind: 'whole_file' },
                'content',
                'Clinical case vignette communication strategy requires an SBAR summary to an RT or provider.'
              ),
            ],
          },
        },
      },
      provenance: [
        sourceRef(
          ARDS_DECK,
          { kind: 'slide', slide: 2 },
          'content',
          'Post-BMT patient presentation and transfer to PICU.'
        ),
        sourceRef(
          ARDS_DECK,
          { kind: 'slide', slide: 4 },
          'content',
          'ABG 7.10/60/47/18/-5 and acid-base prompt.'
        ),
        sourceRef(
          ARDS_DECK,
          { kind: 'slide', slide: 9 },
          'content',
          'ETT-position prompt and A–C options.'
        ),
        sourceRef(
          ARDS_DECK,
          { kind: 'slide', slide: 11 },
          'content',
          'Ventilator settings, observed PIP/MAP, and ABG for OI.'
        ),
        sourceRef(
          ARDS_DECK,
          { kind: 'slide', slide: 14 },
          'content',
          'Ventilator-change prompt and options.'
        ),
        sourceRef(
          ARDS_DECK,
          { kind: 'slide', slide: 17 },
          'answer',
          'Source rationale and PEEP 10 decision.'
        ),
        sourceRef(
          ARDS_DECK,
          { kind: 'slide', slide: 18 },
          'answer',
          'Diffuse bilateral hazy opacities consistent with moderate-to-severe ARDS.'
        ),
        sourceRef(
          ARDS_DECK,
          { kind: 'slide', slide: 19 },
          'answer',
          'Captured outcome and beginning weaning.'
        ),
        sourceRef(
          ARDS_PDF,
          { kind: 'whole_file' },
          'review',
          'Rendered 21-page alternate of the ARDS case; extraction status is missing_dependency, so the PPTX is the text-bearing source.'
        ),
        sourceRef(
          PRONING_SOURCE,
          { kind: 'whole_file' },
          'review',
          'Separate ventilator-adjunct quiz: ARDS with poor oxygenation despite high FiO2 — best adjunct proning.'
        ),
      ],
      conflictIds: [
        'ah-conflict-ards-alternate',
        'ah-conflict-ards-pdf-extraction',
        'ah-conflict-ards-q1-key',
        'ah-conflict-ards-q2-key',
        'ah-conflict-ards-q3-key',
        'ah-conflict-proning-mapping',
      ],
    },
    {
      activityId: 'ah-05',
      islandId: 'alveolar-highlands',
      sequence: 5,
      title: 'Extubation Readiness',
      description:
        'Mateo’s ERT case: screen readiness, interpret leak-test relevance and CPAP settings, monitor failure criteria, and classify a 60-minute trial.',
      estimatedMinutes: 15,
      peepPointsValue: 3,
      countsTowardProgress: true,
      contentStatus: 'ready',
      type: 'case_vignette',
      content: {
        scenario: `Mateo is a 12-month-old in Bed 551 who was intubated three days ago for bronchiolitis with bacterial pneumonia. He has improved over the last 24 hours and ventilator support has been weaned. The team considers an extubation readiness trial (ERT). Formal pre-ERT screening criteria in the source are PEEP ≤6 cm H2O, FiO2 ≤50%, SaO2 ≥95% on current settings, spontaneous respiratory effort, hemodynamic stability per RN assessment, SBS at goal with the patient arousable/minimally sedated, and no planned significantly invasive procedure within the next day shift.

Mateo’s screen shows PEEP 5, FiO2 0.30, pressure support 10, rate 12, SpO2 95%, intermittent spontaneous breaths and cough, HR 120, BP 75/45 with good perfusion and no vasoactive infusion, SBS at goal/arousable, and no planned invasive procedure. A leak is not consistently witnessed. The unit’s common ERT settings are pressure support 0, PEEP 5, and FiO2 30–40%. During the 60-minute trial, baseline RR is 30, SpO2 96%, Vt about 5 ml/kg, and EtCO2 42. At 10 minutes SpO2 briefly reaches 94% with prompt stimulation/suction and EtCO2 is 46; at 18 minutes there is a 6-second central pause without desaturation; at 25 minutes Vt is 4.2 ml/kg, SpO2 95%, EtCO2 48; at 60 minutes RR 38, SpO2 95%, Vt 4.0–4.5 ml/kg, and EtCO2 50, with no apnea plus desaturation.`,
        decisions: [
          {
            id: 'ert-screen',
            text: 'Mateo meets all formal pre-ERT screen criteria: PEEP 5, FiO2 30%, SaO2 95%, spontaneous effort, hemodynamic stability, SBS at goal/arousable, and no planned invasive procedure.',
          },
          {
            id: 'ert-leak-not-required',
            text: 'Do not fail the formal screen solely because an endotracheal-tube leak is not consistently witnessed; the source says leak testing is useful preparation information but not a formal PICU ERT screen component.',
          },
          {
            id: 'ert-cpap-settings',
            text: 'Use the source’s common settings of pressure support 0 cm H2O, PEEP 5 cm H2O, and FiO2 30–40%, recognizing that more conservative settings may be provider-directed.',
          },
          {
            id: 'ert-monitor',
            text: 'Monitor apnea, low tidal volume below 4 ml/kg, and desaturation; the source’s pass parameters are no apnea with desaturation, FiO2 ≤40% with SaO2 ≥95%, Vt ≥4 ml/kg, and EtCO2 increase ≤10 mmHg from baseline.',
          },
          {
            id: 'ert-pass',
            text: 'Classify Mateo’s 60-minute trial as passed: no apnea with desaturation, FiO2 30% with SpO2 ≥95%, Vt 4.0–5.0 ml/kg, and EtCO2 increase 8 mmHg.',
          },
        ],
        answer: {
          acceptedDecisionIds: [
            'ert-screen',
            'ert-leak-not-required',
            'ert-cpap-settings',
            'ert-monitor',
            'ert-pass',
          ],
          rationale:
            'The DOCX explicitly keys all five decisions as B, B, A, B, and True, respectively, and supplies the screen and pass/fail rationale.',
        },
        sbar: {
          prompt:
            'Give the night-shift nurse or RT an SBAR for Mateo’s ERT readiness and result. Include the formal screen values, arousability and spontaneous effort, absence of a planned invasive procedure, the planned CPAP settings, monitored events, and the evidence that the 60-minute trial passed.',
          review: {
            rationale:
              'The case supplies the numerical values and formal criteria for an ERT handoff; the SBAR prompt is an application of the GameOutline communication strategy, not an invented clinical threshold.',
            sourceReferences: [
              sourceRef(
                ERT_CASE,
                { kind: 'whole_file' },
                'answer',
                'Five-question ERT case with screening criteria, trial settings, monitoring criteria, and pass/fail rationale.'
              ),
              sourceRef(
                GAME_OUTLINE,
                { kind: 'whole_file' },
                'content',
                'Clinical case vignettes use SBAR communication to an RT or provider.'
              ),
            ],
          },
        },
      },
      provenance: [
        sourceRef(
          ERT_CASE,
          { kind: 'whole_file' },
          'content',
          'Mateo ERT clinical vignette and five explicit keyed questions.'
        ),
      ],
    },
    {
      activityId: 'ah-06',
      islandId: 'alveolar-highlands',
      sequence: 6,
      title: 'Alarm Alert: Low MV',
      estimatedMinutes: 10,
      peepPointsValue: 5,
      countsTowardProgress: true,
      contentStatus: 'unavailable',
      type: 'vent_lab',
      content: null,
      provenance: [
        sourceRef(
          GAME_OUTLINE,
          { kind: 'whole_file' },
          'content',
          'Canonical roster row ah-06: Alarm Alert: Low MV; Vent Lab; 10 minutes; 5 PEEP Points.'
        ),
      ],
      conflictIds: ['ah-conflict-missing-roster-evidence'],
    },
    {
      activityId: 'ah-07',
      islandId: 'alveolar-highlands',
      sequence: 7,
      title: 'Vent Alarms',
      estimatedMinutes: 10,
      peepPointsValue: 3,
      countsTowardProgress: true,
      contentStatus: 'unavailable',
      type: 'quiz',
      content: null,
      provenance: [
        sourceRef(
          GAME_OUTLINE,
          { kind: 'whole_file' },
          'content',
          'Canonical roster row ah-07: Vent Alarms; Quiz; 10 minutes; 3 PEEP Points.'
        ),
      ],
      conflictIds: ['ah-conflict-missing-roster-evidence'],
    },
    {
      activityId: 'ah-08',
      islandId: 'alveolar-highlands',
      sequence: 8,
      title: 'Blood Gas Analysis and Intervention',
      description:
        'Source-keyed ARDS blood-gas questions covering mixed acid-base disturbance, oxygenation index, and the PEEP intervention; answer-label conflicts remain visible for review.',
      estimatedMinutes: 10,
      peepPointsValue: 3,
      countsTowardProgress: true,
      contentStatus: 'ready',
      type: 'quiz',
      content: {
        questions: [
          {
            id: 'ah-08-q1',
            interaction: 'mcq',
            prompt: 'How would you classify his acid/base disturbance?',
            choices: [
              { id: 'a', text: 'respiratory acidosis without metabolic compensation' },
              { id: 'b', text: 'respiratory acidosis with metabolic compensation' },
              { id: 'c', text: 'metabolic acidosis without respiratory compensation' },
              { id: 'd', text: 'metabolic acidosis with respiratory compensation' },
              { id: 'e', text: 'mixed respiratory acidosis and respiratory acidosis ' },
            ],
            answer: { interaction: 'mcq', correctChoiceIds: ['e'] },
            review: {
              rationale: exactSourceText(ARDS_DECK),
              notes:
                'The editable deck’s app-development note records correct answer c for this question, contradicting the visible answer. Do not silently resolve the conflict.',
              sourceReferences: [
                sourceRef(
                  ARDS_DECK,
                  { kind: 'slide', slide: 4 },
                  'content',
                  'Question 1 ABG and options.'
                ),
                sourceRef(
                  ARDS_DECK,
                  { kind: 'slide', slide: 5 },
                  'answer',
                  'Visible ANSWER: E and mixed-acidosis explanation.'
                ),
                sourceRef(
                  ARDS_DECK,
                  { kind: 'slide', slide: 7 },
                  'review',
                  'App-development answer note recorded as c in source-discovery review.'
                ),
              ],
            },
          },
          {
            id: 'ah-08-q2',
            interaction: 'mcq',
            prompt: 'What is this patients Oxygenation Index (OI)?',
            choices: [
              { id: 'a', text: '10' },
              { id: 'b', text: '14' },
              { id: 'c', text: '18' },
              { id: 'd', text: '20' },
            ],
            answer: { interaction: 'mcq', correctChoiceIds: ['b'] },
            review: {
              rationale: exactSourceText(ARDS_DECK),
              notes:
                'The editable deck’s app-development note records correct answer D for this question, contradicting the calculation and visible answer.',
              sourceReferences: [
                sourceRef(
                  ARDS_DECK,
                  { kind: 'slide', slide: 11 },
                  'content',
                  'Ventilator variables, ABG, and OI choices.'
                ),
                sourceRef(
                  ARDS_DECK,
                  { kind: 'slide', slide: 12 },
                  'answer',
                  'OI calculation, moderate ARDS classification, and visible Answer: b.'
                ),
                sourceRef(
                  ARDS_DECK,
                  { kind: 'slide', slide: 11 },
                  'review',
                  'App-development answer note recorded as D in source-discovery review.'
                ),
              ],
            },
          },
          {
            id: 'ah-08-q3',
            interaction: 'mcq',
            prompt:
              'Based on this ABG and these ventilator dependent/independent variables, what ventilator settings would you like to change, if any?',
            choices: [
              { id: 'a', text: 'Increase RR' },
              { id: 'b', text: 'Increase Vt' },
              { id: 'c', text: 'Increase FiO2' },
              { id: 'd', text: 'Increase PEEP' },
            ],
            answer: { interaction: 'mcq', correctChoiceIds: ['d'] },
            review: {
              rationale: exactSourceText(ARDS_DECK),
              sourceReferences: [
                sourceRef(
                  ARDS_DECK,
                  { kind: 'slide', slide: 14 },
                  'content',
                  'Question 4 ventilator-change choices.'
                ),
                sourceRef(
                  ARDS_DECK,
                  { kind: 'slide', slide: 15 },
                  'answer',
                  'Visible Answer: D and do-no-harm rationale.'
                ),
                sourceRef(
                  ARDS_DECK,
                  { kind: 'slide', slide: 17 },
                  'answer',
                  'Source sets PEEP to 10.'
                ),
              ],
            },
          },
        ],
      },
      provenance: [
        sourceRef(ARDS_DECK, { kind: 'slide', slide: 4 }, 'content', 'Acid-base question.'),
        sourceRef(
          ARDS_DECK,
          { kind: 'slide', slide: 11 },
          'content',
          'Oxygenation-index question.'
        ),
        sourceRef(
          ARDS_DECK,
          { kind: 'slide', slide: 14 },
          'content',
          'Ventilator intervention question.'
        ),
        sourceRef(
          ARDS_DECK,
          { kind: 'slide', slide: 12 },
          'answer',
          'OI formula and visible answer.'
        ),
        sourceRef(ARDS_DECK, { kind: 'slide', slide: 15 }, 'answer', 'PEEP answer and rationale.'),
      ],
      conflictIds: [
        'ah-conflict-ards-q1-key',
        'ah-conflict-ards-q2-key',
        'ah-conflict-ards-q3-key',
      ],
    },
    {
      activityId: 'ah-09',
      islandId: 'alveolar-highlands',
      sequence: 9,
      title: 'BVM (RT)',
      description:
        'Quest #9: practice bagging a conventionally ventilated patient through an artificial airway with an RT and debrief technique and troubleshooting.',
      estimatedMinutes: 15,
      peepPointsValue: 10,
      countsTowardProgress: true,
      contentStatus: 'ready',
      type: 'quest',
      content: {
        instructions: `Find an RT during your next shift and ask them to be your partner. Bring them to a patient with a conventional ventilator (not an oscillator or APRV) and bag the patient through their artificial airway. Elicit feedback about: (A) whether you correctly set up the equipment and flow; (B) your rate, PIP, PEEP, and inspiratory time; (C) how you assessed the patient while bagging; (D) how you would troubleshoot poor chest rise in this patient; and (E) how you would bag if the patient lost their artificial airway, including a demonstration of proper seal technique.`,
        supervisorRole: 'Respiratory therapist partnering with the learner at the patient bedside.',
        offlineValidation: {
          method: 'supervisor_confirmation',
          evidenceFields: [
            'equipmentAndFlow',
            'ratePipPeepAndInspiratoryTime',
            'patientAssessment',
            'poorChestRiseTroubleshooting',
            'lostAirwaySealTechnique',
          ],
        },
        review: {
          notes:
            'The source directs the learner to scan an RT QR code for points, but no QR code, scoring endpoint, or rubric is included in the corpus. The bedside task and debrief prompts are retained without fabricating scoring.',
          sourceReferences: [
            sourceRef(BVM_QUEST, { kind: 'whole_file' }, 'content', 'Quest #9 instruction card.'),
          ],
        },
      },
      provenance: [
        sourceRef(
          BVM_QUEST,
          { kind: 'whole_file' },
          'content',
          'Quest #9 bedside BVM setup, assessment, troubleshooting, and lost-airway prompts.'
        ),
      ],
      conflictIds: ['ah-conflict-qr-scoring'],
    },
    {
      activityId: 'ah-10',
      islandId: 'alveolar-highlands',
      sequence: 10,
      title: 'Blood Gas Interpretation (Provider)',
      description:
        'Quest #10: interpret a ventilated patient’s last blood gas with a provider and recommend ventilator, fluid, nutrition, or electrolyte actions with rationale.',
      estimatedMinutes: 15,
      peepPointsValue: 10,
      countsTowardProgress: true,
      contentStatus: 'ready',
      type: 'quest',
      content: {
        instructions: `Find a provider during your next shift and ask them to be your partner. Bring them to a patient with a ventilator and interpret the last blood gas: (A) alkalosis or acidosis and how you know; (B) primarily metabolic or respiratory and how you know; (C) whether compensation is present and how you know; (D) whether electrolytes are appropriate in the context of the patient and what values would prompt you to call or message a provider; and (E) whether current ventilator settings suggest changes to the ventilator, fluid balance, nutrition, or electrolyte balance. Also determine whether the ERT was a success or failure and elicit feedback about your interpretation.`,
        supervisorRole:
          'Provider partnering with the learner during bedside blood-gas interpretation.',
        offlineValidation: {
          method: 'supervisor_confirmation',
          evidenceFields: [
            'acidBaseClassification',
            'primaryProcess',
            'compensation',
            'electrolyteAssessment',
            'recommendationAndRationale',
            'ertSuccessOrFailure',
          ],
        },
        review: {
          notes:
            'The source directs the learner to scan a provider QR code for points, but no provider email, QR code, scoring rule, or answer key is included. The quest remains a real bedside interpretation/debrief prompt.',
          sourceReferences: [
            sourceRef(
              BLOOD_GAS_QUEST,
              { kind: 'whole_file' },
              'content',
              'Quest #10 blood-gas, ventilator, fluid, nutrition, electrolyte, and ERT prompts.'
            ),
            sourceRef(
              ARDS_DECK,
              { kind: 'slide', slide: 12 },
              'review',
              'ARDS deck supplies a related source-keyed blood-gas calculation, but not a universal bedside answer key.'
            ),
          ],
        },
      },
      provenance: [
        sourceRef(
          BLOOD_GAS_QUEST,
          { kind: 'whole_file' },
          'content',
          'Quest #10 provider-supervised blood-gas interpretation prompts.'
        ),
      ],
      conflictIds: ['ah-conflict-qr-scoring'],
    },
    {
      activityId: 'ah-11',
      islandId: 'alveolar-highlands',
      sequence: 11,
      title: 'ERT (RT)',
      description:
        'Quest #11: observe or receive an RT ERT scenario, compare HR/RR and respiratory measures with supported values, and classify readiness.',
      estimatedMinutes: 15,
      peepPointsValue: 10,
      countsTowardProgress: true,
      contentStatus: 'ready',
      type: 'quest',
      content: {
        instructions: `Find an RT during your next shift and ask them to be your partner. Bring them to a patient undergoing an extubation readiness test. Answer: (A) the patient’s HR and RR, comparison with fully supported values, and what that suggests about extubation readiness; (B) whether there is apnea; (C) the EtCO2 during the ERT, comparison with baseline, and what increase would prompt ERT failure; (D) the FiO2 and SpO2 during the ERT and whether they are within successful-ERT parameters; and (E) the tidal volumes during the ERT and whether they are within successful-ERT parameters. If no eligible patient is available, ask the RT for a scenario and values, then elicit feedback about your interpretation.`,
        supervisorRole:
          'Respiratory therapist observing or supplying the ERT scenario and giving feedback.',
        offlineValidation: {
          method: 'supervisor_confirmation',
          evidenceFields: [
            'heartRateAndRespiratoryRate',
            'apnea',
            'etco2AndBaselineChange',
            'fio2AndSpo2',
            'tidalVolumes',
            'ertInterpretation',
          ],
        },
        review: {
          rationale:
            'The card calls the procedure an “extubation readiness test,” while the ERT DOCX consistently calls it an “extubation readiness trial.” Both source wordings are preserved.',
          notes:
            'The source directs the learner to scan an RT QR code for points, but no QR code or scoring rubric is included.',
          sourceReferences: [
            sourceRef(
              ERT_QUEST,
              { kind: 'whole_file' },
              'content',
              'Quest #11 visible wording and bedside prompts.'
            ),
            sourceRef(
              ERT_CASE,
              { kind: 'whole_file' },
              'answer',
              'ERT screening and pass/fail thresholds that support interpretation.'
            ),
          ],
        },
      },
      provenance: [
        sourceRef(
          ERT_QUEST,
          { kind: 'whole_file' },
          'content',
          'Quest #11 RT-supervised ERT observation and interpretation prompts.'
        ),
      ],
      conflictIds: ['ah-conflict-qr-scoring'],
    },
    {
      activityId: 'ah-final-exam',
      islandId: 'alveolar-highlands',
      sequence: 12,
      title: 'Alveolar Highlands Final Exam',
      estimatedMinutes: 20,
      peepPointsValue: 0,
      countsTowardProgress: false,
      contentStatus: 'unavailable',
      type: 'quiz',
      content: null,
      provenance: [
        sourceRef(
          GAME_OUTLINE,
          { kind: 'whole_file' },
          'content',
          'Canonical roster row ah-final-exam: Alveolar Highlands Final Exam; Quiz; 20 minutes; 0 PEEP Points; excluded from progress.'
        ),
      ],
      conflictIds: ['ah-conflict-final-exam-unavailable'],
    },
  ],
  declaredTotals: {
    activityCount: 10,
    estimatedMinutes: 135,
    peepPoints: 49,
  },
  observedTotals: {
    activityCount: 12,
    estimatedMinutes: 165,
    peepPoints: 54,
  },
  conflicts: [
    {
      conflictId: 'ah-conflict-gameoutline-total',
      scope: 'totals',
      status: 'ready',
      message:
        'GameOutline declares 10 Alveolar Highlands activities, 135 minutes, and 49 PEEP Points. The canonical roster adds ah-06 and ah-final-exam, so the catalog contains 12 records, 165 minutes, and 54 PEEP Points while preserving the declared 10/135/49 totals.',
      sourceIds: ['source-7effcb159366c230bc93'],
      activityIds: [
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
      field: 'declaredTotals',
      declaredValue: { activityCount: 10, estimatedMinutes: 135, peepPoints: 49 },
      observedValue: { activityCount: 12, estimatedMinutes: 165, peepPoints: 54 },
    },
    {
      conflictId: 'ah-conflict-missing-roster-evidence',
      scope: 'mapping',
      status: 'unavailable',
      message:
        'The canonical roster requires UE in the CT Scanner, Alarm Alert: Low MV, and Vent Alarms, but no corresponding activity-bearing source content was present in the eight-file Alveolar Highlands folder. Preserve each slot as unavailable rather than inventing a case, vent lab, or answer key.',
      sourceIds: ['source-7effcb159366c230bc93'],
      activityIds: ['ah-02', 'ah-06', 'ah-07'],
    },
    {
      conflictId: 'ah-conflict-final-exam-unavailable',
      scope: 'activity',
      status: 'unavailable',
      message:
        'The canonical roster requires an Alveolar Highlands final Quiz slot, but the extracted corpus contains no final-exam question set or keyed answers. The descriptor remains addressable with content null.',
      sourceIds: ['source-7effcb159366c230bc93'],
      activityIds: ['ah-final-exam'],
      field: 'content',
    },
    {
      conflictId: 'ah-conflict-dope-media',
      scope: 'source',
      status: 'ready',
      message:
        'The DOPE MP4 is present and has verified container metadata (608.12 seconds), but extraction could not probe/transcribe it because ffprobe was unavailable. Filename-based instructional coverage is not treated as a verified answer key.',
      sourceIds: ['source-36a2b41f3d180d8f3b0f'],
      activityIds: ['ah-01'],
      field: 'content',
    },
    {
      conflictId: 'ah-conflict-asthma-draft',
      scope: 'content',
      status: 'ready',
      message:
        'The asthma DOCX is draft-like: it labels choices Suggested/Maybe/Probably incorrect, leaves the CXR sentence incomplete, asks “Multiple choice (or short answer?)” for one step, and contains source typos. No clinical/content-owner decision should silently normalize these ambiguities.',
      sourceIds: ['source-ee4ea680d5d42ebe164a'],
      activityIds: ['ah-03'],
      field: 'answer',
    },
    {
      conflictId: 'ah-conflict-ards-alternate',
      scope: 'mapping',
      status: 'ready',
      message:
        'ARDSCapturing_CaseVignette.pdf and ARDSCapturing_Case vignetteANSWERS.pptx are alternate rendered/editable representations of one 21-step ARDS case, not two learner activities. The catalog uses one case slot and one related blood-gas quiz slot with both provenance trails.',
      sourceIds: ['source-2be02e391da13fdf6ddd', 'source-6ef96287c330e4afb35e'],
      activityIds: ['ah-04', 'ah-08'],
    },
    {
      conflictId: 'ah-conflict-ards-pdf-extraction',
      scope: 'source',
      status: 'unavailable',
      message:
        'The PDF alternate was not text-extracted because pdfinfo and pdftotext were unavailable. The PPTX alternate supplies the cataloged text; no image-only PDF answer is invented.',
      sourceIds: ['source-2be02e391da13fdf6ddd'],
      activityIds: ['ah-04'],
      field: 'extractionStatus',
    },
    {
      conflictId: 'ah-conflict-ards-q1-key',
      scope: 'content',
      status: 'ready',
      message:
        'ARDS acid-base Q1 visibly says ANSWER: E and explains mixed metabolic plus respiratory acidosis, while the source option E is malformed and the editable deck’s app-development note records correct answer c. Preserve visible answer, wording, and note separately.',
      sourceIds: ['source-6ef96287c330e4afb35e'],
      activityIds: ['ah-04', 'ah-08'],
      field: 'answer',
      declaredValue: 'E',
      observedValue: 'App-development note: c',
    },
    {
      conflictId: 'ah-conflict-ards-q2-key',
      scope: 'content',
      status: 'ready',
      message:
        'ARDS ETT-position Q2 offers only A–C, but the visible answer screen says Answer: E; the editable deck’s app-development note records B. The tube description (approximately T2; T3–T4 ideal; thoracic inlet-to-carina acceptable) is retained without selecting a fabricated option.',
      sourceIds: ['source-6ef96287c330e4afb35e'],
      activityIds: ['ah-04'],
      field: 'answer',
      declaredValue: 'E',
      observedValue: 'Options A–C; app-development note: B',
    },
    {
      conflictId: 'ah-conflict-ards-q3-key',
      scope: 'content',
      status: 'ready',
      message:
        'ARDS OI Q3 calculates 14 and visibly keys lower-case b, while the editable deck’s app-development note records D. The formula and calculation are retained alongside the conflicting labels.',
      sourceIds: ['source-6ef96287c330e4afb35e'],
      activityIds: ['ah-04', 'ah-08'],
      field: 'answer',
      declaredValue: 'b (OI 14)',
      observedValue: 'App-development note: D',
    },
    {
      conflictId: 'ah-conflict-proning-mapping',
      scope: 'mapping',
      status: 'ready',
      message:
        'The Highlands ARDS deck does not print a proning decision. A Mount Pneumora ventilator-adjunct quiz separately states that proning is the best adjunct for ARDS with poor oxygenation despite high FiO2. The catalog links that evidence as a review-marked cross-island decision rather than presenting it as a Highlands answer.',
      sourceIds: ['source-343c4e242fd2d76bed43', 'source-6ef96287c330e4afb35e'],
      activityIds: ['ah-04'],
      field: 'content',
    },
    {
      conflictId: 'ah-conflict-qr-scoring',
      scope: 'source',
      status: 'unavailable',
      message:
        'Quest cards instruct learners to scan an RT or provider QR code for points, but the extracted corpus contains no QR code, endpoint, participant record, or scoring rubric. Keep real bedside prompts and supervisor confirmation without inventing the missing mechanism.',
      sourceIds: [
        'source-5e952dd8dae61b4f5e32',
        'source-dbe97b1abf849784d31f',
        'source-662c616b4cca28b8c35e',
      ],
      activityIds: ['ah-09', 'ah-10', 'ah-11'],
      field: 'content',
    },
  ],
}
