# Dashboard Map

## Purpose
Define the learner's privacy-safe home view with the complete six-island curriculum map, local progress HUD, scheduled unlocks, clear locked states, and direct navigation into available learning activities.

## ADDED Requirements

### Requirement: The dashboard SHALL display all six named curriculum islands
The dashboard SHALL show a planet map containing Lake Mucosa, Interlobar Divides, Valley of Pulmonara, Bronchial Bluffs, Mount Pneumora, and Alveolar Highlands as distinct navigable map destinations.

#### Scenario: An enrolled participant opens the dashboard
- **WHEN** a participant with a completed local enrollment opens the dashboard
- **THEN** the dashboard SHALL display all six named islands together on the planet map, regardless of which islands are currently unlocked

#### Scenario: The map is opened without a network connection
- **WHEN** the participant opens the dashboard while offline
- **THEN** the dashboard SHALL still display the six island names and their locally determined states without requiring a cloud response

### Requirement: The learner HUD SHALL show local identity-safe progress
The dashboard SHALL display the participant's selected avatar, a non-identifying local study label, current streak count, and total PEEP_Points using locally available study data, and SHALL NOT display a real name, email address, or password.

#### Scenario: Local enrollment and progress are available
- **WHEN** the dashboard loads with a completed local profile and progress record
- **THEN** the HUD SHALL show the selected avatar, local study label, current streak, and total PEEP_Points for that participant

#### Scenario: Local progress cannot be read
- **WHEN** the dashboard cannot read one or more local progress values
- **THEN** the HUD SHALL identify the affected value as unavailable, SHALL not invent a value, and SHALL not fetch participant data from a cloud service to fill the gap

### Requirement: Island availability SHALL follow the enrollment-day schedule
The dashboard SHALL make Islands 1 and 2 active during enrollment days 0–30, additionally make Islands 3 and 4 active during days 31–60, and additionally make Islands 5 and 6 active during days 61–90, based on the local enrollment anchor.

#### Scenario: A participant is within the first unlock window
- **WHEN** the local enrollment day is between day 0 and day 30 inclusive
- **THEN** Lake Mucosa and Interlobar Divides SHALL be active and tappable, while the later four islands SHALL remain locked unless previously unlocked

#### Scenario: A participant reaches the middle unlock window
- **WHEN** the local enrollment day is between day 31 and day 60 inclusive
- **THEN** Valley of Pulmonara and Bronchial Bluffs SHALL become active in addition to the first two islands

#### Scenario: A participant reaches the final unlock window
- **WHEN** the local enrollment day is between day 61 and day 90 inclusive
- **THEN** Mount Pneumora and Alveolar Highlands SHALL become active in addition to every island already unlocked

### Requirement: Previously unlocked islands SHALL remain accessible
Once an island has become unlocked, the dashboard SHALL keep it active and tappable after its initial scheduled window has passed.

#### Scenario: An unlocked island's window has ended
- **WHEN** a participant returns after the scheduled window for an already unlocked island
- **THEN** that island SHALL remain active and SHALL navigate to its activity library when tapped

#### Scenario: An island has never been unlocked
- **WHEN** a participant views an island whose scheduled window has not yet been reached and which has no prior unlocked state
- **THEN** the island SHALL remain locked and SHALL not provide access to its activity library

### Requirement: Locked islands SHALL have an understandable non-interactive state
The dashboard SHALL render an island that is outside its unlock window and has not previously been unlocked as visibly locked, greyed out, and non-interactive, with an explanation that does not disclose another participant's information.

#### Scenario: A participant taps a locked island
- **WHEN** the participant attempts to tap or activate a locked island
- **THEN** the dashboard SHALL keep the island locked, SHALL not navigate to its activities, and SHALL present its unlock explanation without changing local progress

#### Scenario: A locked state is viewed with assistive technology
- **WHEN** an assistive technology reads the map controls
- **THEN** each locked island SHALL be announced as unavailable and SHALL expose its unlock explanation without being presented as an actionable destination

### Requirement: Active islands SHALL navigate to their activity libraries
The dashboard SHALL provide an actionable destination for every active island and SHALL preserve the selected island context when the participant enters its activity library.

#### Scenario: The participant opens an active island
- **WHEN** the participant taps an active island
- **THEN** the application SHALL navigate to that island's activity library and SHALL not require a cloud login or participant-data upload

#### Scenario: Navigation cannot be completed
- **WHEN** an active island destination cannot be opened
- **THEN** the dashboard SHALL show a specific navigation error, SHALL keep the participant's local study data unchanged, and SHALL allow the participant to retry or return to the map

