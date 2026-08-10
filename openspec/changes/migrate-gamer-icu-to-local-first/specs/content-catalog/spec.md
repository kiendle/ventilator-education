## Purpose

Define validated, versioned, offline curriculum content and media with a safe learner-facing fallback when any activity content is unavailable.

## ADDED Requirements

### Requirement: The content catalog SHALL represent the complete curriculum independently of presentation

The content catalog SHALL provide versioned structured records for every configured activity in Lake Mucosa, Interlobar Divides, Valley of Pulmonara, Bronchial Bluffs, Mount Pneumora, and Alveolar Highlands, including stable activity identity, title, description, activity type, estimated time, PEEP Points value, sequence, and the type-specific content. Adding, updating, or removing a valid activity SHALL NOT require changing the activity presentation behavior.

#### Scenario: A validated catalog release is opened

- **WHEN** the learner opens an island using a valid catalog release
- **THEN** the learner SHALL receive the activities and metadata from that release in its declared order, with each record routed by its declared type

#### Scenario: A catalog record is not assigned to a valid island

- **WHEN** a record references an unknown island or duplicates a stable activity identity within a release
- **THEN** the release SHALL reject or quarantine that record and SHALL not present it as a learner activity

### Requirement: Each activity type SHALL have a validation contract

The catalog SHALL validate every activity against the contract for its declared type before that activity can be included in a learner release. The contracts SHALL cover Video media and duration; Reading/Graphic body content and exactly one confirmation question with options and a correct answer; Quiz questions using the four supported question types with prompts and answer associations; Clinical Case Vignette scenarios, management decisions, and SBAR content; Quest instructions and supervisor role with offline validation metadata; and Vent Lab simulation controls, objectives, and feedback.
The validator SHALL require every activity's estimated time to be greater than 0 and PEEP Points value to be at least 0, and SHALL reject a proposed catalog release containing activity metadata with estimated time <= 0 or PEEP Points < 0 before publication or installation.

#### Scenario: A release contains valid records for all activity types

- **WHEN** the catalog validator evaluates records whose fields satisfy their declared type contracts
- **THEN** the validator SHALL accept those records for packaging and SHALL preserve their type-specific content without requiring presentation-specific changes
#### Scenario: A release contains invalid activity metadata

- **WHEN** the catalog validator evaluates a proposed release containing an activity with estimated time <= 0 or PEEP Points < 0
- **THEN** the validator SHALL reject the proposed release, identify the offending activity and metadata field, SHALL not publish or install it as a valid learner release, and SHALL retain the last complete valid release if one exists

#### Scenario: A record is missing required or type-incompatible content

- **WHEN** a record has missing required fields, an invalid value, an unsupported question type, or content belonging to a different activity type
- **THEN** the validator SHALL identify the record and validation failure, SHALL exclude it from the valid learner release, and SHALL not allow malformed content to be rendered as a completed activity

### Requirement: Learner releases SHALL contain one complete validated content version

Every learner content release SHALL identify its content version and SHALL include a complete mutually compatible set of validated structured content and referenced media for that version. The learner SHALL continue using the last complete valid release if a newer release is unavailable, interrupted, or incompatible, and local attempts SHALL remain associated with the release version used.

#### Scenario: A learner installs or opens a complete release

- **WHEN** the device has a complete validated content release
- **THEN** the learner SHALL be able to browse and use that release offline, and each activity interaction SHALL use the release's declared version

#### Scenario: A release update is interrupted or incomplete

- **WHEN** a newer content release cannot be fully validated or all of its referenced media are not available
- **THEN** the learner SHALL retain access to the last complete valid release and SHALL not be shown a mixture of incompatible release versions

### Requirement: The learner content path SHALL work without Supabase content APIs

The learner SHALL receive structured curriculum content and media from a packaged, versioned release that is usable without network access. Public application or content assets MAY be distributed through Supabase or another non-participant asset channel, but content availability SHALL not require a Supabase content API, and the catalog SHALL never submit participant-level or linkable study data to Supabase.

