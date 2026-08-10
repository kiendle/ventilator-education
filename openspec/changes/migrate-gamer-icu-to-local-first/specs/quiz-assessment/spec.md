## Purpose

Define varied, randomized, immediately scored quiz behavior while keeping every learner attempt on the participant device.

## ADDED Requirements

### Requirement: The Quiz Module SHALL support four question interaction types

The Quiz Module SHALL support Multiple Choice (MCQ), Drag and Drop, Matching, and Fill-in-the-Blank with word bank questions, and SHALL provide the response interaction appropriate to each type.

#### Scenario: A learner answers supported question types

- **WHEN** a quiz contains an MCQ, Drag and Drop, Matching, or Fill-in-the-Blank with word bank question
- **THEN** the Quiz Module SHALL present that question's prompt and controls, accept the type-appropriate response, and evaluate the response against the question's content-defined answer

#### Scenario: A quiz contains an unsupported question type

- **WHEN** a quiz contains a question type outside the four supported types
- **THEN** the Quiz Module SHALL identify the question as unavailable content and SHALL not silently score it as correct or incorrect

### Requirement: Each quiz launch SHALL randomize questions and answer options

When a quiz is launched, the Quiz Module SHALL randomize the order of its questions and the order of answer options or response items wherever the question type permits, while preserving every question, every option, and every correct association.

#### Scenario: A learner starts a quiz and then retakes it

- **WHEN** the learner launches a quiz or starts a new attempt after completing or abandoning an earlier attempt
- **THEN** the Quiz Module SHALL present a newly randomized question and option arrangement for the new attempt without dropping or duplicating content

#### Scenario: A quiz cannot be meaningfully reordered

- **WHEN** a quiz has one question or a question has only one valid option order
- **THEN** the Quiz Module SHALL retain the valid content, preserve its answer association, and SHALL still treat the launch as a valid quiz attempt

### Requirement: Quiz answers SHALL receive immediate correctness feedback

After a learner submits an answer, the Quiz Module SHALL immediately indicate whether that answer is correct or incorrect before allowing the learner to proceed to the next question or finish the quiz.

#### Scenario: A learner submits a valid answer

- **WHEN** the learner submits a complete response to the current question
- **THEN** the Quiz Module SHALL show an unambiguous correct or incorrect result and SHALL retain that result for the current attempt

#### Scenario: A learner submits an incomplete response

- **WHEN** the learner attempts to submit without selecting, arranging, matching, or filling all required response values
- **THEN** the Quiz Module SHALL explain what is missing, SHALL not advance the question, and SHALL not record the response as a scored answer

### Requirement: Quiz scores and validated completion awards SHALL reflect correct answers
For a Quiz or Final Exam with `N` valid questions and `K` correct answers, the Quiz Module SHALL report a score of `K` out of `N` and SHALL produce a validated activity completion award of `floor(configuredValue*K/N)`. `configuredValue` and `studyConfigurationVersion` SHALL come from the approved versioned study configuration, the result SHALL include the activity identity, configuration version, `configuredValue`, `K`, `N`, score, and award, and the award SHALL include zero when `K=0`. The validated result SHALL be the sole first-completion award supplied to gamification; the Quiz Module SHALL not also emit the unscaled configured value.

#### Scenario: A learner submits a quiz with mixed results
- **GIVEN** an approved configuration supplies `configuredValue` 40 for a valid Quiz with five valid questions
- **WHEN** the learner submits a complete attempt with `K=3` correct answers
- **THEN** the Quiz Module SHALL report `K=3`, `N=5`, the score, and a validated award of `floor(40*3/5)` = 24, with each answer counted once

#### Scenario: A valid quiz with zero correct answers still produces a completion award of zero
- **GIVEN** an approved configuration supplies `configuredValue` 40 for a valid Quiz or Final Exam with `N=5`
- **WHEN** the learner submits a complete attempt with `K=0`
- **THEN** the Quiz Module SHALL report the valid `0/5` result and a validated award of 0, SHALL not substitute a positive configured value, and SHALL leave the completion eligible for the local first-completion transaction

#### Scenario: The validated result is the sole gamification award source
- **GIVEN** gamification receives a valid result with `configuredValue` 40, `K=2`, and `N=5` for an uncompleted Quiz or Final Exam
- **WHEN** the result is accepted as the activity completion award
- **THEN** gamification SHALL commit exactly one first-completion contributor of 16 PEEP Points and SHALL not add a separate 40-point contributor

#### Scenario: A quiz has no valid questions
- **WHEN** a quiz has zero valid questions or cannot produce a complete answer set
- **THEN** the Quiz Module SHALL treat the quiz as unavailable content, SHALL not divide by zero or fabricate `K`, `N`, a score, or an award, and SHALL not award quiz PEEP Points

#### Scenario: Missing or invalid configuration blocks the affected quiz credit
- **GIVEN** `studyConfigurationVersion` or its nonnegative `configuredValue` is missing, invalid, expired, or mismatched with the active release
- **WHEN** a quiz attempt is submitted
- **THEN** the Quiz Module SHALL retain any safe attempt result for retry but SHALL not produce a validated completion award or claim completion, and SHALL not guess a configuration value

