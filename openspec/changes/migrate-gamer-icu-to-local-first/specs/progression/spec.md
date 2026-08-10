## Purpose

Define the six-island, 90-day progression contract with cumulative unlocks, transparent completion gates, and a daily completion limit while keeping time-dependent learner state locally controlled and privacy-safe.

## ADDED Requirements

### Requirement: Apply cumulative island unlock windows from enrollment day
The progression domain SHALL unlock Islands 1 (Lake Mucosa) and 2 (Interlobar Divides) on enrollment days 0 through 30, SHALL additionally unlock Islands 3 (Valley of Pulmonara) and 4 (Bronchial Bluffs) on days 31 through 60, and SHALL additionally unlock Islands 5 (Mount Pneumora) and 6 (Alveolar Highlands) on days 61 through 90.

#### Scenario: Initial window unlocks only the first pair
- **GIVEN** a participant's enrollment day count is 0
- **WHEN** the participant opens the island map
- **THEN** Lake Mucosa and Interlobar Divides SHALL be active and tappable, while the other four islands SHALL remain locked

#### Scenario: Day 30 remains in the initial window
- **GIVEN** a participant's enrollment day count is 30
- **WHEN** island availability is calculated
- **THEN** only Islands 1 and 2 SHALL be newly available under the time schedule

#### Scenario: Day 31 adds the second pair
- **GIVEN** a participant's enrollment day count is 31
- **WHEN** island availability is calculated
- **THEN** Islands 1 through 4 SHALL be available and Islands 5 and 6 SHALL remain locked

#### Scenario: Day 60 remains in the second window
- **GIVEN** a participant's enrollment day count is 60
- **WHEN** island availability is calculated
- **THEN** Islands 1 through 4 SHALL be available and Islands 5 and 6 SHALL remain locked

#### Scenario: Day 61 adds the final pair
- **GIVEN** a participant's enrollment day count is 61
- **WHEN** island availability is calculated
- **THEN** all six named islands SHALL be available

#### Scenario: The full curriculum remains available after day 90
- **GIVEN** a participant has reached day 90 and all six islands have been unlocked
- **WHEN** the participant returns on a later day
- **THEN** all six islands SHALL remain accessible rather than being relocked

### Requirement: Preserve previously unlocked islands
The progression domain SHALL persist each island's unlocked state so an island that was previously unlocked remains accessible even when the current enrollment-day window no longer includes its original unlock range.

#### Scenario: A previously unlocked island survives a time-window change
- **GIVEN** Islands 1 through 4 were previously unlocked for a participant
- **WHEN** a later progression calculation is performed at a time that would not newly unlock Island 3 or 4
- **THEN** Islands 3 and 4 SHALL remain active and tappable

#### Scenario: Missing or invalid enrollment timing fails closed
- **GIVEN** the participant has no valid enrollment day count and has no previously unlocked islands
- **WHEN** the map requests availability
- **THEN** the progression domain SHALL mark time-based unlock status unavailable or provisional, SHALL not invent a day or unlock islands, and SHALL expose the reason to the participant

### Requirement: Expose device-time limitations for time-dependent progression

The progression domain SHALL apply the approved `clockPolicy` from the versioned study configuration when deriving enrollment-day unlocks, streak/cap dates, or any other wall-clock-dependent state. It SHALL identify whether an enrollment-day calculation is based on an unverified device clock, and SHALL NOT present a clock-dependent unlock, relock, or day transition as authoritative when the clock is unavailable or conflicts with committed observations.

#### Scenario: Normal device time is visibly labeled

- **GIVEN** the participant's enrollment day is calculated from the device-reported date under the approved `clockPolicy` and no independent trusted time is available
- **WHEN** the participant views the island map
- **THEN** the map SHALL expose that the time basis is device-reported and unverified rather than implying an authoritative study date

#### Scenario: A clock rollback does not silently grant or revoke access

- **GIVEN** a committed observation indicates a later device date and the device now reports an earlier date
- **WHEN** progression is recalculated under the approved `clockPolicy`
- **THEN** previously unlocked islands SHALL remain accessible, new time-based unlocks SHALL be marked unverified or withheld, and the participant SHALL see a clock-integrity warning

### Requirement: Calculate and display completion percentage from authoritative roster slots

