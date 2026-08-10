## Purpose
Define cohort-only study reporting from one authoritative institution-local reporting/import/disclosure ledger containing consolidated collector-local records, with disclosure controls that prevent participant identification or linkability before any optional Supabase publication.

## ADDED Requirements

### Requirement: Cohort-only metric derivation
The authoritative reporting ledger SHALL derive researcher metrics from validated, durably imported participant records as cohort summaries rather than participant records. Reports SHALL support the study measures needed to evaluate the curriculum, including permitted cohort counts, PEEP Points summaries, streak summaries, time-spent summaries, quiz outcome summaries, and completion rates for each island. Reports MUST NOT expose a participant's points, streak, time, quiz attempt, completion history, or any other individual metric.

#### Scenario: Researcher opens a report for a valid cohort
- **WHEN** an authorized researcher requests the curriculum metrics for a cohort with sufficient contributing records
- **THEN** the report SHALL show only approved cohort-level counts, rates, distributions, or summary values for the study measures and SHALL contain no participant-level row or participant-specific value

#### Scenario: Imported records contain participant identifiers
- **WHEN** the local source records contain participant codes or other participant-level keys needed for local storage
- **THEN** aggregation SHALL remove those keys and any record-level linkage before a report is displayed, exported, queued, or considered for publication

### Requirement: Aggregate provenance and completeness
The authoritative reporting ledger SHALL include only validated and durably imported records in an aggregate, SHALL apply the same inclusion rules to every metric in that aggregate, and SHALL indicate the approved cohort and reporting period without exposing an individual event or collection time. Incomplete, rejected, unacknowledged, or otherwise ineligible source data MUST NOT be silently counted as valid observations.

#### Scenario: A cohort contains a rejected transfer
- **WHEN** an invalid or incomplete transfer is present beside valid imported transfers
- **THEN** the aggregate SHALL exclude the rejected or incomplete records, retain a locally auditable reason for the exclusion, and SHALL not infer missing participant values

#### Scenario: A report is generated for a reporting period
- **WHEN** an authorized researcher generates a report for an approved cohort period
- **THEN** every included metric SHALL use the same approved period and inclusion population, and the report SHALL expose no exact individual timestamp or transfer-level event

### Requirement: Atomic low-cell and differencing disclosure ledger
Before a metric is displayed, exported, handed off, or published, the reporting process SHALL consult one authoritative institution-local suppression/differencing ledger. That ledger SHALL atomically evaluate and persist the decision for every cohort, subgroup, filter, derived value, reporting period, snapshot, and contributing collector. It SHALL record the canonical population/query/snapshot scope and released or suppressed cells, compare each request with prior released and suppressed cells, and detect complementary, subset, repeated-period, and cross-collector combinations that could reveal a withheld value.

A cell below the approved minimum, or a combination of released cells that could reveal a suppressed cell by subtraction or comparison, MUST be withheld rather than rounded, relabeled, or released through another view. Separate collectors SHALL use the same authoritative ledger and SHALL require its signed release decision; a collector-local suppression cache or independent publication path MUST NOT create a complementary release. If the authoritative ledger is unavailable, inconsistent, or in conflict, the operation SHALL fail closed.

#### Scenario: Cohort cell is below the approved minimum
- **WHEN** a requested cohort or subgroup has fewer contributing participants than the protocol permits
- **THEN** the authoritative disclosure ledger SHALL persist suppression for the affected count and all participant-derived metrics in that scope, and the local view, export, and Supabase publication SHALL omit the suppressed cell

#### Scenario: Repeated filters or collectors could reveal a suppressed cell
- **WHEN** a researcher requests complementary cohorts, narrow filters, repeated periods, or cells through separate collectors that together could derive a previously suppressed value
- **THEN** the same authoritative ledger SHALL suppress or refuse the revealing result and SHALL preserve the same disclosure decision across views, exports, offline handoffs, and publication attempts

#### Scenario: Related reporting requests race
- **WHEN** view, export, and publication requests for related cells execute concurrently
- **THEN** each request SHALL use one atomic transaction against the persistent disclosure ledger, and no request SHALL release a cell forbidden by the committed suppression or differencing decision

### Requirement: No individual timestamps or linkable report rows
Reports and aggregate exports SHALL exclude exact individual event timestamps, enrollment timestamps, collection timestamps, device timestamps, IP addresses, device identifiers, transfer identifiers, participant codes, direct identifiers, free-text participant content, and stable person-specific pseudonyms. A published row or value MUST describe only an approved cohort-level period and grouping and MUST NOT be linkable to another row as the same participant.

