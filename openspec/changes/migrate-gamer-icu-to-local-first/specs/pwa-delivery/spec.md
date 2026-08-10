# PWA Delivery

## Purpose
Ensure GAMER-ICU is an installable, mobile-first, offline-capable learning application whose static releases update safely while participant study data stays on the device and no cloud push or participant-data network path is introduced.

## ADDED Requirements

### Requirement: The application SHALL support installable standalone use
The published application SHALL expose the metadata and platform behavior required for a participant to install it on supported Android and iOS devices and SHALL provide a standalone experience after installation.

#### Scenario: A supported mobile browser offers installation
- **WHEN** a participant opens the published application on a supported Android or iOS device
- **THEN** the platform SHALL be able to offer an install or add-to-home-screen action with the application name and identity-safe visual branding

#### Scenario: An installed application is launched
- **WHEN** the participant launches the installed application
- **THEN** it SHALL open as a standalone learning experience without relying on ordinary browser navigation chrome

#### Scenario: Installation is unavailable
- **WHEN** the participant's browser or device does not support installation
- **THEN** the application SHALL remain usable in the browser and SHALL explain that installation is unavailable without blocking local enrollment or learning

### Requirement: Offline use SHALL provide the application shell and published curriculum content
After the application has successfully loaded a release, it SHALL make the core shell and published curriculum content needed for local learning available without a network connection.

#### Scenario: The participant opens the application offline
- **WHEN** the device has no network connection and the participant launches the application after a release has loaded
- **THEN** the application SHALL open its core shell, restore the local enrollment and study state, and make the published curriculum content available for navigation and learning

#### Scenario: A content asset is not available offline
- **WHEN** an optional content asset cannot be made available on the device while the participant is offline
- **THEN** the application SHALL identify that asset as unavailable, SHALL keep the rest of the shell and available curriculum usable, and SHALL not discard local participant data

#### Scenario: The network is interrupted during learning
- **WHEN** the network connection is lost while the participant is viewing or completing an activity
- **THEN** the application SHALL keep the local learning experience usable, SHALL preserve the participant's local work, and SHALL not require a network retry before returning to the dashboard

### Requirement: Static production delivery SHALL not require a participant backend session
Production releases SHALL be publishable and servable as static public application and content assets, and participant enrollment, navigation, learning, and local progress access SHALL remain functional without a participant-specific server session.

#### Scenario: A production release is published
- **WHEN** an approved production release is deployed
- **THEN** the static host SHALL serve the application shell and public curriculum assets without provisioning participant accounts, participant-specific routes, or participant data endpoints

#### Scenario: A participant uses the application while the host is unreachable
- **WHEN** the static host or a public asset request is unreachable after the release is available on the device
- **THEN** the participant SHALL still be able to use the available offline shell and local study data, and the application SHALL report unavailable public content without claiming that local data was lost

#### Scenario: A production source release is approved
- **WHEN** a release is accepted from the designated production source
- **THEN** the deployment process SHALL publish that release to the production static host, while review or preview releases SHALL remain separate from production

### Requirement: Releases SHALL update safely without deleting local study data
An application update SHALL preserve local enrollment, progress, quiz attempts, points, streaks, and study events, and SHALL not activate a partially available release over a usable release.

#### Scenario: A compatible update is available
- **WHEN** the participant is offered a newer application release
- **THEN** the application SHALL preserve all local study data, make the complete update available before activation, and allow the participant to continue the learner experience with that data

#### Scenario: An update is interrupted or incomplete
- **WHEN** the device loses power or connectivity before an update is complete
- **THEN** the application SHALL continue using the last usable release, SHALL keep local study data intact, and SHALL retry or offer the update later

#### Scenario: A release changes the local data format
- **WHEN** an update uses a new representation for existing local study data
- **THEN** the application SHALL safely retain and make that data usable under the new release, or SHALL keep the prior release active until a safe transition is possible

### Requirement: Automatic application network requests SHALL exclude participant-level data
The application SHALL prevent participant-level or linkable study data from leaving the device through automatic requests, including enrollment codes, avatars, enrollment anchors, progress, quiz attempts, points, streaks, study events, and activity responses.

#### Scenario: The participant uses the application while connected
- **WHEN** the application loads, updates, displays content, records progress, or restores a session with network access
- **THEN** automatic requests SHALL be limited to public application or curriculum assets and SHALL contain no participant-level or linkable study data in URLs, request bodies, headers, telemetry, or cookies

#### Scenario: A participant record is ready for study collection
- **WHEN** participant-level study data is ready to leave the device
- **THEN** the application SHALL require the explicit encrypted QR collection flow and SHALL not upload the record through the static host, a participant API, analytics, or a Supabase data request

#### Scenario: A network policy blocks remote requests
- **WHEN** the device, browser, or institution blocks all remote requests
- **THEN** enrollment and local learning SHALL remain usable wherever the required shell and content are available, and no participant data SHALL be queued for undisclosed network transmission

