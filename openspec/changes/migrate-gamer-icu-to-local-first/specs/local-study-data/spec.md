## Purpose

Define the durable local boundary for participant study records, including transactional events, safe evolution, explicit export, and privacy failure behavior without treating a participant device or its clock as inherently trustworthy.

## ADDED Requirements

### Requirement: Keep minimized participant study records on the participant device
The local study-data domain SHALL keep participant-level enrollment, activity, quiz, gamification, progression, and study-event records on the participant device during the study, and SHALL enroll the participant with a non-identifying participant code rather than a direct identifier.

#### Scenario: A local enrollment contains only bounded study fields
- **GIVEN** a participant starts local study enrollment
- **WHEN** the participant provides the required non-identifying participant code and bounded study choices
- **THEN** the local record SHALL be created without a name, email address, phone number, physical address, account credential, or other direct identifier

#### Scenario: Patient and free-text identifiers are rejected
- **GIVEN** an event payload contains a patient name, medical-record number, encounter identifier, contact detail, or free-text note intended to identify a person
- **WHEN** the local data boundary validates the payload
- **THEN** it SHALL reject that field or event, explain the privacy failure, and SHALL not commit the rejected content

#### Scenario: Local records do not require a cloud identity
- **GIVEN** a participant has valid local enrollment and no network connection
- **WHEN** the participant opens or updates study state
- **THEN** local study data SHALL remain usable without cloud authentication, and no participant-level record SHALL be created in Supabase

### Requirement: Protect durable participant records with authenticated encryption at rest
The local study-data domain SHALL store participant enrollment, event, quiz, progression, gamification, participant-code, and transfer/acknowledgement records encrypted at rest in a device-protected store using standards-based authenticated encryption. Encryption keys SHALL remain in platform-protected key storage and MUST NOT be persisted beside ciphertext or in ordinary app storage. Plaintext participant records, derived state, transfer payloads, or keys MUST NOT be written to logs, caches, crash reports, temporary files, ordinary backups, or export staging. If the key is unavailable or lost, or ciphertext/authentication validation fails, the domain MUST fail closed: it SHALL not decrypt, expose, mutate, export, acknowledge, reset, or replace the affected store, SHALL retain the encrypted material for approved recovery, and SHALL expose an observable key or storage-integrity error.

#### Scenario: Durable writes create no plaintext durable artifacts
- **GIVEN** participant records, derived state, and pending or acknowledged transfer state are committed locally
- **WHEN** the application performs its normal persistence, export interruption, logging, crash recovery, or backup actions and its durable store, caches, logs, temporary files, backups, and export staging are inspected without the platform-protected key
- **THEN** no inspected durable artifact SHALL contain a plaintext participant record, derived value, transfer payload, or encryption key, and every durable representation SHALL be authenticated-encrypted or absent

#### Scenario: The device key is unavailable or lost
- **GIVEN** an encrypted participant store exists but its platform-protected key cannot be retrieved
- **WHEN** the application opens the store or a participant requests a write, export, acknowledgement, or deletion
- **THEN** the data layer SHALL fail closed, SHALL not expose or mutate records, SHALL not create or switch to an empty replacement store, SHALL retain the encrypted material for approved recovery, and SHALL show a key-unavailable error

#### Scenario: Durable ciphertext or authentication data is corrupt
- **GIVEN** stored participant ciphertext or its authenticated metadata is modified, truncated, or otherwise corrupt
- **WHEN** the data layer attempts to read or decrypt the affected store
- **THEN** it SHALL reject the affected data before exposing or committing it, SHALL not reset, overwrite, or fall back to plaintext or volatile state, SHALL preserve the encrypted material for recovery, and SHALL show a storage-integrity error

### Requirement: Commit each participant event and its derived state transactionally
The local study-data domain SHALL commit an accepted participant event together with every affected derived value as one logical transaction, or SHALL commit neither the event nor any of its derived changes.

