## Purpose
Define the institution-provisioned offline collector boundary that stores participant records securely, separates identity linkage, and permits only controlled aggregate reporting.

## ADDED Requirements

### Requirement: Institution-provisioned collector trust
An institution SHALL provision each collector workstation before it is used for study collection, associate it with the approved study and collection point, authorize its operator roles, and install only a supported transfer and data version. The workstation MUST refuse participant import, acknowledgement, identity lookup, and reporting publication when its provisioning, authorization, or trusted configuration is missing, expired, or invalid.

#### Scenario: Unprovisioned computer is presented for collection
- **WHEN** an operator attempts to scan or import a participant transfer on a computer that is not institution-provisioned for the study
- **THEN** the workstation SHALL refuse the operation, expose no participant data, and record the failed collection attempt locally

#### Scenario: Provisioned workstation starts collection
- **WHEN** an authorized operator signs in to a validly provisioned workstation at an approved collection point
- **THEN** the workstation SHALL permit only the collection and reporting actions allowed to that operator's role and supported configuration

### Requirement: Encrypted local participant database
The workstation SHALL store imported participant-level study records, pending transfer state, import-deduplication state, and acknowledgement status only in an encrypted local participant database protected by institution-controlled access. Participant data MUST NOT be left in plaintext temporary files, application logs, ordinary exports, or unprotected local caches, and the participant database MUST NOT synchronize to a cloud service.

#### Scenario: Valid transfer is imported while offline
- **WHEN** a complete QR transfer is validated on an authorized workstation without network access
- **THEN** the workstation SHALL durably store the participant records and transfer status in encrypted local storage and SHALL complete the import without sending participant data remotely

#### Scenario: Storage is copied without authorization
- **WHEN** an unauthorized person obtains a copy of workstation storage or a leftover temporary artifact
- **THEN** the person SHALL not be able to recover participant records from that storage or artifact through ordinary access, and the access or attempted recovery SHALL be auditable where observable

### Requirement: Separate identity lookup
The workstation SHALL keep any mapping between a non-identifying study participant code and direct identity details in a separate protected identity lookup under a distinct access policy. Participant study records, QR envelopes, audit entries, aggregate reports, and Supabase payloads MUST NOT contain direct identity details or a copy of the identity mapping. Linking a code to an identity SHALL require a separately authorized purpose and SHALL remain local to the institution.

#### Scenario: Collection operator handles a coded participant record
- **WHEN** a collection operator imports or reviews a participant record identified only by its study code
- **THEN** the operator SHALL be able to complete the authorized collection workflow without being granted identity-lookup access or seeing direct identity details

#### Scenario: Authorized linkage is requested
- **WHEN** a specifically authorized role performs an approved identity lookup for a documented study purpose
- **THEN** the lookup SHALL occur only within the protected local identity boundary, SHALL be audited, and SHALL not change the coded study record or enable a cloud linkage

### Requirement: Least-privilege roles and session access
The workstation SHALL enforce least privilege for collection, participant-data administration, identity linkage, aggregate reporting, backup, and retention actions. A collection operator MUST be able to scan and acknowledge valid transfers without unrestricted participant browsing or identity lookup; a researcher MUST receive aggregates only; and backup, deletion, and configuration actions MUST require their separately authorized roles. The workstation SHALL require an authenticated session and deny protected actions to unauthenticated, expired, or unauthorized sessions.

#### Scenario: Researcher requests participant records
- **WHEN** a researcher uses the workstation or researcher view to request raw participant records, coded rows, or identity details
- **THEN** the workstation SHALL deny the request and SHALL expose only authorized aggregate results subject to disclosure controls

#### Scenario: Expired operator session attempts an import
- **WHEN** an operator session has expired or been revoked and the operator attempts to scan, acknowledge, export, or publish data
- **THEN** the workstation SHALL deny the action until a newly authenticated session with the required role is established

### Requirement: Offline collection and network egress boundary
The workstation SHALL support QR scanning, frame reconstruction, validation, idempotent import, signed acknowledgement, local aggregation, and approved aggregate export without Internet access. Participant-level data MUST remain within the participant-device and institution-local collector trust boundary; any network publication path SHALL be limited to the validated aggregate-reporting workflow and SHALL not perform background participant synchronization.