The progression domain SHALL calculate an island's completion percentage as the number of uniquely completed instructional roster slots (`countsTowardProgress: true`) divided by the total number of those authoritative roster slots times 100. The denominator SHALL come from the installed `rosterVersion` even when a slot's payload is missing, invalid, unsupported, or unavailable; it SHALL not be reduced to currently valid or renderable payloads. Final-exam roster slots SHALL be excluded from this denominator. The result SHALL remain within 0 to 100 percent and SHALL be displayed whenever the final exam is locked or unlocked.

#### Scenario: Displayed percentage matches unique roster-slot completion

- **GIVEN** an island's authoritative roster contains 10 instructional slots and 3 distinct slots are completed
- **WHEN** the participant views that island's progress
- **THEN** the displayed completion percentage SHALL be 30 percent and SHALL be derived from 3 divided by the roster count rather than from attempts, repeat practice, or payload validity

#### Scenario: Duplicate completion does not inflate progress

- **GIVEN** an island's roster contains 5 instructional slots and one slot has already been completed
- **WHEN** the participant repeats that activity three times
- **THEN** the completed-slot count SHALL remain 1 and the displayed percentage SHALL remain 20 percent

#### Scenario: Invalid payloads remain in the denominator

- **GIVEN** an island's authoritative roster contains 10 instructional slots, 7 valid slots are completed, and 3 slots have missing or invalid payloads
- **WHEN** the participant requests island progress
- **THEN** the displayed percentage SHALL be 70 percent, the unavailable slots SHALL remain addressable, and the final exam SHALL remain locked

#### Scenario: An empty payload set cannot unlock an exam

- **GIVEN** the roster is present but no instructional slot has a usable payload or committed completion
- **WHEN** island progress is requested
- **THEN** the displayed percentage SHALL be 0 percent or unavailable with an explanation, and the final exam SHALL remain locked without a divide-by-zero failure

### Requirement: Gate exactly one per-island Quiz Final Exam at an inclusive 80 percent threshold

For each island, the progression domain SHALL use the roster's exactly one `*-final-exam` slot as the sole Final Exam. That slot SHALL be exposed only when the underlying authoritative-roster completion ratio is at least 80 percent (inclusive), SHALL remain locked below 80 percent, and SHALL never be counted as an instructional completion. When exposed, it SHALL route through the existing Quiz assessment attempt, randomization, response validation, and scoring path, and SHALL record local final-exam completion and clearance state. Quiz scoring SHALL supply any configured first-completion award; progression SHALL not implement a second exam scorer or award path. A pass/clearance threshold SHALL be read only from the approved `studyConfigurationVersion` when one is supplied; when no threshold is supplied, the system SHALL record completion and an explicit `clearance: not-configured` outcome without inventing a pass threshold.

#### Scenario: Exactly 80 percent exposes the one roster Final Exam

- **GIVEN** an island's authoritative roster has 5 instructional slots and 4 distinct slots are completed
- **WHEN** the participant requests the island status
- **THEN** the displayed percentage SHALL be 80 percent, exactly one roster Final Exam SHALL become available, and its activity type SHALL be Quiz

#### Scenario: A value below 80 percent keeps the Final Exam locked

- **GIVEN** an island's authoritative roster has 10 instructional slots and 7 distinct slots are completed
- **WHEN** the participant requests the island status
- **THEN** the displayed percentage SHALL be 70 percent, the sole Final Exam SHALL remain locked and non-interactive, and no exam attempt SHALL be started

#### Scenario: Display rounding cannot bypass the threshold

- **GIVEN** an island's unrounded completion ratio is below 80 percent even if a coarse display would round it to 80 percent
- **WHEN** Final-Exam access is evaluated
- **THEN** the sole roster Final Exam SHALL remain locked until the underlying ratio reaches at least 80 percent

#### Scenario: The Final Exam reuses Quiz attempt and scoring

- **GIVEN** an island has reached the inclusive 80 percent gate and its roster Final Exam is a valid Quiz
- **WHEN** the participant answers and submits that exam
- **THEN** the system SHALL persist the type-appropriate Quiz attempt, score, content version, completion result, and clearance result through the existing Quiz path, and SHALL not use a separate exam scoring or response format

#### Scenario: No study pass threshold is invented

- **GIVEN** the approved `studyConfigurationVersion` supplies no Final-Exam pass or clearance threshold
- **WHEN** the participant submits a valid Final-Exam Quiz
- **THEN** the system SHALL record `finalExamCompletion` and `clearance: not-configured`, SHALL retain the Quiz score, and SHALL not label the result passed or failed using an invented threshold

#### Scenario: A configured pass threshold is honored