#### Scenario: A completion and its effects commit together
- **GIVEN** a valid first activity completion changes completion credit, PEEP Points, streak state, and island progress
- **WHEN** the local transaction succeeds
- **THEN** the event and all of those derived changes SHALL be readable as one consistent committed state

#### Scenario: An aborted transaction leaves the prior state intact
- **GIVEN** local storage aborts while committing an event and its derived changes
- **WHEN** the data layer reports the abort
- **THEN** no partial event, point award, streak transition, completion count, or export eligibility SHALL be visible, and the last committed state SHALL remain recoverable

### Requirement: Verify durable persistence before reporting success
The local study-data domain SHALL perform a persistence check after a write and SHALL report success only when the accepted event and its resulting state can be read back consistently from durable local storage.

#### Scenario: A committed event survives a reload
- **GIVEN** an event has been reported as successfully committed
- **WHEN** the participant closes and reopens the application while offline
- **THEN** the same event and derived state SHALL be recoverable with the same values and SHALL not need a cloud request

#### Scenario: A read-back check fails
- **GIVEN** the write operation returns but the event or derived state cannot be read back consistently
- **WHEN** the persistence check completes
- **THEN** the data layer SHALL not report the action as complete, SHALL expose a storage-integrity error, and SHALL preserve the last known committed state rather than silently resetting it

### Requirement: Make event writes and replays idempotent
The local study-data domain SHALL assign each accepted event a stable `(sourceIdentityId, eventId)` identity, `eventSequence`, and canonical `eventPayloadSha256`, and SHALL process an exact replay of that identity/sequence/digest at most once while rejecting a conflicting reuse rather than replacing it; distinct valid identities SHALL remain distinct.

#### Scenario: Retrying an event does not duplicate state
- **GIVEN** a completion event with a stable identity is already committed
- **WHEN** the same event is retried after a timeout, reload, or interrupted transfer
- **THEN** the data layer SHALL return the original committed outcome without duplicating points, completion credit, streak bonuses, quiz attempts, or daily-cap usage

#### Scenario: A distinct event is not collapsed into an old one
- **GIVEN** two valid events have different stable identities and represent separate participant actions
- **WHEN** both events are committed
- **THEN** each event SHALL be represented once and each valid state transition SHALL be applied according to its domain rules

### Requirement: Migrate stored data only through a versioned safe migration
The local study-data domain SHALL record the schema version of stored participant data and SHALL apply a supported migration only when it preserves the meaning, completeness, and idempotency of all records.

#### Scenario: A supported migration preserves participant state
- **GIVEN** participant data uses an older supported schema version
- **WHEN** the application opens the data and a safe migration is available
- **THEN** the migration SHALL preserve every valid event, contributor, total, completion, streak, export state, and participant code, and SHALL make the migrated version readable

#### Scenario: An interrupted migration cannot leave a half-migrated store
- **GIVEN** a supported migration is interrupted before it finishes
- **WHEN** the application next opens the local data
- **THEN** it SHALL resume safely or restore the last known consistent version, SHALL not duplicate or lose events, and SHALL expose the migration status

#### Scenario: An unsafe or unknown migration fails closed
- **GIVEN** the stored schema version is unsupported, corrupt, or cannot be migrated without possible loss or reinterpretation
- **WHEN** the data layer evaluates the store
- **THEN** it SHALL block mutations that could overwrite the data, SHALL not silently reset or discard participant records, SHALL expose an unsafe-migration error, and SHALL offer the defined recovery or export path

### Requirement: Fail safely when local storage is unavailable
The local study-data domain SHALL treat unavailable, full, read-only, corrupted, or failed local storage as an observable error rather than silently falling back to volatile state or claiming a successful participant action.

#### Scenario: Storage failure during a completion is visible
- **GIVEN** a participant completes an activity while the local write is unavailable
- **WHEN** the write fails
- **THEN** the app SHALL show a recoverable storage-error state, SHALL not award or display committed points or progress for that action, and SHALL allow a later retry without losing the prior committed state

