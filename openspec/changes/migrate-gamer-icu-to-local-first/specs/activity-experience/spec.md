## Purpose

Define the local-first learner experience for browsing and completing GAMER-ICU's six-island library across every supported activity type.

## ADDED Requirements

### Requirement: The island library SHALL expose complete activity metadata

The island library SHALL present every configured activity for each of the six islands—Lake Mucosa, Interlobar Divides, Valley of Pulmonara, Bronchial Bluffs, Mount Pneumora, and Alveolar Highlands—with its title, supported activity type, estimated time, configured PEEP Points value, ordering, and current completion state.

#### Scenario: A learner opens an island with valid packaged activities

- **WHEN** the learner opens an island whose catalog release contains activities
- **THEN** the library SHALL display all of that island's activities with the required metadata and SHALL not silently omit a valid activity

#### Scenario: An island has no usable activity records

- **WHEN** the learner opens an island for which no usable activity records are available
- **THEN** the library SHALL explain that the island content is unavailable and SHALL not report the island or any activity as completed

### Requirement: Activity selection SHALL use the matching experience and show progress

When a learner selects an activity, the activity experience SHALL open the experience that matches its declared type, display the activity's progress, and restore any locally recorded progress or completion state for that activity.

#### Scenario: A learner selects each supported activity type

- **WHEN** the learner selects a Video, Reading/Graphic, Quiz, Clinical Case Vignette, Quest, or Vent Lab activity
- **THEN** the activity experience SHALL open the corresponding experience and show the learner the activity progress and completion state

#### Scenario: An activity type or payload cannot be used

- **WHEN** an activity declares an unsupported type or cannot be matched to a usable payload
- **THEN** the experience SHALL show an unavailable-content state without crashing and SHALL prevent a successful completion from being recorded

### Requirement: Video activities SHALL record completion and first-completion points

A Video activity SHALL allow the learner to consume its packaged media and SHALL mark the activity complete only after the activity's defined completion condition is met; its first successful completion SHALL produce the configured PEEP Points result, while later practice SHALL not produce additional first-completion points.

#### Scenario: A learner completes a video

- **WHEN** the learner meets the completion condition for a valid Video activity
- **THEN** the activity SHALL record a completed activity event locally and SHALL report the configured first-completion PEEP Points result

#### Scenario: Video media cannot be consumed

- **WHEN** the packaged video cannot be loaded or playback fails before the completion condition is met
- **THEN** the experience SHALL show a clear retry or unavailable state and SHALL not mark the Video activity complete

### Requirement: Reading and Graphic activities SHALL require one confirmation question

A Reading/Graphic activity SHALL display its complete body content and one confirmation question, and SHALL require a correct response to that question before marking the activity complete or producing its first-completion PEEP Points result.

#### Scenario: A learner answers the reading confirmation correctly

- **WHEN** the learner submits the correct response to the activity's confirmation question
- **THEN** the activity SHALL record completion locally and SHALL report the activity's configured first-completion PEEP Points result

#### Scenario: A learner answers the reading confirmation incorrectly

- **WHEN** the learner submits an incorrect response to the confirmation question
- **THEN** the experience SHALL identify the response as incorrect, allow the learner to try again, and SHALL leave the activity incomplete

#### Scenario: A reading activity lacks its confirmation question

- **WHEN** a Reading/Graphic activity does not contain exactly one usable confirmation question
- **THEN** the experience SHALL treat the activity as unavailable content and SHALL not award completion or PEEP Points for it

### Requirement: Clinical Case Vignette activities SHALL support management decisions and SBAR

A Clinical Case Vignette activity SHALL present its clinical scenario, accept the learner's content-defined medical management decisions, and provide an SBAR communication interaction covering Situation, Background, Assessment, and Recommendation.

#### Scenario: A learner works through a clinical case