#### Scenario: Raw events have precise times and stable local keys
- **WHEN** raw imported events include precise times, participant codes, or device metadata
- **THEN** the reporting process SHALL remove those fields and emit only an approved coarse cohort period and non-linkable aggregate values

#### Scenario: An export is inspected for row linkage
- **WHEN** a researcher downloads or reviews an aggregate export
- **THEN** no row, column, ordering, token, or metadata SHALL enable the researcher to follow one participant across cohorts, periods, islands, activities, or exports

### Requirement: Prohibited Supabase payloads are rejected
Optional Supabase publication SHALL accept genuinely non-identifiable aggregate values only when the complete payload exactly matches an approved snapshot and signed release decision from the authoritative institution-local ledger. The publication boundary MUST reject payloads containing participant IDs or codes, direct identifiers, pseudonymous or linkable keys, one-row-per-participant data, raw events, encrypted participant envelopes, exact individual timestamps, device uploads, free text, `sourceIdentityId`, `sourceKeyId`, event IDs, canonical payload digests, or any other participant-level or linkable study record. A rejected payload SHALL produce no partial cloud write.

#### Scenario: A publication payload contains a participant-level field
- **WHEN** an operator or faulty process attempts to publish a payload containing a participant ID, linkable row key, raw event, exact individual timestamp, or encrypted participant blob
- **THEN** the collector SHALL fail closed, record the rejected publication locally, and SHALL not send the payload or any partial version to Supabase

#### Scenario: A participant device attempts to publish directly
- **WHEN** a participant device requests a Supabase write for progress, quiz attempts, points, streaks, events, transfer data, or any other participant-level content
- **THEN** the request SHALL be refused and no participant-device network payload SHALL reach Supabase

### Requirement: Optional aggregate publication and offline operation
The authoritative institution-local ledger SHALL permit an authorized collector attached to it to generate, review, export, and retain approved aggregates without an Internet connection. Supabase publication SHALL be optional, explicit, and restricted to an authorized reporting action using that ledger's approved snapshot and signed release decision. When Supabase is unavailable, the validated snapshot and disclosure decision SHALL remain local; raw participant records, source contributions, and offline bundles SHALL never be queued or transmitted.

#### Scenario: A reporting collector is offline
- **WHEN** an authorized collector with access to the authoritative ledger imports consolidated participant contributions and generates an aggregate while no network connection is available
- **THEN** local import, snapshot derivation, disclosure suppression, and approved aggregate export SHALL complete without cloud access, and no participant-level data SHALL be queued for network transmission

#### Scenario: A disconnected scan station needs consolidation
- **WHEN** a scan station cannot reach the authoritative ledger after collecting participant records
- **THEN** it SHALL retain records only in encrypted institution-controlled storage, SHALL create a signed encrypted contribution bundle for an authorized offline channel, SHALL remain unable to report or publish independently, and SHALL receive a signed ledger receipt only after atomic consolidation

#### Scenario: Authorized operator later publishes a validated aggregate
- **WHEN** an authorized operator explicitly publishes a previously reviewed snapshot after connectivity is restored
- **THEN** the authoritative ledger SHALL verify the signed release decision and the complete payload, and Supabase SHALL receive only that approved non-identifiable aggregate and safe publication metadata while participant records remain local

### Requirement: Snapshot identity includes authoritative input state
The authoritative institution-local ledger SHALL assign each approved aggregate snapshot a stable identity derived from canonical approved `(study, cohort, period, metric definition, report version, eligiblePopulationDigest, inputSetDigest)` values. The eligible-population digest SHALL represent the deduplicated, eligible population and the input-set digest SHALL represent the exact consolidated source input set used for every metric. Neither digest may be replaced by a collector-local count or mutable participant identity.

An exact retry with the same descriptor, frozen input state, and approved payload SHALL be idempotent: it MUST confirm or update the same aggregate result without duplicate rows or double-counting. A snapshot request or publication that reuses the report labels but has a different eligible-population digest, input-set digest, metric definition, version, cohort, period, or payload SHALL be rejected as a conflict or receive a distinct canonical identity; it SHALL never overwrite, merge, or silently reinterpret the existing snapshot.