#### Scenario: Collection point has no connectivity
- **WHEN** the workstation has no Internet or external service connectivity during a collection session
- **THEN** it SHALL complete valid local imports and acknowledgements, preserve pending and imported state, and permit a later authorized aggregate-only publication

#### Scenario: Network becomes available after offline collection
- **WHEN** connectivity returns after participant records have been collected locally
- **THEN** the workstation SHALL not automatically upload participant records, transfer frames, identity mappings, or participant telemetry, and SHALL require an explicit authorized aggregate publication action

### Requirement: Comprehensive local audit trail
The workstation SHALL maintain an access-controlled and integrity-protected local audit trail for operator authentication outcomes, collection-point and provisioning changes, frame and transfer outcomes, decryption or validation failures, imports and acknowledgements, participant-record access, identity lookups, aggregate views and exports, publication attempts, backup and restore operations, retention actions, and deletion outcomes. Audit entries SHALL identify the authorized actor, action, time, target category, and result without copying participant record contents, direct identifiers, or raw QR payloads.

#### Scenario: Unauthorized access and prohibited publication are attempted
- **WHEN** an unauthorized user requests participant data or an operator attempts to publish a prohibited participant-level payload
- **THEN** the workstation SHALL deny the action, preserve participant data locally, and append an auditable failure event without placing the prohibited payload in the audit trail

#### Scenario: Authorized collection succeeds
- **WHEN** a valid transfer is imported and acknowledged by an authorized operator
- **THEN** the audit trail SHALL record the actor, transfer outcome, acknowledgement result, and time while retaining no raw participant event or QR-frame content

### Requirement: Encrypted separated backup and recovery
The workstation SHALL create encrypted backups of the local participant database and the transfer/import state needed to preserve idempotence and acknowledgement decisions. Identity lookup data SHALL be backed up separately under its distinct access policy, and backup material and its recovery authority MUST be protected separately from ordinary collection access. The institution SHALL verify that an authorized recovery can restore usable local data without exposing participant records to cloud storage or combining the identity lookup with study data.

#### Scenario: Workstation fails before a scheduled collection resumes
- **WHEN** an authorized custodian restores the most recent valid backup to a provisioned replacement workstation
- **THEN** the replacement SHALL recover the participant records, pending transfers, completed-import decisions, and acknowledgement status needed to resume safely, while identity lookup remains separately protected

#### Scenario: Same transfer is presented after backup recovery
- **WHEN** a transfer that was already imported before the failure is presented again after recovery
- **THEN** the recovered workstation SHALL recognize the completed import and SHALL not create duplicate participant events, points, quiz attempts, or records

### Requirement: Retention and controlled deletion
The institution SHALL enforce an approved retention schedule for participant records, incomplete transfer state, acknowledgement metadata, identity lookup data, backups, and aggregate outputs. The workstation MUST prevent deletion or purge of participant records needed for a transfer that has not received a verified signed acknowledgement, and any later deletion SHALL require an authorized role, record the outcome, and remove or expire all applicable local copies, temporary artifacts, and backup copies according to the approved backup lifecycle.

#### Scenario: Deletion is requested before acknowledgement
- **WHEN** an operator or automated retention action attempts to delete participant records associated with a transfer lacking a verified signed acknowledgement
- **THEN** the workstation SHALL block deletion, retain the records for retry or recovery, and record the blocked action locally

#### Scenario: Authorized retention period expires
- **WHEN** an authorized custodian approves deletion after the applicable retention period and acknowledgement requirements are satisfied
- **THEN** the workstation SHALL remove the participant records and associated local transfer artifacts within the approved backup lifecycle, retain a non-identifying deletion audit event, and leave only permitted non-identifiable aggregates

### Requirement: Aggregate-only cloud gateway
Supabase publication SHALL be available only through the workstation's authorized aggregate-reporting boundary after the authoritative institution-local ledger has accepted and consolidated source contributions, frozen the approved snapshot, applied disclosure suppression, and issued its signed release decision. The workstation MUST reject participant IDs or codes, direct identifiers, linkable rows, raw events, encrypted participant envelopes, exact individual timestamps, device uploads, `sourceIdentityId`, `sourceKeyId`, event IDs, canonical payload digests, and identity mappings at the publication boundary, and MUST NOT provide a participant-device route to Supabase.