#### Scenario: A learner opens content with no network

- **WHEN** the learner browses an installed release while the network is unavailable
- **THEN** the catalog SHALL provide the available structured content and packaged media locally and SHALL allow the activity experience to continue without a cloud content request

#### Scenario: An asset channel is unreachable

- **WHEN** a non-participant asset host is unreachable during content use
- **THEN** the catalog SHALL use the packaged asset or its unavailable-content behavior and SHALL not send participant-level or linkable activity data to the asset host or Supabase

### Requirement: Missing or invalid content SHALL use a coming-soon fallback

If an activity record is absent, incomplete, invalid, unsupported, or missing required media, the content interface SHALL show a clear Coming Soon or unavailable-content state instead of crashing. Such an activity SHALL not be marked successfully complete or produce completion PEEP Points until valid content is available.

#### Scenario: An activity has no usable content payload

- **WHEN** the learner opens an activity whose payload is missing or fails its type contract
- **THEN** the interface SHALL display the Coming Soon fallback, SHALL keep the rest of the island usable, and SHALL prevent successful completion for that activity

#### Scenario: Video media fails while descriptive content is available

- **WHEN** a valid Video activity cannot load its media but has a learner-readable description
- **THEN** the interface SHALL show a retry action and the available description, and SHALL not mark the video complete before its completion condition is met

### Requirement: Quest validation material SHALL remain outside learner-readable content

The catalog SHALL keep every Quest validation secret or equivalent supervisor-only approval material outside learner-readable packaged content, learner-visible diagnostics, and Supabase content or aggregate payloads. Quest completion SHALL rely on the privacy-compatible offline supervisor interaction defined by the activity experience rather than a cloud password service.

#### Scenario: A learner inspects or exports packaged quest content

- **WHEN** learner-readable Quest content is displayed, cached, or included in a learner content export
- **THEN** it SHALL contain task instructions and supervisor guidance but SHALL not contain validation secrets or data that lets the learner self-approve completion

#### Scenario: A quest is used without a network

- **WHEN** the learner and supervisor complete a Quest while offline
- **THEN** the catalog and activity experience SHALL support the local supervisor confirmation and SHALL keep all supervisor-only validation material local and out of Supabase

### Requirement: Content validation failures SHALL be isolated from valid activities
A single activity with invalid type-specific content or a media reference SHALL not invalidate unrelated valid activities in the same island or release, while a release-level metadata violation SHALL reject the proposed release; in either case, the catalog SHALL make the affected activity's unavailable state and the reason for exclusion available to the content maintainer.

#### Scenario: One activity fails validation in an otherwise valid island

- **WHEN** one activity fails schema or media validation while other activities in the island pass
- **THEN** the valid activities SHALL remain available, and the invalid activity SHALL use the Coming Soon fallback without stopping the learner from using the island

#### Scenario: A maintainer corrects an excluded activity

- **WHEN** a corrected activity satisfies its type contract and is included in a new validated release
- **THEN** the catalog SHALL make the corrected activity available under its new release version without rewriting earlier local attempt records

### Requirement: Every learner release SHALL include the authoritative versioned six-island roster

The release manifest SHALL carry a `rosterVersion` and an approved positive `maxElapsedDurationMs` policy for bounded activity evidence, plus the exact six-island roster below. Each roster slot SHALL have a stable `activityId`, island order, sequence, placeholder descriptor (title, description, expected type, estimated minutes, and PEEP Points; the title is the minimum placeholder description), and `countsTowardProgress` flag. The roster is the completeness authority: a release SHALL be rejected when a slot is missing, duplicated, reordered, assigned to another island, or when an unexpected slot is added. A slot's descriptor SHALL remain addressable even when its payload is absent, invalid, unsupported, or missing media; the learner SHALL show that slot as unavailable/Coming Soon rather than removing it. The six `*-final-exam` slots are the only slots with `isFinalExam: true`, SHALL have expected type `Quiz`, and SHALL have `countsTowardProgress: false`. The `pending` expected type used by `bb-14` is descriptor-only, is not a seventh renderable activity type, and SHALL remain unavailable until a supported payload is authored.