#### Scenario: A read failure cannot create a fresh empty participant
- **GIVEN** existing participant data cannot be read at startup
- **WHEN** the participant opens the application
- **THEN** the app SHALL show that study data is unavailable and SHALL not create a new empty record that could overwrite or conceal the existing participant state

### Requirement: Track explicit, resumable export state for encrypted collection
The local study-data domain SHALL track whether participant records are pending export, in an active export, acknowledged by the authorized collector, or in a recoverable failure state, and SHALL start export only after an explicit participant action.

#### Scenario: An export begins only after participant initiation
- **GIVEN** participant-level records are eligible for collection but the participant has not requested export
- **WHEN** the application runs normally
- **THEN** no export SHALL start and no participant-level record SHALL leave the device

#### Scenario: Interrupted encrypted QR collection is resumable
- **GIVEN** the participant has explicitly started an encrypted, authenticated QR transfer to an authorized onsite collector
- **WHEN** the device is locked, the QR scan is interrupted, or the transfer fails
- **THEN** source records SHALL remain intact, the export SHALL be marked recoverably incomplete, and a later participant-authorized attempt SHALL resume or safely retry without changing learner totals

#### Scenario: Collector acknowledgement is idempotent and local
- **GIVEN** an authorized collector has acknowledged an exported batch
- **WHEN** the same acknowledgement or batch is received again
- **THEN** the local data layer SHALL not duplicate or re-award any participant event, SHALL retain the acknowledgement state, and SHALL identify the destination as the collector's institution-managed local store rather than Supabase

### Requirement: Enforce the participant-data boundary at every reporting path
The local study-data domain SHALL prevent participant-level, pseudonymous, or linkable study records from reaching Supabase, and SHALL permit only genuinely non-identifiable cohort aggregates after authorized collection and identity separation.

#### Scenario: A participant-level upload is refused
- **GIVEN** an outbound payload contains a participant code, event identity, completion history, points total, streak, quiz attempt, or any linkable combination of fields
- **WHEN** the payload is addressed to Supabase
- **THEN** the data boundary SHALL refuse transmission and SHALL leave the participant record local or in the authorized collector workflow

#### Scenario: An aggregate-only report is permitted
- **GIVEN** an authorized collection workflow has removed participant linkage and produced a genuinely non-identifiable cohort aggregate
- **WHEN** that aggregate is sent to Supabase
- **THEN** the transmission MAY proceed without including participant codes, event identities, names, contact details, patient identifiers, or reconstructable participant-level rows

### Requirement: Make device-clock uncertainty observable
The local study-data domain SHALL record and expose whether time-dependent values rely on device-reported time, and SHALL not falsely treat an unverified device clock as an authoritative study clock.

#### Scenario: Device-reported time is labeled as unverified
- **GIVEN** the participant device supplies the date used for streaks, enrollment days, or daily-cap boundaries and no independent trusted time is available
- **WHEN** those values are displayed or used
- **THEN** the app SHALL visibly identify the time basis as device-reported and unverified rather than presenting it as authoritative

#### Scenario: A conflicting clock observation is preserved as an anomaly
- **GIVEN** a new device date moves backward or jumps inconsistently relative to a committed observation
- **WHEN** the local data layer detects the conflict
- **THEN** it SHALL preserve the prior committed records, expose a clock-integrity warning, and SHALL not silently award a streak bonus, unlock an island, or reset the daily cap from the conflicting time alone

#### Scenario: Missing clock data does not fabricate a calendar day
- **GIVEN** the device cannot provide a usable date
- **WHEN** a time-dependent event is requested
- **THEN** the app SHALL mark the dependent result unavailable or provisional, SHALL not invent a date, and SHALL leave non-time-dependent local study data available when it is safe to do so

