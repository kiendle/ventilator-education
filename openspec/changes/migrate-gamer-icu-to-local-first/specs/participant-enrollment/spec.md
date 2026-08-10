# Participant Enrollment

## Purpose
Provide a private, local-first first-run enrollment experience that lets a nurse begin the GAMER-ICU study without direct identifiers, cloud authentication, or a dependency on network access.

## ADDED Requirements

### Requirement: Local study enrollment SHALL use only a non-identifying study code
The application SHALL create a participant's local study enrollment from a non-identifying study code, SHALL permit the complete enrollment flow to finish offline, and SHALL NOT require or collect a name, email address, password, or cloud account.

#### Scenario: A participant begins enrollment for the first time
- **WHEN** the application has no completed local enrollment and the participant opens it
- **THEN** the application SHALL request a non-identifying study code and SHALL not present name, email, or password fields

#### Scenario: A valid study code is submitted while offline
- **WHEN** the participant submits a study code that satisfies the study-code rules and the device has no network connection
- **THEN** the application MUST accept the code locally and SHALL allow the participant to complete enrollment offline without remote authentication or a network dependency

#### Scenario: A study code is missing or invalid
- **WHEN** the participant submits an empty or malformed study code
- **THEN** the application SHALL keep enrollment incomplete and display a specific correction message without creating a participant record

#### Scenario: A remote service is unavailable during enrollment
- **WHEN** a valid study code is submitted while a remote host is unreachable
- **THEN** the application MUST continue the enrollment flow locally through completion without waiting for a remote service, and SHALL not send the study code or any participant data to that host

### Requirement: The enrollment flow SHALL present the mission introduction before completion
After a valid local study code is accepted, the application SHALL present the GAMER-ICU mission narrative in a cinematic scrolling-text introduction before marking enrollment complete.

#### Scenario: A valid code advances to the mission introduction
- **WHEN** the participant submits a valid study code
- **THEN** the application SHALL show the scrolling mission introduction and SHALL not route to the dashboard before the introduction is completed

#### Scenario: The mission introduction finishes
- **WHEN** the participant reaches the end of the scrolling mission introduction
- **THEN** the application SHALL advance to avatar selection while retaining the locally entered study code

#### Scenario: Enrollment is interrupted during the introduction
- **WHEN** the participant closes or reloads the application before the introduction is complete
- **THEN** the next launch SHALL return to the incomplete enrollment flow and SHALL not create a second enrollment or silently discard a previously accepted local code

### Requirement: Avatar selection SHALL be completed and retained locally
The enrollment flow SHALL require the participant to choose a themed avatar, including astronaut and rocket options, and SHALL retain that choice as local study profile data without treating it as an identity attribute.

#### Scenario: The participant chooses an avatar
- **WHEN** the participant selects an available themed avatar and confirms the choice
- **THEN** the application SHALL retain the selected avatar locally and SHALL advance toward enrollment completion

#### Scenario: The participant tries to continue without an avatar
- **WHEN** the participant attempts to continue from avatar selection without choosing an avatar
- **THEN** the application SHALL display a specific selection error and SHALL leave enrollment incomplete

#### Scenario: The participant changes the avatar before completion
- **WHEN** the participant selects a different themed avatar before confirming enrollment
- **THEN** the application SHALL use the latest selection and SHALL not retain the superseded selection as participant study data

### Requirement: Enrollment completion SHALL establish one local enrollment anchor
When the study code, mission introduction, and avatar selection are complete, the application SHALL establish one local enrollment anchor that defines day zero for the participant's study schedule.

#### Scenario: Enrollment is completed
- **WHEN** the participant has submitted a valid study code, completed the mission introduction, and confirmed an avatar
- **THEN** the application SHALL record an enrollment anchor locally, mark enrollment complete, and make the dashboard available

#### Scenario: A completed enrollment is reopened
- **WHEN** a participant who already completed enrollment relaunches the application
- **THEN** the application SHALL use the existing local enrollment anchor and profile to enter the learner experience without asking for cloud credentials or creating a replacement anchor

#### Scenario: Local enrollment cannot be saved
- **WHEN** the application cannot persist the enrollment code, avatar, or anchor
- **THEN** it SHALL report that enrollment was not completed, SHALL avoid claiming that study participation has begun, and SHALL allow a safe retry without sending the data to a remote service

### Requirement: Enrollment data SHALL remain participant-local and non-identifying
The application SHALL keep the study code, avatar, mission-completion state, and enrollment anchor on the participant device and SHALL prevent them from being transmitted as participant-level or linkable data through automatic application requests.

#### Scenario: Enrollment completes with network access available
- **WHEN** the participant finishes enrollment while the device is connected to a network
- **THEN** the application SHALL complete using local data and SHALL make no automatic request containing the study code, avatar, enrollment anchor, or other participant-level enrollment state

#### Scenario: The participant returns after enrollment
- **WHEN** the participant opens the application after a completed local enrollment
- **THEN** the application SHALL restore the local profile and enrollment state without account login, identity lookup, or disclosure of participant-level data to a cloud service


### Requirement: Participant-facing learning screens SHALL meet accessible interaction requirements
The enrollment, dashboard, activities, and quizzes screens SHALL satisfy WCAG AA contrast requirements, SHALL be operable with keyboard-only input and supported touch input, SHALL expose accessible names for controls and accessible status text for validation, progress, completion, and error messages, and SHALL provide touch targets of at least 44 by 44 CSS pixels. The screens SHALL remain usable at viewport widths of 320 pixels and above, and each release SHALL be validated with a supported screen reader.

#### Scenario: A participant operates enrollment and learning screens without a pointer
- **WHEN** the participant uses keyboard input or supported touch input to operate enrollment, the dashboard, activities, or quizzes
- **THEN** every control SHALL have a visible focus state, SHALL be reachable and operable without a pointer or focus trap, SHALL have an accessible name, and SHALL provide status and error changes to assistive technology

#### Scenario: A participant uses the narrowest supported viewport
- **WHEN** enrollment, the dashboard, activities, or quizzes are displayed at 320 CSS pixels wide
- **THEN** content and actions SHALL reflow without clipping or required horizontal scrolling, and every actionable touch target SHALL be at least 44 by 44 CSS pixels

#### Scenario: An accessibility release check is performed
- **WHEN** a release is evaluated against WCAG AA contrast and with a supported screen reader
- **THEN** the evaluation SHALL pass the required contrast checks and the screen reader SHALL announce each control's accessible name and each validation, progress, completion, and error status