### Requirement: Feedback SHALL be explicitly initiated and privacy-safe
The dashboard SHALL provide a feedback control that opens an external anonymous feedback form only after an explicit participant action and SHALL not attach participant identifiers, study codes, progress, scores, or other participant-level data to the outgoing link.

#### Scenario: The participant requests feedback
- **WHEN** the participant activates the feedback control
- **THEN** the application SHALL open the anonymous feedback form without automatically including a study code, avatar, streak, PEEP_Points, activity history, or other participant-level context

#### Scenario: The feedback form cannot be reached
- **WHEN** the participant activates feedback while the external form is unavailable or the device is offline
- **THEN** the dashboard SHALL explain that feedback is unavailable, SHALL preserve local study data, and SHALL keep the participant in control of whether to retry

### Requirement: The dashboard SHALL not provide a global leaderboard
The dashboard SHALL omit rankings, peer comparisons, and any global leaderboard that could expose or encourage comparison of participant-level performance.

#### Scenario: A participant views the dashboard
- **WHEN** the dashboard renders for any enrollment state
- **THEN** it SHALL show the map, local HUD, navigation, and privacy-safe feedback control without showing a global leaderboard or another participant's results


### Requirement: The dashboard SHALL derive an effective streak from local state
The dashboard/read model SHALL read the committed streak count and last qualifying local calendar day, then derive the effective streak under the approved `clockPolicy` and current local calendar day without mutating committed history. The HUD's displayed current streak SHALL be this effective streak. When the current day is the same day or the immediately following local calendar day, it SHALL show the committed streak; when one or more local calendar days were missed, it SHALL show an effective streak of 0 rather than a stale committed count until a new qualifying completion is committed. The dashboard SHALL use only the first credited activity completion per local day as engagement; app opens, repeats, drafts, incomplete attempts, failed attempts, and reads SHALL not create engagement.

#### Scenario: A missed day cannot display a stale streak
- **GIVEN** committed local state has streak 6 and last qualifying day Monday, and the approved `clockPolicy` reports Wednesday as the current local day
- **WHEN** the participant opens or refreshes the dashboard
- **THEN** the dashboard SHALL display effective streak 0, SHALL not display 6, and SHALL leave the committed events and contributor history unchanged

#### Scenario: A current or immediately following day preserves the committed streak
- **GIVEN** committed local state has streak 6 and last qualifying day Monday
- **WHEN** the approved `clockPolicy` reports Monday or Tuesday as the current local day
- **THEN** the dashboard SHALL display effective streak 6 without creating a streak transition or changing committed state

#### Scenario: A clock anomaly fails closed on read
- **GIVEN** the clock observation is missing, moves backward, conflicts with committed observations, or cannot be interpreted under the approved `clockPolicy`
- **WHEN** the dashboard reads streak state
- **THEN** it SHALL mark the effective streak unavailable and show a clock-integrity warning, SHALL not infer a date or award/reset anything, and SHALL preserve all committed history

### Requirement: Dashboard credit state SHALL come from the approved versioned study configuration
The dashboard/read model SHALL consume `studyConfigurationVersion` only from the validated institution-approved local study configuration, which SHALL provide nonnegative integer `dailyCompletionCap`, nonnegative integer `sevenDayBonusAmount`, and the approved `clockPolicy`. Missing, invalid, expired, or mismatched configuration SHALL mark the affected cap, streak, or bonus result unavailable and SHALL block affected new-completion, streak-transition, or streak-bonus credit rather than guessing a value; the dashboard SHALL not fetch participant data from a cloud service to fill the gap.

#### Scenario: A valid versioned configuration supplies cap and bonus
- **GIVEN** the active approved `studyConfigurationVersion` supplies `dailyCompletionCap` 3, `sevenDayBonusAmount` 10, and a valid `clockPolicy`
- **WHEN** the dashboard reads local progression and gamification state
- **THEN** it SHALL use those exact versioned values and SHALL label the local time basis without inventing another cap, bonus, or clock source

#### Scenario: Invalid configuration blocks affected dashboard credit
- **GIVEN** the approved configuration or its versioned cap, bonus, or `clockPolicy` is missing or invalid
- **WHEN** a new completion, streak transition, bonus, or dependent dashboard value is evaluated
- **THEN** the affected credit or value SHALL be unavailable with an actionable reason, no default SHALL be used, and committed local points, completions, and history SHALL remain intact