#### Scenario: Operator selects a raw participant export for cloud publication
- **WHEN** an operator attempts to send participant records, a QR envelope, or an identity-linked file to Supabase
- **THEN** the workstation SHALL reject the action before network transmission, record the policy failure without recording payload contents, and leave all participant data local

#### Scenario: Approved aggregate is published
- **WHEN** an authorized operator submits an aggregate whose snapshot and suppression decision were approved by the authoritative ledger and whose complete payload passes the reporting schema and low-cell controls
- **THEN** the workstation SHALL send only the already-approved non-identifiable aggregate and safe publication metadata to Supabase and SHALL retain participant-level source records exclusively in encrypted institution-local storage


### Requirement: Authoritative institution-local contribution and deduplication ledger
The institution SHALL operate one authoritative institution-local reporting/import/disclosure ledger for the study. The ledger SHALL be encrypted, backed up, access-controlled, and audited under institution control. Every authorized collector and scan station SHALL contribute validated records to that ledger before they become eligible for reporting; a collector-local database MAY retain participant records and prefilter state but MUST NOT independently establish reporting eligibility, a release decision, or a publication.

The ledger SHALL register each permitted participant source-key lineage under a stable institution-issued `sourceIdentityId` representing that lineage; each concrete `sourceKeyId` and public key SHALL be recorded separately with its signed transition, expiry, and revocation state. It SHALL enforce the exact institution-wide deduplication identity `(studyId, sourceIdentityId, eventId)` across collectors, transfers, retries, and backup restores. For each deduplication identity, it SHALL record and verify the presented `sourceKeyId`, `eventSequence`, and `eventPayloadSha256 = SHA-256(canonical(eventPayload))`. A repeated deduplication identity SHALL be idempotent and counted at most once only when its `eventSequence` and event-payload digest match the accepted event; a different `sourceKeyId` is allowed only when a signed rotation authorizes it within the same `sourceIdentityId` lineage. The same deduplication identity with a different sequence or event-payload digest SHALL be rejected as a conflict rather than replacing the accepted event. Unknown, expired, revoked, or mismatched `sourceIdentityId`/`sourceKeyId` values SHALL be rejected before eligibility, reporting, or publication. Import, deduplication, eligibility, and restore decisions SHALL be durably committed and auditable without copying participant content into the audit entry.
#### Scenario: The same source event arrives through multiple collectors and a restore
- **WHEN** two authorized collectors or a restored backup submit the same signed source event with the same stable `sourceIdentityId` and `eventId`, matching `eventSequence` and `eventPayloadSha256`, and each presented `sourceKeyId` is authorized for that lineage (including an authorized signed rotation)
- **THEN** the authoritative ledger SHALL accept or confirm one canonical event, SHALL make it eligible at most once, SHALL not double count it in any aggregate, and SHALL retain an auditable idempotent decision

#### Scenario: A source event identity is reused with different content
- **WHEN** the same stable `sourceIdentityId` and `eventId` arrive with a different `eventSequence` or `eventPayloadSha256`
- **THEN** the authoritative ledger SHALL reject or quarantine the conflicting contribution, SHALL not replace the accepted event or count the conflict, and SHALL record only a non-content conflict decision

#### Scenario: A collector submits an untrusted source key
- **WHEN** a contribution names an unknown, expired, revoked, or registry-mismatched `sourceIdentityId`, or a `sourceKeyId` that is not authorized for that lineage or whose public key does not match
- **THEN** the ledger SHALL reject it before it becomes eligible or reportable and SHALL record the rejection without storing participant content in the audit trail

### Requirement: Signed encrypted offline consolidation and receipt
When a scan station cannot reach the authoritative ledger, the station SHALL keep participant records in its encrypted institution-controlled storage and SHALL be prohibited from publishing, exporting a report, or marking records reporting-eligible. An authorized operator MAY move a canonical contribution manifest and encrypted contribution bundle only through an institution-controlled offline channel. The station SHALL sign the manifest; the bundle SHALL be encrypted to the authoritative ledger; and ledger import SHALL verify station registration, signature, bundle sequence, `sourceIdentityId`/`sourceKeyId` lineage status, source-event identity, `eventSequence` and `eventPayloadSha256`, replay state, and transfer integrity before one atomic consolidation.