### Requirement: Preserve canonical source-event identity across collection
Each accepted local event SHALL carry a stable `eventId`, strictly increasing `eventSequence` within the registered participant source identity, and an `eventPayloadSha256` equal to `SHA-256(canonical(eventPayload))`. The canonical payload SHALL use the one QR JSON profile: UTF-8 without BOM, sorted UTF-16 member names, NFC-valid strings, bounded integer numbers, omitted optional values, no `null`, and unpadded base64url for binary values. The local export snapshot SHALL preserve these exact fields and SHALL not replace them with a new envelope-, transfer-, collector-, or restore-specific identifier.

The institution SHALL maintain one authoritative encrypted source-event ledger across all approved collectors and restore paths. Its uniqueness identity SHALL be `(studyId, stable sourceIdentityId, eventId)`, where `sourceIdentityId` is assigned when the participant source key is registered and remains stable through an authorized signed source-key rotation. The ledger SHALL retain `sourceKeyId`, `eventSequence`, and `eventPayloadSha256` and SHALL commit its decision atomically with the imported event and derived projections. An exact identity/sequence/digest repeat SHALL be an idempotent duplicate; the same identity with a different sequence or digest SHALL be a hard conflict, SHALL be audited locally, and SHALL not be acknowledged or replace the accepted event.

#### Scenario: An event is retried after a lost acknowledgement
- **GIVEN** a local event was durably committed and exported but the participant did not receive an acknowledgement
- **WHEN** a later export uses a new offer, transfer, envelope, collector, or restored database
- **THEN** the same `(studyId, sourceIdentityId, eventId, eventSequence, eventPayloadSha256)` SHALL remain one event, SHALL not re-award points/progress/streak/quiz credit, and SHALL return the existing ledger/import result when accepted

#### Scenario: Conflicting event content is presented
- **GIVEN** the institution ledger already contains a source identity and event ID
- **WHEN** a candidate import presents a different canonical payload digest or event sequence for that identity
- **THEN** the local collector workflow SHALL reject and audit the candidate, SHALL preserve the accepted event and projections, and SHALL issue no acknowledgement for the conflicting batch

#### Scenario: A registered source key rotates
- **GIVEN** the old source key is registered and an institution-authorized signed transition names a new source key
- **WHEN** the new key exports events
- **THEN** the new key SHALL retain the same stable `sourceIdentityId`, old events SHALL remain immutable, and event deduplication SHALL continue across the rotation

### Requirement: Fail closed when collection freshness cannot be established
Local export state SHALL record the accepted offer's institution authorization/status epoch and the signed bounded-age freshness evidence used for collection. The participant SHALL use only the approved institution-authoritative time/status rule for offer age, status freshness, and revocation; its wall clock SHALL not establish permission to export. Before creating or resuming a transfer, the participant SHALL verify the root-signed freshness challenge, latest status sequence/state, monotonic counter, exact offer/session/collector-key binding, and signed lifetime. Missing, stale, expired, ambiguous, regressed, or unverifiable evidence SHALL block bootstrap and frame emission while preserving local source records and unacknowledged transfer state.

The institution SHALL document the maximum freshness/offer lifetime and acknowledge that an offline collector may not observe a later revocation until that bounded lifetime expires. A new freshness observation SHALL be required after the lifetime, app restart, or an interruption whose duration cannot be bounded; no local operation SHALL claim immediate offline revocation.

#### Scenario: An export is attempted without approved freshness
- **GIVEN** participant records are eligible for collection but no valid root-signed, bounded-age status/freshness evidence is available
- **WHEN** the participant selects export
- **THEN** the app SHALL fail closed before creating a bootstrap or frame, SHALL leave records and prior export state intact, and SHALL explain that authoritative freshness is unavailable

#### Scenario: Freshness expires during a resumable transfer
- **GIVEN** a transfer was interrupted after some frames and its signed freshness lifetime has expired
- **WHEN** the participant attempts to resume
- **THEN** the app SHALL require a new validated offer/status/freshness observation and SHALL emit no frame until it succeeds