- **GIVEN** the approved `studyConfigurationVersion` supplies a Final-Exam clearance threshold
- **WHEN** the participant submits a valid Final-Exam Quiz
- **THEN** the recorded clearance SHALL be derived from that configured threshold and the Quiz score, with no hard-coded replacement threshold

### Requirement: Enforce the approved daily cap on new curriculum completions

The progression domain SHALL consume `dailyCompletionCap` from the approved study configuration identified by `studyConfigurationVersion`, prevent a participant from receiving more than that number of new activity-completion credits in one calendar day, report when the cap is reached, and permit repeat practice only without additional completion credit or points. It SHALL not invent a cap or silently use a value from another configuration version.

#### Scenario: The daily cap blocks the next new completion

- **GIVEN** `dailyCompletionCap` is 3 in the active `studyConfigurationVersion` and the participant has already committed 3 distinct new instructional-slot completions today
- **WHEN** the participant submits a valid completion for a fourth not-yet-completed activity today
- **THEN** the completion SHALL be rejected or deferred with an observable daily-cap status, and no progress, streak, or PEEP Points SHALL be added

#### Scenario: A zero daily limit blocks all new credit

- **GIVEN** `dailyCompletionCap` is 0 in the active `studyConfigurationVersion`
- **WHEN** the participant submits a valid completion for an activity not yet completed
- **THEN** the progression domain SHALL grant no completion credit and SHALL explain that the daily limit has been reached

#### Scenario: Practice does not bypass the cap

- **GIVEN** the participant has reached today's configured cap and has previously completed an activity
- **WHEN** the participant redoes that activity
- **THEN** practice MAY remain available, but it SHALL not raise the day's new-completion count, island percentage, final-exam status, streak, or PEEP Points

#### Scenario: A failed commit does not consume the cap

- **GIVEN** a new completion is attempted before the configured daily limit but local participant storage cannot commit it
- **WHEN** the operation reports a storage failure
- **THEN** the day's committed completion count SHALL be unchanged, and a later retry SHALL be evaluated against the same `studyConfigurationVersion` and remaining capacity

### Requirement: Completion events SHALL carry bounded monotonic duration evidence into local progression

When progression accepts an activity attempt or completion event, the event SHALL include `elapsedDurationMs` and `durationEvidenceStatus` produced by the activity experience. A non-null value SHALL be an integer with `durationEvidenceSource: monotonic-active-time` and SHALL satisfy the installed release's `0 <= elapsedDurationMs <= maxElapsedDurationMs` policy; an unavailable reading SHALL be represented as `elapsedDurationMs: null` with status `unavailable`. Progression SHALL preserve bounded values for an approved time-spent report without deriving them from wall-clock timestamps. Missing, invalid, decreasing, or over-cap duration evidence SHALL be marked unavailable and SHALL never be replaced with wall-clock elapsed time; it SHALL not turn an otherwise valid local completion into participant-level cloud data.

#### Scenario: A completion carries bounded duration evidence

- **WHEN** a valid activity completion is committed locally
- **THEN** the progression record SHALL retain the producer's bounded monotonic `elapsedDurationMs` and evidence status alongside the stable activity ID and SHALL use it only through the approved local reporting path

#### Scenario: Invalid duration evidence is not trusted

- **WHEN** an incoming event has a negative, decreasing, non-integer, or over-cap `elapsedDurationMs`, or claims a wall-clock source
- **THEN** progression SHALL mark duration evidence unavailable, SHALL not substitute a wall-clock duration, and SHALL leave participant-level records local

### Requirement: Make completion transitions idempotent and locally privacy-bounded

The progression domain SHALL accept a valid new completion at most once for a stable event identity, SHALL calculate unlocks and gates from committed local participant state, and SHALL NOT send participant-level progression records or linkable completion data to Supabase.

#### Scenario: Retrying a completion changes no progression twice

- **GIVEN** a new completion has already been committed for an activity with a stable event identity
- **WHEN** the same event is submitted again
- **THEN** the progression domain SHALL return the existing completion outcome without increasing the completed count, daily count, percentage, or unlock state a second time

#### Scenario: Participant progress is not sent to the aggregate service

- **GIVEN** a reporting request includes island completion, unlock, or final-exam state for one participant
- **WHEN** the request would send that state to Supabase
- **THEN** the progression domain SHALL refuse the participant-level or linkable record and SHALL allow only an approved genuinely non-identifiable aggregate