The authoritative ledger SHALL issue a signed consolidation receipt containing a non-content contribution digest, ledger identity and version, accepted/rejected/conflict counts, and reconciliation status. The station SHALL retain that receipt with its local import state and SHALL not treat the contribution as consolidated without it. Replayed, tampered, forked, or stale bundles and restores SHALL be rejected or quarantined, and a restore SHALL NOT clear or reset prior deduplication, eligibility, suppression, or release decisions. No participant record or offline bundle SHALL be sent to Supabase.

#### Scenario: A disconnected station is consolidated later
- **WHEN** an authorized operator transfers a signed encrypted contribution bundle from a disconnected station to the authoritative ledger
- **THEN** the ledger SHALL validate and atomically reconcile the bundle, issue a signed receipt, and make only accepted non-conflicting events eligible while the station remains unable to publish independently

#### Scenario: Offline consolidation or restore is replayed or tampered
- **WHEN** an old, duplicate, modified, forked, or stale bundle or backup is submitted
- **THEN** the ledger SHALL reject or quarantine it without replacing canonical state or increasing eligible counts, and SHALL retain a non-content audit decision

### Requirement: Authoritative snapshot identity and atomic disclosure ledger
The authoritative ledger SHALL own aggregate snapshot creation, eligibility, suppression, differencing, and release decisions. Every snapshot identity SHALL include the approved study/cohort, reporting period, metric definition, report version, authoritative eligible-population digest, and authoritative input-set digest. The ledger SHALL derive the identity from a canonical encoding of those values and SHALL freeze the corresponding population and input set for the snapshot.

An exact retry with the same canonical descriptor and approved payload SHALL be idempotent. A request that reuses a snapshot identity with a different approved cohort, period, metric definition, report version, eligible-population digest, input-set digest, or payload SHALL be rejected as a conflict and SHALL NOT overwrite or merge the existing snapshot. New consolidated input SHALL produce a new snapshot identity rather than silently changing a released result.

One atomic, persistent suppression/differencing ledger SHALL govern every researcher view, export, offline handoff, and publication. It SHALL record canonical released and suppressed cells with their snapshot/population/query scope, detect complementary, subset, repeated-period, and cross-collector combinations, and preserve decisions across retries and restores. Every release SHALL require the authoritative ledger's decision and signed receipt; an independent collector SHALL not publish a complementary cell or bypass a prior suppression decision. If the ledger is unavailable or inconsistent, the operation SHALL fail closed.

#### Scenario: Snapshot inputs differ despite matching report labels
- **WHEN** an operator requests a snapshot with the same approved cohort, period, metric definition, and report version as an existing snapshot but a different authoritative eligible-population or input-set digest
- **THEN** the ledger SHALL reject the conflicting snapshot identity or assign a distinct identity according to the canonical descriptor, SHALL not overwrite the existing snapshot, and SHALL not publish either result without a valid release decision

#### Scenario: Separate collectors request complementary cells
- **WHEN** separate collectors request or attempt to publish cells whose combination could derive a suppressed cell
- **THEN** the single authoritative suppression/differencing ledger SHALL suppress or refuse the revealing result consistently across views, exports, and publication, and the collectors SHALL be unable to publish independently

#### Scenario: View, export, and publication race for one cell
- **WHEN** a view, export, and publication request for related cells execute concurrently
- **THEN** each request SHALL consult and update the same persistent disclosure ledger atomically, and no request SHALL observe or release a cell that the committed suppression decision forbids


### Requirement: Collector releases SHALL be packaged and provisioned as approved compatible artifacts
The institution SHALL distribute each collector release as an approved, integrity-protected package that declares its application, transfer-protocol, content-data, and local-schema versions. The package SHALL contain only the collector software, approved static assets, and provisioning configuration, SHALL contain no participant records or production participant data, and SHALL require institution-controlled provisioning before protected actions are enabled.

#### Scenario: A collector package is prepared
- **WHEN** a collector release package is assembled for distribution
- **THEN** automated package checks SHALL verify its integrity, declared compatibility versions, required static assets, and absence of participant records or direct identifiers, and SHALL block installation of an unsigned, incomplete, or incompatible package