The normative roster for `rosterVersion: 1` is:

| Island (`islandId`, order) | Sequence | Stable `activityId` | Placeholder descriptor (`title`/`description`; expected type; minutes; PEEP Points) | `countsTowardProgress` |
|---|---:|---|---|---|
| `lake-mucosa` (1) | 1 | `lm-01` | Oxygenation & Mean Airway Pressure; Video; 10; 3 | true |
| `lake-mucosa` (1) | 2 | `lm-02` | Oxygenation & Mean Airway Pressure; Reading/Graphic; 5; 2 | true |
| `lake-mucosa` (1) | 3 | `lm-03` | Oxygenation & Mean Airway Pressure; Quiz; 10; 3 | true |
| `lake-mucosa` (1) | 4 | `lm-04` | Ventilation & Minute Ventilation; Video; 10; 3 | true |
| `lake-mucosa` (1) | 5 | `lm-05` | Ventilation & Minute Ventilation; Reading/Graphic; 5; 2 | true |
| `lake-mucosa` (1) | 6 | `lm-06` | Ventilation & Minute Ventilation; Quiz; 10; 3 | true |
| `lake-mucosa` (1) | 7 | `lm-07` | Airway Anatomy; Reading/Graphic; 5; 1 | true |
| `lake-mucosa` (1) | 8 | `lm-08` | Pulmonary Anatomy; Reading/Graphic; 5; 1 | true |
| `lake-mucosa` (1) | 9 | `lm-09` | Airway Sounds; Quiz; 10; 3 | true |
| `lake-mucosa` (1) | 10 | `lm-10` | Non-invasive Ventilation Monitoring (TCOM vs EtCO2); Quiz; 10; 3 | true |
| `lake-mucosa` (1) | 11 | `lm-11` | Oxygenation vs Ventilation; Quiz; 10; 3 | true |
| `lake-mucosa` (1) | 12 | `lm-12` | Ventilator Interfaces 101 - Drager; Video; 5; 1 | true |
| `lake-mucosa` (1) | 13 | `lm-13` | Ventilator Interfaces 101 - Servo i/u; Video; 5; 1 | true |
| `lake-mucosa` (1) | 14 | `lm-14` | Ventilator Interfaces 101 - Breas; Video; 5; 1 | true |
| `lake-mucosa` (1) | 15 | `lm-15` | Boost FiO2 on All Vents; Vent Lab; 10; 5 | true |
| `lake-mucosa` (1) | 16 | `lm-16` | Suctioning 101; Quest; 15; 10 | true |
| `lake-mucosa` (1) | 17 | `lm-final-exam` | Lake Mucosa Final Exam; Quiz; 20; 0 | false |
| `interlobar-divides` (2) | 1 | `id-01` | Lung Compliance 101; Video; 10; 1 | true |
| `interlobar-divides` (2) | 2 | `id-02` | Ventilator Basics: Independent and Dependent Variables; Video; 15; 2 | true |
| `interlobar-divides` (2) | 3 | `id-03` | Ventilator Basics: Independent and Dependent Variables; Clinical Case Vignette; 15; 5 | true |
| `interlobar-divides` (2) | 4 | `id-04` | Ventilator Modes: The Decision Trees; Video; 5; 1 | true |
| `interlobar-divides` (2) | 5 | `id-05` | Ventilator Modes: PC vs PRVC in the PICU; Reading/Graphic; 5; 1 | true |
| `interlobar-divides` (2) | 6 | `id-06` | Ventilator Modes: Determining Which Mode You Are In; Vent Lab; 10; 3 | true |
| `interlobar-divides` (2) | 7 | `id-07` | Ventilator Modes: Choosing a Mode; Clinical Case Vignette; 10; 5 | true |
| `interlobar-divides` (2) | 8 | `id-08` | Determining Compliance; Quest; 15; 5 | true |
| `interlobar-divides` (2) | 9 | `id-09` | CVICU Ventilator Strategies and Norms; Video; 10; 1 | true |
| `interlobar-divides` (2) | 10 | `id-10` | CCDH Ventilator Strategies and Norms; Video; 10; 1 | true |
| `interlobar-divides` (2) | 11 | `id-11` | Ventilator Settings: Selecting Initial Settings for a Healthy Lung; Clinical Case Vignette; 20; 5 | true |
| `interlobar-divides` (2) | 12 | `id-final-exam` | Interlobar Divides Final Exam; Quiz; 20; 0 | false |
| `valley-of-pulmonara` (3) | 1 | `vp-01` | Bronchiolitis Pathophysiology; Video; 10; 2 | true |
| `valley-of-pulmonara` (3) | 2 | `vp-02` | Asthma Pathophysiology; Video; 10; 2 | true |
| `valley-of-pulmonara` (3) | 3 | `vp-03` | Tracheobronchomalacia; Video; 10; 2 | true |
| `valley-of-pulmonara` (3) | 4 | `vp-04` | ARDS Pathophysiology; Video; 10; 2 | true |
| `valley-of-pulmonara` (3) | 5 | `vp-05` | ARDS: Lung Protective Strategies; Reading/Graphic; 5; 1 | true |
| `valley-of-pulmonara` (3) | 6 | `vp-06` | Captured: Using Language to Depict Illness Severity and Course; Video; 5; 1 | true |
| `valley-of-pulmonara` (3) | 7 | `vp-07` | Vent Alarms 101; Video; 15; 3 | true |
| `valley-of-pulmonara` (3) | 8 | `vp-08` | Special Considerations for EAT Patients; Video; 5; 1 | true |
| `valley-of-pulmonara` (3) | 9 | `vp-09` | Guess That Disease; Vent Lab; 10; 5 | true |
| `valley-of-pulmonara` (3) | 10 | `vp-10` | Guess That Disease; Clinical Case Vignette; 10; 3 | true |
| `valley-of-pulmonara` (3) | 11 | `vp-11` | Effective Communication: Vent Alarms (RT); Quest; 20; 10 | true |
| `valley-of-pulmonara` (3) | 12 | `vp-12` | Effective Communication: Vent Alarms (Provider); Quest; 20; 10 | true |
| `valley-of-pulmonara` (3) | 13 | `vp-13` | Ventilator-Associated Pneumonia: Background and Sequelae; Reading/Graphic; 10; 2 | true |
| `valley-of-pulmonara` (3) | 14 | `vp-14` | Ventilator-Associated Pneumonia: Prevention; Quiz; 5; 2 | true |
| `valley-of-pulmonara` (3) | 15 | `vp-final-exam` | Valley of Pulmonara Final Exam; Quiz; 20; 0 | false |
| `bronchial-bluffs` (4) | 1 | `bb-01` | CXR Interpretation; Video; 10; 1 | true |
| `bronchial-bluffs` (4) | 2 | `bb-02` | CXR Interpretation; Reading/Graphic; 5; 1 | true |
| `bronchial-bluffs` (4) | 3 | `bb-03` | Guess That Disease; Quiz; 10; 3 | true |
| `bronchial-bluffs` (4) | 4 | `bb-04` | Goldilocks and the 3 ETTs; Quiz; 10; 3 | true |
| `bronchial-bluffs` (4) | 5 | `bb-05` | CXR in Real Life; Quest; 10; 5 | true |
| `bronchial-bluffs` (4) | 6 | `bb-06` | Blood Gas Interpretation: Part 1; Video; 10; 2 | true |
| `bronchial-bluffs` (4) | 7 | `bb-07` | Blood Gas Interpretation: Identify the Gas; Quiz; 15; 3 | true |
| `bronchial-bluffs` (4) | 8 | `bb-08` | Blood Gas Interpretation: Part 2; Video; 10; 2 | true |
| `bronchial-bluffs` (4) | 9 | `bb-09` | Blood Gas Interpretation: Act on the Gas; Quiz; 15; 3 | true |
| `bronchial-bluffs` (4) | 10 | `bb-10` | Blood Gas Interpretation: Summary Graphic; Reading/Graphic; 5; 1 | true |
| `bronchial-bluffs` (4) | 11 | `bb-11` | How to Bag 101; Video; 10; 1 | true |
| `bronchial-bluffs` (4) | 12 | `bb-12` | BVM Deliberate Practice; Quest; 20; 10 | true |
| `bronchial-bluffs` (4) | 13 | `bb-13` | Troubleshooting Ineffective BVM; Quiz; 10; 3 | true |
| `bronchial-bluffs` (4) | 14 | `bb-14` | Bronchial Bluffs Activity Slot 14 (descriptor pending); pending; 1; 0 | true |
| `bronchial-bluffs` (4) | 15 | `bb-final-exam` | Bronchial Bluffs Final Exam; Quiz; 20; 0 | false |
| `mount-pneumora` (5) | 1 | `mp-01` | Ventilator Dys-synchrony; Video; 10; 1 | true |
| `mount-pneumora` (5) | 2 | `mp-02` | Sedation Considerations; Video; 5; 1 | true |
| `mount-pneumora` (5) | 3 | `mp-03` | Introduction to HFOV; Video; 10; 1 | true |
| `mount-pneumora` (5) | 4 | `mp-04` | Welcome to My Crib: HFOV; Video; 5; 1 | true |
| `mount-pneumora` (5) | 5 | `mp-05` | Introduction to APRV; Video; 10; 1 | true |
| `mount-pneumora` (5) | 6 | `mp-06` | Welcome to My Crib: APRV; Video; 5; 1 | true |
| `mount-pneumora` (5) | 7 | `mp-07` | Escalating Care: Case 1; Clinical Case Vignette; 10; 3 | true |
| `mount-pneumora` (5) | 8 | `mp-08` | Escalating Care: Case 2; Clinical Case Vignette; 10; 3 | true |
| `mount-pneumora` (5) | 9 | `mp-09` | HFOV vs APRV; Quiz; 10; 3 | true |
| `mount-pneumora` (5) | 10 | `mp-10` | Weaning from non-CMV; Video; 10; 1 | true |
| `mount-pneumora` (5) | 11 | `mp-11` | Ventilator Adjuncts: iNO; Reading/Graphic; 10; 2 | true |
| `mount-pneumora` (5) | 12 | `mp-12` | Go from iNO to I KNOW; Quiz; 10; 3 | true |
| `mount-pneumora` (5) | 13 | `mp-13` | Understanding the non-CMV Interface; Vent Lab; 20; 5 | true |
| `mount-pneumora` (5) | 14 | `mp-14` | Understanding the non-CMV Rationale; Quest; 20; 10 | true |
| `mount-pneumora` (5) | 15 | `mp-final-exam` | Mount Pneumora Final Exam; Quiz; 20; 0 | false |
| `alveolar-highlands` (6) | 1 | `ah-01` | DOPE and Other Considerations for Airway Emergencies; Video; 10; 1 | true |
| `alveolar-highlands` (6) | 2 | `ah-02` | UE in the CT Scanner; Clinical Case Vignette; 15; 3 | true |
| `alveolar-highlands` (6) | 3 | `ah-03` | Intubating an Asthmatic; Clinical Case Vignette; 15; 3 | true |
| `alveolar-highlands` (6) | 4 | `ah-04` | ARDS: Capturing at Peak Illness; Clinical Case Vignette; 15; 3 | true |
| `alveolar-highlands` (6) | 5 | `ah-05` | Extubation Readiness; Clinical Case Vignette; 15; 3 | true |
| `alveolar-highlands` (6) | 6 | `ah-06` | Alarm Alert: Low MV; Vent Lab; 10; 5 | true |
| `alveolar-highlands` (6) | 7 | `ah-07` | Vent Alarms; Quiz; 10; 3 | true |
| `alveolar-highlands` (6) | 8 | `ah-08` | Blood Gas Analysis and Intervention; Quiz; 10; 3 | true |
| `alveolar-highlands` (6) | 9 | `ah-09` | BVM (RT); Quest; 15; 10 | true |
| `alveolar-highlands` (6) | 10 | `ah-10` | Blood Gas Interpretation (Provider); Quest; 15; 10 | true |
| `alveolar-highlands` (6) | 11 | `ah-11` | ERT (RT); Quest; 15; 10 | true |
| `alveolar-highlands` (6) | 12 | `ah-final-exam` | Alveolar Highlands Final Exam; Quiz; 20; 0 | false |