### Requirement: Static-host requests SHALL contain no participant telemetry or stable study identifiers
The application SHALL NOT initialize cloud analytics or session telemetry and SHALL NOT emit linkable participant-route telemetry. Requests to a static host or public asset channel SHALL contain no participant data or application-generated stable study identifier, including a study code, enrollment anchor, participant-route token, session identifier, progress, quiz attempt, or device identifier, in the URL, query, application-supplied headers, body, cookies, or referrer.

#### Scenario: A participant navigates with network access
- **WHEN** the application loads public assets, restores local study state, or navigates between participant routes while connected
- **THEN** the application SHALL make only public asset requests, SHALL not initialize cloud analytics or session telemetry, SHALL not emit participant-route telemetry, and SHALL include no participant data or stable study identifier in those requests

#### Scenario: A static host receives an application request
- **WHEN** a static host receives a request from the participant application
- **THEN** the request SHALL identify only the requested public asset and release information needed for delivery, and SHALL contain no participant data or application-generated stable study identifier

### Requirement: Releases SHALL use development-to-deployment controls
The release process SHALL run automated checks before preview or production, perform an approved static content assembly using only approved application and content artifacts, keep preview releases isolated from production participant data, promote only an approved preview artifact, and retain a rollback target compatible with local study data and supported collector transfers.

#### Scenario: A source or content change is proposed for release
- **WHEN** an application or curriculum change is submitted for release
- **THEN** automated checks SHALL verify the build, packaged content schema and media completeness, offline shell behavior, accessibility, release network-privacy rules, and local-data compatibility, and a failed check SHALL block preview and production publication

#### Scenario: A preview release is published
- **WHEN** a candidate release is made available for review
- **THEN** the preview SHALL use separate hosting and credentials, SHALL contain only synthetic or no participant data, and SHALL have no read or write path to production participant data

#### Scenario: An approved static content assembly is produced
- **WHEN** the release pipeline assembles application and curriculum artifacts
- **THEN** it SHALL include only approved source and validated, versioned static content and media, SHALL exclude participant routes, participant data, and server-backed participant APIs, and SHALL reject an incomplete, unapproved, or incompatible assembly

#### Scenario: An approved preview is promoted to production
- **WHEN** an approved preview release passes its checks and is promoted
- **THEN** production SHALL receive the same approved immutable static artifact, and the deployment SHALL record the application, content, and transfer compatibility versions

#### Scenario: A production release fails after promotion
- **WHEN** a production release fails an acceptance, privacy, offline-use, or compatibility check after promotion
- **THEN** deployment SHALL roll back to the prior known-good compatible static release without deleting or rewriting participant-local study data, and SHALL keep the failed release unavailable for new activation

### Requirement: The application SHALL not create cloud push subscriptions
The application SHALL NOT request cloud push permission, create a push subscription, or send participant-specific push notifications for streak reminders or island unlocks.

#### Scenario: A participant completes enrollment
- **WHEN** enrollment finishes on a device that supports push notifications
- **THEN** the application SHALL not request notification permission for cloud push and SHALL not create a remote subscription

#### Scenario: A participant returns after an unlock or reminder is due
- **WHEN** the locally determined schedule says that a reminder or island-unlock message is due
- **THEN** the application SHALL determine that state locally and SHALL present it in the application without contacting a push service

### Requirement: In-app reminders SHALL provide the reminder fallback locally
The application SHALL provide an in-app reminder based on local study state and SHALL show it when the participant opens or returns to the application after a streak, activity, or island-unlock reminder becomes due.

#### Scenario: A local reminder is due
- **WHEN** the participant opens or resumes the application and a locally computed reminder is due
- **THEN** the application SHALL show an in-app reminder with an actionable path to the relevant learning destination and SHALL keep the reminder data on the device

#### Scenario: No reminder is due
- **WHEN** the participant opens or resumes the application before any reminder is due
- **THEN** the application SHALL not show a misleading reminder and SHALL continue to the normal learner experience

#### Scenario: A participant dismisses a reminder
- **WHEN** the participant dismisses or completes an in-app reminder
- **THEN** the application SHALL record that choice locally and SHALL not send the reminder status or participant identity to a remote service

### Requirement: The PWA SHALL remain usable from 320 pixels wide and above
The application SHALL use a mobile-first responsive presentation that keeps content, navigation, feedback controls, map states, and learning actions usable at viewport widths of 320 pixels and wider.

#### Scenario: The application is viewed at the minimum supported width
- **WHEN** the participant uses the application in a 320-pixel-wide viewport
- **THEN** text and controls SHALL remain readable and operable without clipped actions, unusable overlap, or required horizontal scrolling

#### Scenario: The viewport is wider than the minimum
- **WHEN** the participant rotates the device or uses a wider viewport
- **THEN** the application SHALL reflow the same learner experience without hiding curriculum destinations or changing the participant's local study data