#### Scenario: A collector workstation is provisioned
- **WHEN** an institution provisions a supported workstation with an approved package
- **THEN** provisioning SHALL bind the approved study and collection point, operator roles, encryption and retention policy, and supported transfer and content versions, and the workstation SHALL remain blocked until those settings are valid

### Requirement: A collector device SHALL pass acceptance before production collection
The institution SHALL accept a collector device for production only after verifying supported hardware and operating-system configuration, encrypted local storage, authorized roles, offline QR collection and acknowledgement, prohibited network egress, local audit, backup and recovery, and the installed release's compatibility with the participant application.

#### Scenario: A new or reimaged device undergoes device acceptance
- **WHEN** a new or reimaged workstation is presented for production collection
- **THEN** an acceptance run SHALL exercise a synthetic offline QR transfer, duplicate detection, acknowledgement, encrypted persistence, audit and recovery checks, role restrictions, and network-egress checks, and a failed check SHALL block participant collection

### Requirement: Collector deployment SHALL enforce release compatibility
The institution SHALL deploy a collector only when its declared transfer-protocol, content-data, and local-schema versions are explicitly compatible with the approved participant application release and SHALL retain a tested prior compatible collector package for recovery.

#### Scenario: A participant application and collector release are accepted together
- **WHEN** a participant application release is promoted for production collection
- **THEN** the institution SHALL verify the matching collector compatibility declaration with a synthetic transfer and acknowledgement before enabling that application and collector combination

#### Scenario: An incompatible release reaches a collection point
- **WHEN** the collector detects an unsupported or incompatible participant transfer or application version
- **THEN** it SHALL refuse participant import and acknowledgement before data becomes importable, explain that a compatible release is required, preserve existing local data, and keep the prior tested compatible package available for recovery

### Requirement: QR collection and report screens SHALL meet accessible interaction requirements
The QR collection, transfer review, acknowledgement, aggregate-view, and reports screens SHALL satisfy WCAG AA contrast requirements, SHALL be operable with keyboard-only input and supported touch input, SHALL expose accessible names for controls and accessible status text for scan progress, validation, acknowledgement, errors, and report updates, and SHALL provide touch targets of at least 44 by 44 CSS pixels. These screens SHALL remain usable at viewport widths of 320 pixels and above, and each collector release SHALL undergo screen-reader validation.

#### Scenario: An operator performs collection and reporting without a pointer
- **WHEN** an operator uses keyboard input, supported touch input, or a screen reader to scan, review, acknowledge, or view reports
- **THEN** every control SHALL have a visible focus state and accessible name, SHALL be reachable without a focus trap or pointer-only action, and SHALL expose scan, validation, acknowledgement, error, and report status changes to assistive technology

#### Scenario: Collection and report screens are viewed at the narrowest supported width
- **WHEN** a QR collection, transfer review, acknowledgement, aggregate-view, or reports screen is displayed at 320 CSS pixels wide
- **THEN** required content and actions SHALL reflow without clipping or unusable overlap, and every actionable touch target SHALL be at least 44 by 44 CSS pixels

#### Scenario: A collector accessibility release check is performed
- **WHEN** a collector release is evaluated against WCAG AA contrast and with a supported screen reader
- **THEN** the evaluation SHALL pass the required contrast checks and the screen reader SHALL announce each control's accessible name and each collection, validation, acknowledgement, error, and report status

### Requirement: Register participant source keys before ordinary collection
The provisioned collector SHALL support the exact first-registration transcript before accepting any ordinary export. It SHALL present a root-signed bounded-fresh `RegistrationOffer`, verify the participant-signed proof-of-possession `RegistrationRequest` containing the installation `sourcePublicKey`, concrete `sourceKeyId`, `registrationOfferId`, and fresh `registrationRequestId`, and obtain an authoritative-ledger assignment of stable `sourceIdentityId`. It SHALL verify the domain-separated signatures, exact study/site/collector/offer/challenge/freshness bindings, P-256/P1363 sizes, and single-use/replay state.

The collector and authoritative ledger SHALL return a `RegistrationReceipt` with collector and ledger signatures, receipt digest, request/offer IDs, stable source identity, concrete source key/public-key bytes, registration freshness epoch/counter, and ledger sequence. Registration objects SHALL be bounded (4,096-byte offer/request, 8,192-byte receipt) and SHALL contain no activity records, enrollment, projections, envelope, bootstrap, frames, or acknowledgement data. The collector SHALL persist the receipt and source-key lineage in encrypted local storage before opening a normal fresh export offer.