The validator SHALL compare the release's set and order of slots with this manifest before installation. The 80 instructional slots (`countsTowardProgress: true`) SHALL be the only slots in the progress denominator; final-exam slots SHALL be excluded from that denominator but SHALL still be required manifest entries. A payload is optional for an explicitly pending or otherwise unavailable slot, but the placeholder descriptor and slot identity SHALL never be optional.

#### Scenario: A release omits or duplicates a roster slot

- **WHEN** a candidate release omits one listed `activityId`, duplicates one, changes its sequence, or adds an unlisted activity
- **THEN** release validation SHALL fail before publication or installation and SHALL identify the roster difference

#### Scenario: A roster slot has a missing or invalid payload

- **WHEN** a listed slot has no payload or its payload fails type/media validation
- **THEN** the catalog SHALL retain the slot and placeholder metadata by stable `activityId`, expose it as unavailable/Coming Soon, and SHALL not mark it completable merely because it is in the roster

#### Scenario: A release declares final exams incorrectly

- **WHEN** a release has zero, multiple, or non-Quiz final-exam slots for an island
- **THEN** release validation SHALL fail and SHALL not install the release

### Requirement: Video completion and offline quiz media SHALL be validated in the catalog

Every Video payload SHALL declare exactly one deterministic `completionCondition`: either `ended` or `watchedFraction` with a numeric threshold strictly greater than 0 and at most 1. The validator SHALL reject a missing, ambiguous, non-finite, or out-of-range condition. Quiz prompts and options MAY carry `promptMediaRef` or `optionMediaRef` values, but each reference SHALL resolve to a packaged release asset by hash or stable asset ID and SHALL include non-empty accessible text (`altText` or equivalent) in the payload. A missing asset or missing accessible text SHALL make that quiz slot unavailable rather than requiring a network request or rendering an inaccessible image.

#### Scenario: A Video payload lacks a valid completion condition

- **WHEN** a Video record omits `completionCondition` or declares an invalid watched-fraction threshold
- **THEN** catalog validation SHALL quarantine the record as unavailable, SHALL identify the condition error, and SHALL not permit completion

#### Scenario: A CXR quiz is packaged for offline use

- **WHEN** a Quiz prompt or option includes a CXR or other image media reference with packaged bytes and required accessible text
- **THEN** the learner SHALL be able to resolve that media and text from the installed release without a network request

#### Scenario: A quiz image is missing or inaccessible

- **WHEN** an image reference is absent from the packaged release, cannot be hash-verified, or lacks accessible text
- **THEN** the affected quiz SHALL be shown as unavailable/Coming Soon and SHALL not be started or scored as a completed activity