- **WHEN** the learner opens a valid Clinical Case Vignette and submits its required decisions and SBAR response
- **THEN** the experience SHALL show the resulting case feedback or outcome and SHALL make the learner's completion state available locally

#### Scenario: A learner submits an incomplete SBAR response

- **WHEN** the learner attempts to finish a case without all required SBAR components or decisions
- **THEN** the experience SHALL identify what remains incomplete and SHALL not mark the case as successfully completed

### Requirement: Quest activities SHALL use offline supervisor validation without exposing secrets

A Quest activity SHALL present its real-life task instructions and supervisor role, and SHALL provide a privacy-compatible offline supervisor-validation interaction that does not depend on a cloud password API. Any validation secret or equivalent approval material SHALL remain outside learner-readable activity content and SHALL never be sent to Supabase.

#### Scenario: A supervisor confirms a completed quest locally

- **WHEN** the learner completes the real-life task and a supervisor performs the permitted local confirmation
- **THEN** the Quest SHALL record successful completion locally without requiring network access or revealing supervisor-only validation material to the learner

#### Scenario: Quest validation is missing, rejected, or canceled

- **WHEN** no supervisor is present or the local validation is invalid, rejected, or canceled
- **THEN** the experience SHALL explain that confirmation is still required, SHALL allow a later retry, and SHALL leave the Quest incomplete

### Requirement: Vent Lab activities SHALL provide an interactive ventilator simulation

A Vent Lab activity SHALL provide an interactive ventilator simulation in which the learner can manipulate the controls defined by the activity, observe resulting ventilator or patient-state feedback, and complete the activity's defined learning objective.

#### Scenario: A learner changes valid simulation controls

- **WHEN** the learner changes a supported control in a valid Vent Lab activity
- **THEN** the simulation SHALL update the represented state or feedback and SHALL preserve the learner's progress locally

#### Scenario: A learner enters an unsupported simulation value

- **WHEN** the learner enters a value outside the activity's supported range or an otherwise invalid control combination
- **THEN** the simulation SHALL show an understandable validation response, SHALL keep the activity usable, and SHALL not claim that the objective was completed

### Requirement: Activity attempts and completions SHALL remain local and durable

The activity experience SHALL record each meaningful activity attempt and completion locally with the activity identity, outcome, event time, and content release version, and SHALL operate without participant-level content, progress, or attempt APIs. Participant-level or linkable activity data MUST NOT be sent to Supabase.

#### Scenario: A learner works offline

- **WHEN** the learner starts, submits, or completes an activity while the network is unavailable
- **THEN** the experience SHALL continue using the installed content and SHALL retain the resulting attempt or completion locally for later collection

#### Scenario: A local record cannot be confirmed

- **WHEN** the device cannot confirm that an activity attempt or completion was saved locally
- **THEN** the experience SHALL tell the learner that the result is not yet durable, SHALL preserve the available in-progress state for retry, and SHALL not claim durable completion or points

### Requirement: The activity library SHALL be driven by the authoritative roster

The activity library SHALL iterate the installed release's versioned six-island roster in manifest sequence, rather than deriving its list from payloads that happen to validate. It SHALL expose every roster `activityId`, including a placeholder descriptor for a missing or invalid payload, and SHALL route a usable payload by its declared type. A slot without a usable payload SHALL be visibly unavailable/Coming Soon, SHALL remain addressable by its stable ID, and SHALL not be silently omitted or completed.

#### Scenario: A roster slot has no payload

- **WHEN** the learner opens an island whose roster contains a slot with an absent or quarantined payload
- **THEN** the library SHALL show that slot using its placeholder descriptor and unavailable state, SHALL keep other slots usable, and SHALL reject completion for the unavailable slot

### Requirement: Video completion SHALL use the validated payload condition