#### Scenario: First registration succeeds offline
- **WHEN** an authorized collector and participant complete the fresh registration transcript without network access
- **THEN** the authoritative local ledger SHALL assign one lineage, the collector SHALL persist the signed receipt, and the participant SHALL be allowed to start only a newly issued normal `Offer` after receipt verification; no activity record SHALL be transferred during registration

#### Scenario: Registration lookup, reinstall, rotation, mismatch, or replay occurs
- **WHEN** a recovered installation presents its receipt/key tuple, a registry lookup is requested, an authorized signed key transition is presented, or any offer/request/receipt/key/study/site value mismatches or replays
- **THEN** the collector SHALL reuse only the exact registered lineage and return registration metadata (never participant events), retain identity across valid rotation, and fail closed for missing key, mismatched bytes, stale freshness, revoked key, cross-scope data, or non-identical replay without issuing export or acknowledgement

### Requirement: Issue and verify authenticated missing-frame status
When a valid transfer is incomplete, the collector SHALL create and durably sequence a `MissingFrameStatus` whose exact body binds `protocolVersion`, `studyId`, `collectionPointId`, `collectorIdentityKeyId`, `offerId`, `collectorSessionId`, `collectorTransferKeyId`, `transferId`, `bootstrapDigest`, `envelopeDigest`, `statusState`, `statusSequence`, `frameCount`, exactly one bounded sorted-unique `missingFrameIndexes` list or compact `missingFrameBitmap`, and the accepted `freshnessEpoch`/`freshnessCounter`. It SHALL sign the body with the collector missing-status domain, cap it at 8,192 canonical bytes and 4,096 frames, and set bitmap length to `ceil(frameCount/8)` with unused bits zero.

#### Scenario: Participant resumes with a valid status
- **WHEN** the participant presents a status with the exact active transfer tuple and a sequence newer than the last accepted status
- **THEN** the collector SHALL accept only the requested frame positions, ignore exact duplicate statuses/frames idempotently, and continue import only after complete envelope validation

#### Scenario: A status is wrong, stale, tampered, or replayed
- **WHEN** status signature/key, tuple/digest, freshness epoch/counter, sequence, state, indexes, bitmap, or canonical encoding fails
- **THEN** the collector SHALL reject it, retain prior partial state, emit no participant acknowledgement, and record only minimized non-content audit metadata

### Requirement: Return a signed compact ledger receipt for every acknowledged event outcome
After one atomic authoritative-ledger transaction imports or confirms every event, the collector SHALL place an `EventLedgerReceipt` inside the signed `AcknowledgementBody`. Its body SHALL bind study, source identity/key, offer/session/collector-transfer-key, transfer, envelope digest, `importTransactionId`, `ledgerSequence`, `eventCount`, and `eventSetDigest`; it SHALL carry `outcomeEncoding:importedBitOneDuplicateBitZeroLsbFirst`, an exact-length outcome bitmap in participant event order, and signed `ledgerReceiptKeyId`. `eventSetDigest` SHALL hash the canonical ordered `(eventId,eventSequence,eventPayloadSha256)` list known to the participant; the receipt digest SHALL hash its exact body; the receipt signature SHALL use `gamer-icu/qr/v1/event-ledger-receipt/ledger`.

The collector SHALL use `importResult:imported` only if at least one bit is imported and `duplicate` only if all bits are duplicate. Any conflict, rejected event, partial/failed ledger transaction, receipt mismatch, or invalid source-key lineage SHALL issue no acknowledgement and SHALL not mark data deletion-eligible.

#### Scenario: Acknowledgement transports verifiable outcomes
- **WHEN** a complete transfer imports or exactly duplicates all events
- **THEN** the collector SHALL sign the acknowledgement containing the receipt object/signature and matching receipt digest, and the participant SHALL be able to recompute the event-set digest and verify every bit before deletion

#### Scenario: Conflict cannot be acknowledged
- **WHEN** any event has a conflicting sequence/digest or the receipt cannot bind the exact transaction/envelope/source tuple
- **THEN** the collector SHALL reject the candidate batch, preserve canonical ledger state, and issue neither a ledger receipt nor an acknowledgement