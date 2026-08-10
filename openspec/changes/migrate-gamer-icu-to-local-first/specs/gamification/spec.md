## Purpose

Define privacy-preserving, locally durable PEEP Points and streak behavior so every learner action remains fair, repeatable, and auditable without sending participant-level game data to a cloud service.

## ADDED Requirements

### Requirement: Award the validated first-completion value exactly once
The gamification domain SHALL accept a first completion only with a validated activity completion award bound to the stable activity identity, active content release, and `studyConfigurationVersion`. For a non-quiz activity, the award SHALL equal its nonnegative configured activity value from the validated activity record bound to that approved release and configuration. For a Quiz or Final Exam, the award SHALL equal the validated quiz result `floor(configuredValue*K/N)`, where `K` is the correct-answer count and `N` is the valid-question count, including a result of zero. The completion SHALL create exactly one committed activity first-completion contributor; gamification SHALL not add the configured value separately or create another contributor for the same completion.

#### Scenario: A non-quiz first completion uses its configured value
- **GIVEN** an enrolled participant has no committed completion for a valid non-quiz activity whose approved configuration version supplies `configuredValue` 40
- **WHEN** the participant submits valid completion evidence and the local participant record accepts it
- **THEN** the activity SHALL become completed, exactly one activity contributor of 40 PEEP Points SHALL be committed, and the completion and award SHALL be committed together

#### Scenario: A quiz or final-exam result is the sole first-completion award
- **GIVEN** an enrolled participant has no committed completion for a Quiz or Final Exam whose approved configuration supplies `configuredValue` 40 and whose validated result has `K=2` and `N=5`
- **WHEN** gamification accepts that validated result as the completion award
- **THEN** exactly one activity contributor of `floor(40*2/5)` = 16 PEEP Points SHALL be committed, and no additional 40-point contributor SHALL be created

#### Scenario: A zero configured or validated quiz value still credits completion
- **GIVEN** an enrolled participant has no committed completion for a valid activity, including a Quiz or Final Exam with `K=0` and `N=5`
- **WHEN** the valid completion is accepted with a configured or validated award of 0 PEEP Points
- **THEN** the activity SHALL be recorded as completed with one zero-valued activity contributor, without treating the completion as invalid or awarding an unrelated value

#### Scenario: Missing or invalid award inputs block credit
- **GIVEN** the activity value, `studyConfigurationVersion`, or validated quiz result is missing, mismatched, negative, or otherwise invalid
- **WHEN** the participant submits the completion
- **THEN** gamification SHALL reject the affected completion without changing committed completion, points, streak, or daily-cap state and SHALL not guess an award

### Requirement: Use only the approved versioned study configuration
The gamification domain SHALL use a validated institution-approved study configuration identified by `studyConfigurationVersion`. The configuration SHALL provide a nonnegative integer `dailyCompletionCap`, a nonnegative integer `sevenDayBonusAmount`, and an approved `clockPolicy` for local calendar-day decisions. Each activity or streak contributor SHALL retain the configuration version and resolved value used. Missing, invalid, expired, or mismatched configuration SHALL block affected new-completion, daily-cap, streak-transition, or streak-bonus credit rather than using a default or guessed value, while already committed contributors and history SHALL remain readable and unchanged.

#### Scenario: Valid configuration supplies cap and bonus values
- **GIVEN** the active approved `studyConfigurationVersion` supplies `dailyCompletionCap` 3 and `sevenDayBonusAmount` 10
- **WHEN** a valid new completion or seven-day streak transition is evaluated
- **THEN** the operation SHALL use exactly those versioned values and SHALL record their configuration version with the affected contributor or cap decision

#### Scenario: Missing configuration blocks only the affected credit
- **GIVEN** the participant has committed history but the active configuration is missing or invalid
- **WHEN** a new completion or a seven-day streak bonus would require the missing `dailyCompletionCap` or `sevenDayBonusAmount`
- **THEN** the affected credit SHALL be blocked with an actionable unavailable result, no fallback value SHALL be used, and committed history SHALL not be erased or rewritten

### Requirement: Permit repeat practice without point farming
The gamification domain SHALL permit a participant to redo a completed activity for practice while awarding no additional activity PEEP Points, completion credit, daily-cap usage, or streak engagement.

#### Scenario: Repeating a completed activity changes no points
- **GIVEN** an activity is already completed and its first-completion value is included in the participant's total
- **WHEN** the participant redoes and submits that activity again
- **THEN** the practice action SHALL be allowed, the activity SHALL remain uniquely completed, and the total PEEP Points SHALL remain unchanged

#### Scenario: Retrying the same completion is idempotent
- **GIVEN** a completion submission has already been accepted with a stable event identity
- **WHEN** the same submission is delivered again because the participant retries after an interrupted response
- **THEN** the gamification domain SHALL return the prior outcome without another point award, another completion credit, another daily-cap use, or a second streak transition

### Requirement: Preserve the total PEEP Points invariant
The gamification domain SHALL maintain a participant total equal to the sum of exactly one committed activity first-completion contributor for each uniquely credited activity (including zero-valued contributors) and all committed streak-bonus contributors. A validated quiz result is the source of its activity contributor, not an additional contributor. The total and every affected contributor, completion, streak, and cap record SHALL update as one atomic outcome.