### Requirement: Complete and durably retain first-registration lineage before export
The local study-data domain SHALL keep an encrypted registration state with `registrationOfferId`, `registrationRequestId`, `registrationReceiptId`, `registrationReceiptDigest`, `sourceIdentityId`, concrete `sourceKeyId`, exact `sourcePublicKey`, registration freshness epoch/counter, and receipt verification/read-back status. A new installation SHALL not create an ordinary export snapshot, bootstrap, frame, acknowledgement, or deletion candidate until the participant has verified and durably read back the collector- and authoritative-ledger-signed `RegistrationReceipt`. Registration request/receipt objects SHALL contain no activity, event, enrollment, projection, or plaintext participant data.

#### Scenario: A new installation registers before export
- **WHEN** the participant verifies a root-signed bounded-fresh `RegistrationOffer`, signs a proof-of-possession request, and receives a receipt assigning `sourceIdentityId`
- **THEN** the local store SHALL atomically commit the receipt and source-key lineage, SHALL read it back, and SHALL only then permit a newly issued normal export offer; no activity record SHALL leave the device during registration

#### Scenario: Reinstall, lookup, rotation, or mismatch occurs
- **WHEN** an encrypted vault and installation key are recovered, a receipt is looked up by its receipt/key tuple, a valid signed old-to-new key transition is presented, or a key/receipt/offer binding differs
- **THEN** recovered state SHALL retain the same identity and receipt, lookup SHALL return only registration metadata, rotation SHALL retain `sourceIdentityId`, and any missing-key, mismatched, revoked, stale, cross-study, or replayed state SHALL fail closed without a new empty store, ordinary export, acknowledgement, or deletion

### Requirement: Persist and authenticate bounded missing-frame status
For an interrupted transfer, local export state SHALL retain the exact collector-signed `MissingFrameStatus` bytes, status sequence, freshness epoch/counter, transfer/bootstrap/envelope digests, frame count, and either the bounded sorted unique index list or exact compact bitmap. The participant SHALL accept a status only when its domain-separated signature, exact accepted tuple, current freshness evidence, monotonic sequence, representation bounds, and unused bitmap bits verify.

#### Scenario: Resume requests only authenticated positions
- **WHEN** an accepted incomplete status identifies missing positions
- **THEN** the participant SHALL resend only those existing frame positions, preserve all source events, and SHALL not infer, regenerate, or emit an unrequested frame

#### Scenario: Status is tampered, stale, replayed, or out of bounds
- **WHEN** status binding, signature, freshness, sequence, frame count, indexes, bitmap length, or terminal state fails validation
- **THEN** local state SHALL remain recoverably incomplete, SHALL emit no frame, and SHALL retain the prior accepted status and source records

### Requirement: Verify transported event outcomes before the deletion gate
The local data layer SHALL verify the nested signed `EventLedgerReceipt` transported inside an acknowledgement before marking a transfer acknowledged or retention-eligible. It SHALL recompute `eventSetDigest` over the participant-known canonical ordered `(eventId,eventSequence,eventPayloadSha256)` list, verify the receipt digest/signature and exact study/source/offer/session/transfer/envelope/import-transaction/ledger-sequence binding, and check the bounded imported-vs-duplicate bitmap in that same order. A conflict, rejected event, partial import, missing receipt, or any mismatch SHALL produce no accepted acknowledgement.

#### Scenario: Every event outcome verifies
- **WHEN** the collector acknowledgement contains a valid receipt whose count, digest, signature, transaction, ledger sequence, and bitmap match the participant's exported events
- **THEN** the local store SHALL record the receipt and acknowledgement atomically, identify each event as imported or duplicate, and SHALL apply deletion only under the approved post-acknowledgement policy

#### Scenario: Acknowledgement cannot prove an outcome
- **WHEN** the acknowledgement or nested receipt is absent, altered, stale, replayed, conflict-bearing, or maps to a different event order
- **THEN** the local store SHALL keep all source events and transfer artifacts, SHALL not mark them retention-eligible, and SHALL allow only a participant-authorized retry