The Video experience SHALL require the payload's validated `completionCondition`, which SHALL be exactly `ended` or a `watchedFraction` threshold in the inclusive range `(0, 1]`. For `ended`, completion SHALL be emitted only after the packaged media emits its terminal ended state. For `watchedFraction`, completion SHALL be emitted only after the learner has actually consumed the configured fraction of media playback; seeking over unconsumed ranges SHALL not satisfy the condition. Missing, invalid, or ambiguous conditions SHALL route the slot to unavailable content and SHALL never produce completion or first-completion points.

#### Scenario: A learner reaches the configured watched fraction

- **GIVEN** a valid Video payload declares `watchedFraction: 0.8`
- **WHEN** the player records monotonic consumed playback covering at least 80 percent of the media
- **THEN** the experience SHALL emit one local completion event and SHALL not wait for or infer a wall-clock duration

#### Scenario: A learner seeks past unconsumed video

- **GIVEN** a Video payload declares a watched-fraction condition
- **WHEN** the learner seeks over a range without consuming it
- **THEN** the experience SHALL leave the activity incomplete until the configured consumed fraction is reached

#### Scenario: A Video payload has no usable condition

- **WHEN** the installed Video payload omits or fails validation of `completionCondition`
- **THEN** the experience SHALL show unavailable/Coming Soon and SHALL prevent completion, points, and progression credit

### Requirement: Activity events SHALL produce bounded monotonic duration evidence

For every meaningful attempt and every completion event, the activity experience SHALL produce an `elapsedDurationMs` field and `durationEvidenceStatus`. When monotonic evidence is available, `elapsedDurationMs` SHALL be an integer with `durationEvidenceSource: monotonic-active-time`; when it is unavailable, `elapsedDurationMs` SHALL be null and the status SHALL be `unavailable` rather than a guessed value. The producer SHALL accumulate only active intervals from a monotonic timer, pause accumulation while the activity is not active, enforce `0 <= elapsedDurationMs <= maxElapsedDurationMs` from the installed release policy for non-null values, and keep the value non-decreasing within an attempt. Wall-clock event timestamps MAY order events but SHALL never determine or inflate `elapsedDurationMs`; retries and duplicate submissions SHALL not double-count an already committed interval. The bounded field MAY be used by an approved time-spent report, while the raw participant event remains local.

#### Scenario: An attempt pauses and resumes offline

- **WHEN** a learner works on an activity, leaves it paused, and later resumes without network access
- **THEN** the next attempt or completion event SHALL include the accumulated active monotonic duration, SHALL exclude the paused interval, and SHALL remain within `maxElapsedDurationMs`

#### Scenario: A clock rollback occurs during an activity

- **WHEN** the device wall clock moves backward or forward while an activity is open
- **THEN** the producer SHALL leave `elapsedDurationMs` monotonic and bounded, SHALL not use the wall-clock jump as study time, and SHALL still record the event locally if the durable write succeeds

#### Scenario: Duration evidence cannot be produced

- **WHEN** no supported monotonic timer is available or its reading is invalid
- **THEN** the activity SHALL not claim a trusted duration value, SHALL record the attempt/completion as locally available only with an explicit duration-evidence-unavailable status, and SHALL not substitute wall-clock elapsed time

### Requirement: Quiz prompt and option media SHALL stay packaged and accessible

When a Quiz payload supplies an optional prompt or option media reference, the experience SHALL resolve it from the installed release and expose the payload's required accessible text (`altText` or equivalent) to assistive technology and as the offline fallback. A missing, unverifiable, or inaccessible media reference SHALL make the affected Quiz unavailable rather than trigger a participant-data or content API request.

#### Scenario: A CXR option is used offline

- **WHEN** a packaged Quiz option references a CXR with a verified local asset and non-empty accessible text
- **THEN** the quiz SHALL render the image offline and SHALL expose the accessible text to a learner using a screen reader or without the image

#### Scenario: A CXR reference is not packaged

- **WHEN** a Quiz prompt or option references media that is absent or fails hash verification
- **THEN** the experience SHALL show the Quiz as unavailable/Coming Soon and SHALL not allow a completed score or activity completion