#### Scenario: Total equals its committed contributors
- **GIVEN** a participant has committed activity contributors of 40 and 16 PEEP Points and committed streak bonuses of 10 and 10 PEEP Points
- **WHEN** the participant total is displayed or exported for an authorized local collection
- **THEN** the reported total SHALL be exactly 76 PEEP Points and SHALL be reproducible from those committed contributors

#### Scenario: A failed award cannot create a partial total
- **GIVEN** local participant storage fails while accepting a first completion or streak bonus
- **WHEN** the gamification operation reports failure
- **THEN** neither the contributing record nor the total SHALL claim the failed award, and the previously committed total SHALL remain intact for retry

### Requirement: Track qualifying engagement and award one bonus per seven-day cycle
The gamification domain SHALL treat only the first committed, credited activity completion on a local calendar day as streak-qualifying engagement. A credited completion with an award of zero still qualifies. Repeats of completed activities, later same-day completions, app opens, drafts, incomplete attempts, failed or rejected attempts, and failed writes SHALL not qualify. The domain SHALL advance the streak once for each consecutive qualifying calendar day and SHALL commit exactly one `sevenDayBonusAmount` for each completed seven-day cycle when the approved configuration is valid.

#### Scenario: Seven consecutive days award one configured streak bonus
- **GIVEN** a participant has one committed qualifying completion on each of seven consecutive local calendar days and the approved configuration supplies `sevenDayBonusAmount` 10
- **WHEN** the seventh day's completion is accepted
- **THEN** the current streak SHALL be 7 and exactly one 10-PEEP-Point streak-bonus contributor SHALL be committed for that cycle

#### Scenario: Only the first credited completion of a day qualifies
- **GIVEN** the participant has already committed the first credited completion for today
- **WHEN** the participant opens the app, saves a draft, submits an incomplete or failed attempt, repeats a completed activity, or completes another activity today
- **THEN** none of those actions SHALL create another streak transition or consume another day's streak engagement, and the last qualifying local calendar day SHALL remain today

#### Scenario: A zero-point quiz completion still qualifies once
- **GIVEN** a valid Quiz or Final Exam has `K=0`, `N=5`, no prior completion, and valid approved configuration
- **WHEN** its validated completion and zero-point activity contributor are committed today
- **THEN** that first credited completion SHALL count as today's one streak engagement even though it adds 0 activity PEEP Points

#### Scenario: A later complete cycle can earn its own bonus
- **GIVEN** a participant continues qualifying engagement through fourteen consecutive local calendar days
- **WHEN** the fourteenth day is accepted
- **THEN** a second, distinct seven-day-cycle bonus SHALL be committed, while each prior cycle's bonus remains counted exactly once

### Requirement: Reset a streak after a missed calendar day
The gamification domain SHALL reset the effective current streak when the last qualifying engagement is more than one local calendar day before the next qualifying engagement, while treating the new engagement as the first day of a new streak. It SHALL retain the prior committed events, contributors, and history when applying that reset.

#### Scenario: Missing a day resets the streak
- **GIVEN** the participant's last qualifying engagement was three local calendar days ago and the current streak was 6
- **WHEN** the participant records qualifying engagement today
- **THEN** the current streak SHALL be reset to 1 (or 0 before today's event is committed), and no seven-day bonus SHALL be awarded for the missed sequence

#### Scenario: Same-day repeats do not advance the streak
- **GIVEN** the participant already has qualifying engagement committed for today
- **WHEN** another activity is completed today
- **THEN** the current streak SHALL not increment a second time and the last-active calendar day SHALL remain today

### Requirement: Keep participant gamification state local and privacy-bounded
The gamification domain SHALL derive and persist participant-level points, streaks, completion credit, configuration version, and their audit contributors on the participant device, and SHALL NOT transmit those participant-level or linkable records to Supabase.

#### Scenario: Dashboard values come from local committed state
- **GIVEN** a participant opens the learner dashboard while the device has no network connection
- **WHEN** committed local gamification state and the approved `clockPolicy` inputs are available
- **THEN** the dashboard SHALL display the participant's effective streak and total PEEP Points from local state without requiring a cloud read

#### Scenario: Participant-level totals are not cloud-reported
- **GIVEN** an export or reporting operation is requested
- **WHEN** the operation targets Supabase
- **THEN** the gamification domain SHALL refuse to send participant-level points, streaks, completion histories, configuration versions, or linkable identifiers and SHALL permit only an approved aggregate reporting path

### Requirement: Reject invalid or out-of-bound point awards
The gamification domain SHALL reject a completion when its activity identity is unknown, its configured PEEP Points value is negative, its Quiz or Final Exam result is absent or invalid, its configuration is unavailable or mismatched, or its completion evidence is invalid, without changing committed completion, streak, daily-cap, or total state.

#### Scenario: Negative point value is rejected without mutation
- **GIVEN** an activity completion claims a configured value of -1 PEEP Point
- **WHEN** the gamification domain validates the completion
- **THEN** it SHALL reject the operation, leave the participant total, completion, streak, and daily-cap state unchanged, and expose an actionable validation result

#### Scenario: Unknown activity is rejected without mutation
- **GIVEN** a completion event names no activity in the current curriculum
- **WHEN** the event is submitted
- **THEN** it SHALL be rejected and SHALL not consume a daily completion credit, award points, or advance the streak

