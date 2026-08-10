## Why

The Kiro plan assumes cloud authentication and participant-level Supabase storage, but the approved study shape keeps each nurse's game data on-device and transfers it only through an explicit encrypted QR collection process. Moving the complete development-to-deployment plan into OpenSpec now creates one behavior-first source of truth before more implementation compounds the obsolete cloud architecture.

## What Changes

- **BREAKING** Replace name/email/password registration and Supabase Auth with local study enrollment using a non-identifying participant code.
- **BREAKING** Replace participant-level Supabase persistence and Next.js data APIs with versioned on-device storage for progress, quiz attempts, points, streaks, and study events.
- Add encrypted, authenticated, resumable QR export from participant devices to provisioned onsite collector computers, including collector acknowledgement and idempotent re-import.
- Permit Supabase to host public application/content assets and genuinely non-identifiable cohort aggregates; prohibit participant-level or linkable study records in Supabase.
- Add a dedicated collector application and institution-managed local research database with identity separation, access controls, encryption, audit, backup, retention, and deletion controls.
- Preserve the 90-day six-island curriculum, activity types, progression, gamification, assessments, mobile PWA, accessibility, and content-shell requirements from the Kiro specification.
- Remove cloud push subscriptions, participant analytics, participant-level researcher APIs, and server-side quest secrets that conflict with the local-first privacy model.
- Migrate the complete Kiro pipeline from project setup through implementation, verification, content population, static PWA release, collector provisioning, aggregate reporting, and production acceptance.
- Retire the superseded Kiro specification files after OpenSpec validation and reader testing.

## Capabilities

### New Capabilities

- `participant-enrollment`: Local study enrollment, onboarding narrative, avatar selection, and participant-code handling without direct identifiers.
- `dashboard-map`: Six-island dashboard, learner HUD, unlock presentation, navigation, and feedback policy.
- `activity-experience`: Activity library and the six video, reading, quiz, case, quest, and ventilator-lab experiences.
- `gamification`: First-completion PEEP Points, repeat practice, streaks, and locally derived totals.
- `progression`: Enrollment-day island unlocks, completion percentages, final-exam gating, and binge prevention.
- `quiz-assessment`: Four quiz interaction types, randomization, feedback, scoring, and local attempt records.
- `content-catalog`: Versioned structured curriculum content, packaged media, schema validation, and missing-content behavior.
- `local-study-data`: Transactional on-device participant-level event storage, persistence, migration, minimization, and recovery behavior.
- `qr-data-transfer`: Encrypted framed export, scan reconstruction, validation, deduplication, and signed collector acknowledgement.
- `aggregate-reporting`: Cohort aggregation, disclosure controls, Supabase aggregate storage, and researcher reporting without participant-level cloud data.
- `pwa-delivery`: Installable mobile-first offline shell, static asset delivery, update safety, network egress restrictions, and production deployment.
- `collector-workstation`: Provisioned onsite collection, encrypted local participant database, separated identity linkage, access auditing, backup, retention, and deletion.

### Modified Capabilities

_None. This repository does not yet contain archived OpenSpec capabilities; the Kiro documents are being migrated as the initial OpenSpec change._

## Impact

- Removes or replaces `src/modules/auth`, cloud-backed progression persistence, `src/app/api/auth`, `src/app/api/progression`, Supabase middleware, participant tables/RLS policies, and participant-related Supabase dependencies.
- Adds IndexedDB persistence, local domain modules, cryptographic export framing, QR display/scanning, and a collector-side import/database surface.
- Retains Next.js, React, the PWA frontend, curriculum concepts, and pure progression/gamification rules.
- Changes deployment from a server-backed application to static PWA/content delivery plus separately provisioned collector software and optional aggregate-only Supabase reporting.
- Replaces the Kiro weekly checklist with an OpenSpec implementation pipeline covering development, test gates, privacy review, deployment, device validation, collector operations, and production acceptance.