### Requirement: Quiz results SHALL bind to the approved versioned study configuration
The Quiz Module SHALL resolve `studyConfigurationVersion` from the validated institution-approved local study configuration and SHALL retain that binding in every validated result. That configuration SHALL provide nonnegative integer `dailyCompletionCap`, nonnegative integer `sevenDayBonusAmount`, and approved `clockPolicy` fields alongside the activity's `configuredValue`; the Quiz Module SHALL not accept cap, bonus, clock, or award values from participant responses. Missing or invalid `configuredValue` or configuration version SHALL block the quiz's first-completion award, missing or invalid `dailyCompletionCap` SHALL block the affected new-completion credit, and missing or invalid `sevenDayBonusAmount` or `clockPolicy` SHALL block only the affected time-dependent daily-cap, streak, or bonus credit, without guessing or rewriting committed history.

#### Scenario: Quiz uses the same approved configuration version as gamification
- **GIVEN** an approved `studyConfigurationVersion` supplies the quiz's `configuredValue`, `dailyCompletionCap`, `sevenDayBonusAmount`, and `clockPolicy`
- **WHEN** the Quiz Module emits a validated result
- **THEN** the result SHALL carry that exact configuration version and award inputs for the local gamification transaction, and SHALL not create a second point contributor

#### Scenario: A missing cap or bonus does not become a guessed quiz value
- **GIVEN** the quiz result is valid but its approved configuration lacks or invalidates `dailyCompletionCap` or `sevenDayBonusAmount`
- **WHEN** downstream local credit is evaluated
- **THEN** the affected new-completion or streak-bonus credit SHALL be blocked with an actionable unavailable result, while no guessed cap or bonus SHALL be included in the quiz result

### Requirement: Quiz attempts SHALL be stored locally with their content version

The Quiz Module SHALL store each submitted attempt locally with its activity identity, content-release identity and version, approved `studyConfigurationVersion`, configured activity value, each question's stable identity, type-appropriate submitted response values (the selected option for MCQ, ordered item identifiers for Drag and Drop, item-to-target associations for Matching, and submitted word-bank values for Fill-in-the-Blank), question outcomes, correct-answer count `K`, valid-question count `N` (`total_questions`), score, validated PEEP Points award result, and event time. The durable local record SHALL remain available after the learner leaves or reloads the activity and SHALL survive an explicit authorized local export/import round trip. Participant-level or linkable quiz attempts, including response values, MUST NOT be sent to Supabase or copied into learner-readable packaged content.

#### Scenario: A learner submits a quiz while offline

- **WHEN** the learner completes and submits a quiz without network access
- **THEN** the Quiz Module SHALL calculate the result and retain the attempt locally without requiring a Supabase content or attempt service

#### Scenario: A submitted attempt survives reload and local export round trip

- **GIVEN** a completed attempt with type-appropriate responses for the supported question types
- **WHEN** the learner reloads the activity and completes an explicit authorized local export/import round trip for that attempt
- **THEN** the Quiz Module SHALL restore the same activity identity, content-release identity and version, `studyConfigurationVersion`, configured activity value, question identities, submitted response values, question outcomes, `K`, `N` (`total_questions`), score, validated PEEP Points award, and event time, while keeping the attempt in the encrypted local collection path and out of Supabase and learner-readable packaged content

#### Scenario: Local attempt persistence is temporarily unavailable

- **WHEN** the device cannot confirm that a submitted attempt was saved locally
- **THEN** the Quiz Module SHALL preserve the learner's answers and result for retry, SHALL tell the learner that the attempt is not yet durable, and SHALL not report the attempt as safely recorded

### Requirement: Interrupted quiz attempts SHALL be resumable and retakes SHALL be distinct

The Quiz Module SHALL preserve an in-progress attempt locally, resume it with the same randomized presentation and prior responses, and create a distinct newly randomized attempt when the learner chooses to retake the quiz.

#### Scenario: A learner leaves before submitting

- **WHEN** the learner closes or leaves a quiz after answering only some questions
- **THEN** the Quiz Module SHALL offer to resume the saved attempt with its prior answers, order, and feedback state

#### Scenario: A learner chooses to retake a completed quiz

- **WHEN** the learner starts a retake of a previously submitted quiz
- **THEN** the Quiz Module SHALL preserve the earlier attempt record and SHALL begin a separate attempt with newly randomized questions and options

### Requirement: Quiz answer evaluation SHALL remain tied to the released content

The Quiz Module SHALL evaluate each response against the answer association in the active validated content release and SHALL reject or quarantine an attempt whose question or answer data no longer matches that release.

#### Scenario: A content release changes during an unfinished attempt

- **WHEN** the learner resumes an attempt whose content release is no longer the active release
- **THEN** the Quiz Module SHALL either resume it against its recorded release or explain that the attempt cannot be resumed, and SHALL not silently score it against different answer data

#### Scenario: A response is altered into an invalid shape

- **WHEN** a submitted response cannot be interpreted according to its question type
- **THEN** the Quiz Module SHALL reject that response with a clear error, SHALL leave the attempt available for correction, and SHALL not count it toward the score