#### Scenario: Publication is retried after a timeout
- **WHEN** the operator retries publication because the prior Supabase response was lost or timed out
- **THEN** Supabase SHALL contain at most one result for that exact approved snapshot identity, and the ledger SHALL not recompute it from a different participant population or input set solely because publication was retried

#### Scenario: Metric, population, or input state changes
- **WHEN** an operator publishes an aggregate with a different approved metric definition, report version, cohort period, eligible-population digest, or input-set digest
- **THEN** the authoritative ledger SHALL reject a conflicting identity or treat it as a distinct aggregate snapshot, SHALL not overwrite the prior result, and SHALL expose no participant-level linkage or source records


### Requirement: Authorized researcher access and aggregate export
Only an authorized researcher or administrator SHALL view, download, or publish aggregate reports. The researcher view and every export SHALL apply the same no-PII, no-linkability, and low-cell controls as Supabase publication and SHALL provide no participant-level drill-down, hidden identifier, or bypass through an alternate route.

#### Scenario: Unauthorized user requests reporting data
- **WHEN** a participant, unapproved operator, or other unauthorized user requests the researcher view, an aggregate export, or a publication action
- **THEN** the collector SHALL deny the action, reveal no report data, and record the authorization failure in its local audit trail

#### Scenario: Authorized researcher exports a report
- **WHEN** an authorized researcher exports an approved report for offline analysis
- **THEN** the exported artifact SHALL contain only the same permitted aggregate values and suppression decisions shown in the authorized view

### Requirement: Institution-wide contribution reconciliation
Every aggregate input SHALL come from one authoritative institution-local reporting/import/disclosure ledger that is encrypted, backed up, access-controlled, and audited under institution control. The ledger SHALL register each permitted participant source-key lineage under a stable institution-issued `sourceIdentityId` representing that lineage; each concrete `sourceKeyId` and public key SHALL be recorded separately with its signed transition, expiry, and revocation state. It SHALL enforce the exact institution-wide deduplication identity `(studyId, sourceIdentityId, eventId)` across all collectors, transfers, retries, and backup restores. For each deduplication identity, it SHALL record and verify the presented `sourceKeyId`, `eventSequence`, and `eventPayloadSha256 = SHA-256(canonical(eventPayload))`. An exact repeated deduplication identity SHALL represent at most one accepted event and SHALL be counted at most once only when its `eventSequence` and event-payload digest match; a different `sourceKeyId` is accepted only after an authorized signed rotation within the same `sourceIdentityId` lineage. The same deduplication identity with a different sequence or event-payload digest SHALL be rejected as a conflict. Collector-local deduplication SHALL not establish eligibility, and no contribution SHALL enter the eligible population until the authoritative ledger accepts it.

When a station cannot reach the ledger, an authorized operator MAY use only an institution-controlled offline channel to move a signed canonical manifest and encrypted contribution bundle to the ledger. The ledger SHALL verify station registration, signature, sequence/replay state, `sourceIdentityId`/`sourceKeyId` lineage status, source-event identity, `eventSequence` and `eventPayloadSha256`, and transfer integrity before one atomic consolidation, then issue a signed receipt containing non-content contribution and reconciliation metadata. A station without that receipt SHALL not report, export, or publish. Replayed, tampered, forked, or stale contributions and restores SHALL be rejected or quarantined without resetting canonical deduplication, eligibility, snapshot, or disclosure state. Participant records and offline bundles SHALL remain local and SHALL never be sent to Supabase.

#### Scenario: Multiple collectors and a restored backup submit the same event
- **WHEN** the authoritative ledger receives the same signed source event through multiple collectors or a restored backup with the same stable `sourceIdentityId` and `eventId`, matching `eventSequence` and `eventPayloadSha256`, and each presented `sourceKeyId` is authorized for that lineage (including an authorized signed rotation)
- **THEN** it SHALL confirm one canonical event, include it in the eligible population at most once, and ensure every aggregate snapshot counts it once

#### Scenario: Conflicting source-event content is submitted
- **WHEN** the same stable `sourceIdentityId` and `eventId` arrive with a different `eventSequence` or `eventPayloadSha256`
- **THEN** the ledger SHALL reject or quarantine the conflict, SHALL not replace or count the accepted event, and SHALL retain only a non-content audit decision

#### Scenario: An offline station submits a contribution
- **WHEN** an authorized operator consolidates a signed encrypted station bundle after disconnection
- **THEN** the authoritative ledger SHALL atomically reconcile accepted events, issue a signed receipt, and prevent the station from publishing a separate or complementary aggregate
