## Purpose
Define a participant-controlled, encrypted and authenticated QR exchange that moves local study records to an authorized onsite collector without cloud or participant-device uploads.

## ADDED Requirements

### Requirement: Complete first registration before ordinary export
A genuinely empty participant installation SHALL complete the canonical first-registration transcript before it may accept an ordinary `Offer` with `offerPurpose:standard`. The collector SHALL present a root-signed, bounded-fresh `RegistrationOffer` whose exact signature-excluded body is `RegistrationOfferBody { protocolVersion, studyId, collectionPointId, collectorId, collectorIdentityKeyId, institutionRootKeyId, registrationOfferId, registrationChallenge, registrationFreshnessEpoch, registrationFreshnessCounter, issuedAt, expiresAt, maxFreshnessAgeSeconds, registrationState:active }`; the root signature SHALL cover `UTF8("gamer-icu/qr/v1/registration-offer/institution") || 0x00 || canonical(RegistrationOfferBody)`. The offer SHALL be at most 4,096 canonical bytes, use a 16-byte `registrationOfferId`, a 32-byte challenge, a monotonic freshness epoch/counter, and no participant-device wall-clock authorization.

The participant SHALL answer with exactly `RegistrationRequest = RegistrationRequestBody { sourceProofSignature }`, where `RegistrationRequestBody` contains `protocolVersion`, `studyId`, `collectionPointId`, `collectorId`, `collectorIdentityKeyId`, `registrationOfferId`, fresh 16-byte `registrationRequestId`, the echoed `registrationChallenge`, `proofPurpose:firstRegistration`, installation `sourcePublicKey`, and its concrete 16-byte `sourceKeyId`. `sourceProofSignature` SHALL cover `UTF8("gamer-icu/qr/v1/registration-request/participant") || 0x00 || canonical(RegistrationRequestBody)` and SHALL prove possession of the exact named P-256 key. The request is at most 4,096 canonical bytes and MUST contain no enrollment, activity, event, projection, envelope, bootstrap, frame, or other participant record.

The collector and authoritative ledger SHALL return exactly `RegistrationReceipt = RegistrationReceiptBody { registrationReceiptDigest, collectorRegistrationSignature, authoritativeLedgerSignature }`, where `RegistrationReceiptBody` binds study/site/collector keys, `registrationOfferId`, `registrationRequestId`, freshness epoch/counter, assigned stable `sourceIdentityId`, `sourceKeyId`, `sourcePublicKey`, `registrationReceiptId`, `registrationLedgerSequence`, `registrationState:registered`, and `issuedAt`. The receipt digest SHALL be `SHA-256(canonical(RegistrationReceiptBody))`; the two signatures SHALL cover the domain-separated collector and ledger preimages named by the canonical profile. The receipt is at most 8,192 canonical bytes.

#### Scenario: A new installation registers without exporting activity
- **WHEN** a new installation verifies a fresh root-signed `RegistrationOffer` and returns a valid proof-of-possession `RegistrationRequest`
- **THEN** the collector/ledger SHALL assign and sign one stable `sourceIdentityId`, the participant SHALL verify both receipt signatures and digest and durably read back the receipt, and neither request nor receipt SHALL transfer or commit an activity record; only after that durable commit may a newly issued normal fresh `Offer` start export

#### Scenario: Registration scope, key, or freshness does not match
- **WHEN** any request/receipt field differs from the offer (study, site, collector key, offer ID, challenge, freshness epoch/counter), or `sourceKeyId` does not name the supplied `sourcePublicKey`, or freshness is stale/expired/regressed
- **THEN** both sides SHALL fail closed without assigning or changing a lineage, emitting bootstrap/frames, acknowledging, deleting, or replacing local data

#### Scenario: Registration replay is presented
- **WHEN** a registration offer, request ID, or receipt ID is replayed
- **THEN** an exact previously committed transcript MAY return the same receipt idempotently, but different bytes, a different source key, or a different study/offer SHALL be rejected and SHALL not create a second `sourceIdentityId`

#### Scenario: Reinstall, registry lookup, or authorized rotation occurs
- **WHEN** a reinstall recovers the encrypted vault and installation key, or a collector/ledger looks up a stored receipt by receipt ID or `(studyId, sourceKeyId, sourcePublicKey)`
- **THEN** the existing `sourceIdentityId` and receipt SHALL be reused and lookup SHALL return registration metadata only; a lost key/receipt blocks export, while a signed old-to-new `KeyTransition` retains the same identity and institution-signed revocation plus fresh physical registration is required for a lost old key

### Requirement: Participant-initiated onsite export
The participant device SHALL start a study-data export only after the participant explicitly requests it at a protocol-approved onsite collection point and selects an authorized provisioned collector session with a successfully validated session offer. The device MUST NOT begin, resume, or complete a participant-data transfer in the background or without that participant action.

#### Scenario: Participant starts an approved collection
- **WHEN** a participant starts export after validating a signed, unexpired session offer for an authorized collector at an approved collection point
- **THEN** the device SHALL create a transfer session and begin displaying encrypted transfer frames, and no remote service SHALL receive the participant records

#### Scenario: Export is cancelled before completion
- **WHEN** the participant cancels an export or leaves the collection point before acknowledgement
- **THEN** the device SHALL stop displaying frames, preserve the unacknowledged participant records, and allow a later participant-initiated retry

### Requirement: Authenticated collector-session bootstrap
The collector SHALL present a signed, scoped, expiring session offer before any participant export. The offer SHALL bind the approved study and collection point, the collector's provisioned transfer key identity, the supported transfer protocol and content-data versions, and a unique collector-session and offer identity; its signature SHALL cover those bindings and the expiration. A collector cancellation or revocation record SHALL be signed and bound to the same offer and session identity. The participant device SHALL verify the offer signature against its provisioned collector trust configuration, exact scope, protocol and content-version support, expiration, cancellation or revocation status, and replay state before creating or resuming an export. The accepted offer identity and collector transfer key SHALL be bound into the authenticated export envelope. A participant device MUST fail closed on any failed check and SHALL emit no participant-data frame, mutate export state, or treat the transfer as acknowledged. An accepted, unexpired offer MAY resume only its same incomplete transfer and MUST NOT authorize a second transfer.

#### Scenario: A valid offer bootstraps an export
- **WHEN** the collector presents an offer whose signature, collector key, study and collection-point scope, session identity, expiration, cancellation status, and supported versions all validate
- **THEN** the participant device SHALL bind the export to that offer, collector key, protocol, and session, SHALL emit encrypted frames only for that binding, and SHALL permit the same still-valid offer to resume that incomplete transfer without starting a second transfer

#### Scenario: An invalid or mis-scoped offer is presented
- **WHEN** the offer signature is invalid or untrusted, or its collector key, study, collection-point, protocol, or session binding does not match the provisioned context
- **THEN** the participant device SHALL fail closed before creating or resuming the export, SHALL emit no participant-data frame, SHALL leave participant records and export state unchanged, and SHALL not treat the transfer as acknowledged

#### Scenario: An expired or canceled offer is presented
- **WHEN** the offer is past its expiration or a signed cancellation or revocation for that offer or session is present
- **THEN** the participant device SHALL fail closed before creating or resuming the export, SHALL emit no participant-data frame, and SHALL retain participant records for a later valid collection

#### Scenario: A replayed offer is presented
- **GIVEN** an offer or session identity was already consumed by a completed or canceled transfer, or was bound to a different transfer
- **WHEN** that offer is presented again
- **THEN** the participant device SHALL fail closed and reject it before export, SHALL emit no participant-data frame, and SHALL not create a second transfer or alter the existing acknowledgement state

#### Scenario: An unsupported offer is presented
- **WHEN** the offer advertises a transfer protocol or content-data version that the participant device does not support
- **THEN** the participant device SHALL fail closed before creating or resuming the export, SHALL emit no participant-data frame, and SHALL retain the participant records for a compatible collector or later retry

### Requirement: Confidential and authenticated transfer envelope
Every export SHALL be an encrypted and authenticated transfer envelope bound to a supported study protocol and content-data version. Only the intended authorized collector SHALL be able to recover the participant records, and the envelope SHALL provide verifiable source authenticity and end-to-end integrity. Participant records, direct identifiers, and cryptographic secrets MUST NOT be readable from a captured QR image or by an unintended collector.

#### Scenario: Captured frames are presented to an unintended collector
- **WHEN** a person captures or presents valid-looking frames to a collector that is not authorized for the transfer
- **THEN** the unintended collector SHALL fail closed without recovering participant records, importing data, or issuing an acknowledgement

#### Scenario: An authenticated envelope is modified
- **WHEN** any encrypted envelope content or its authenticated metadata is modified before scanning completes
- **THEN** the collector SHALL detect the integrity failure and SHALL neither import the envelope nor acknowledge it

### Requirement: Bounded framed QR representation
The device SHALL represent an export as a bounded sequence of QR frames, and each frame SHALL carry enough authenticated transfer metadata to identify the transfer, protocol version, frame position, total frame count, and frame payload integrity. The collector SHALL associate frames only with the matching active transfer and SHALL be able to reconstruct a valid export when frames arrive in any order.

#### Scenario: Frames arrive out of order
- **WHEN** the collector scans all valid frames of one transfer in an order different from their frame positions
- **THEN** the collector SHALL place each frame by its authenticated position, reconstruct the envelope after all required positions are present, and produce the same validated payload as an in-order scan

#### Scenario: A frame belongs to another transfer
- **WHEN** a scanned frame has a transfer identifier or authenticated manifest that does not match the active transfer
- **THEN** the collector SHALL reject that frame without changing the active transfer's collected positions or imported records

### Requirement: Resumable interrupted scanning
The collector SHALL retain validated partial-frame state for an incomplete transfer so that a participant can resume scanning the same transfer and supply only missing frames. An incomplete transfer MUST NOT be imported or acknowledged, and the participant device SHALL retain the export data needed to resume or restart it.

#### Scenario: Scanning is interrupted after a subset of frames
- **WHEN** scanning stops after some, but not all, valid frames have been accepted and the collector session is reopened
- **THEN** the collector SHALL restore the incomplete transfer, identify the missing frame positions, accept the remaining valid frames, and import only after complete validation

#### Scenario: An incomplete transfer is abandoned
- **WHEN** an incomplete transfer is discarded or expires under the approved local retention policy
- **THEN** the collector SHALL discard its partial encrypted-frame state without issuing an acknowledgement, and the participant device SHALL keep its participant records

### Requirement: Authenticate bounded missing-frame status
After a valid partial transfer, the collector SHALL emit exactly one signed `MissingFrameStatus` object whose signature-excluded body is:

```text
MissingFrameStatusBody {
  protocolVersion, studyId, collectionPointId,
  collectorIdentityKeyId, offerId, collectorSessionId,
  collectorTransferKeyId, transferId, bootstrapDigest,
  envelopeDigest, statusState: incomplete|complete|expired|rejected,
  statusSequence, frameCount,
  missingEncoding: indexes|bitmap,
  missingFrameIndexes | missingFrameBitmap,
  freshnessEpoch, freshnessCounter
}
MissingFrameStatus = MissingFrameStatusBody { statusSignature }
```

The status SHALL be at most 8,192 canonical bytes, `frameCount` SHALL be 1–4,096, `statusSequence` SHALL start at zero and strictly increase for the exact offer/session/collector-transfer-key/transfer/bootstrap/envelope tuple, and exactly one missing representation SHALL be present. An index representation SHALL be sorted, unique, zero-based, and no longer than `frameCount`. A bitmap SHALL be exactly `ceil(frameCount/8)` bytes, use least-significant-bit-first frame positions, and have zero unused high bits. `statusSignature` SHALL cover `UTF8("gamer-icu/qr/v1/missing-frame-status/collector") || 0x00 || canonical(MissingFrameStatusBody)`. `freshnessEpoch` and `freshnessCounter` SHALL equal the accepted root-signed freshness evidence; only `statusState:incomplete` may authorize resends.

#### Scenario: An interrupted transfer receives a valid status
- **WHEN** the collector has a valid partial transfer and emits a status with the exact accepted binding, fresh epoch/counter, monotonic sequence, and bounded missing positions
- **THEN** the participant SHALL verify the collector signature and every binding, durably remember the status sequence, and resend only the listed/bitmap-indicated frame positions

#### Scenario: Missing-frame status is stale, tampered, or replayed
- **WHEN** a status has a wrong transfer/bootstrap/envelope digest, unknown key, invalid signature, stale or regressed freshness, non-monotonic sequence, duplicate/unsorted/out-of-range index, malformed bitmap, terminal state, or a replayed conflicting status
- **THEN** the participant SHALL fail closed, emit no frame, leave source records and transfer state intact, and never infer missing positions through an implicit channel


### Requirement: Frame and envelope validation
Before importing any participant record, the collector SHALL validate frame encoding, transfer identity, frame index and count, payload boundaries, protocol and content versions, authenticated integrity, envelope manifest, and complete-record consistency. A malformed, truncated, replay-inconsistent, unauthenticated, or otherwise malicious frame MUST be rejected without mutating a previously accepted complete transfer.

#### Scenario: Malicious or invalid frame is scanned
- **WHEN** a frame has malformed encoding, an out-of-range index, a conflicting duplicate payload, a bad authenticator, or content that fails envelope validation
- **THEN** the collector SHALL reject the frame, record the failure as a local security/audit event, preserve no participant record from that invalid envelope, and issue no acknowledgement

#### Scenario: Valid partial state exists when a bad frame arrives
- **WHEN** a bad frame is scanned during an otherwise valid incomplete transfer
- **THEN** the collector SHALL leave all previously validated positions unchanged, continue to identify the missing positions, and prevent import until a valid replacement is received

### Requirement: Supported-version rejection
The collector SHALL accept only transfer protocol and content-data versions explicitly supported by its provisioned configuration. It MUST reject an unsupported, downgraded, or ambiguous version before participant records become importable, and a version rejection SHALL not be converted into a successful acknowledgement.

#### Scenario: Device uses an unsupported transfer version
- **WHEN** a participant presents a complete export whose protocol or content-data version the collector does not support
- **THEN** the collector SHALL reject the export before import, tell the operator that the transfer version is unsupported, and leave the participant records unacknowledged for a compatible collector or later retry

### Requirement: Out-of-order and duplicate-frame idempotence
The collector SHALL treat a repeated frame with the same transfer identity, position, and authenticated payload as an idempotent duplicate. It MUST ignore such a duplicate without incrementing progress twice, while a same-position frame with conflicting authenticated content SHALL fail validation and SHALL NOT replace the accepted frame.

#### Scenario: The scanner reads one frame twice
- **WHEN** the same valid frame is scanned twice for an incomplete transfer
- **THEN** the collector SHALL retain one frame position, report progress once, and continue reconstruction without duplicating any imported event

#### Scenario: A duplicate position has different content
- **WHEN** a second frame claims an already accepted position but has different authenticated content
- **THEN** the collector SHALL reject the transfer as inconsistent, retain the accepted frame for audit or recovery, and issue no acknowledgement for that transfer

### Requirement: Idempotent completed import
A fully validated transfer SHALL be imported at most once according to its authenticated transfer identity and complete-envelope integrity value, and every contained event SHALL also be checked against the institution-wide `(studyId, sourceIdentityId, eventId, eventSequence, eventPayloadSha256)` identity. Re-presenting a transfer—or presenting the same events in a new offer, envelope, collector, or restore—SHALL return its existing import status or acknowledgement and SHALL NOT create duplicate participant records, duplicate events, duplicate points, or duplicate quiz attempts.

#### Scenario: A participant repeats an already acknowledged export
- **WHEN** the collector receives every frame of a transfer that it previously imported and acknowledged
- **THEN** the collector SHALL recognize the completed transfer, avoid changing participant-level totals or records, and return an acknowledgement consistent with the original import

#### Scenario: Two collector operators submit the same transfer concurrently
- **WHEN** the same complete transfer is submitted through overlapping collector sessions
- **THEN** the collector SHALL commit participant records once, expose one idempotent import outcome, and prevent either session from double-counting the records

### Requirement: Signed acknowledgement and deletion gate
After complete validation and durable local import or an exact institution-ledger duplicate, the collector SHALL issue a signed acknowledgement bound to the transfer identity, complete-envelope integrity value, `(studyId, sourceIdentityId, eventId, eventSequence, eventPayloadSha256)` outcomes, supported version, collector identity, status epoch/sequence, and import result. The participant device SHALL verify the acknowledgement and every binding before treating the export as acknowledged. The device MUST NOT delete, purge, or mark participant records eligible for deletion based on the transfer until that valid acknowledgement has been verified; a conflict SHALL never receive an acknowledgement.

#### Scenario: Import succeeds and acknowledgement verifies
- **WHEN** the collector durably imports a complete transfer and the participant device verifies the signed acknowledgement for that exact transfer
- **THEN** the device SHALL mark that transfer acknowledged and MAY apply only the approved post-acknowledgement retention policy, while the collector retains its auditable import status

#### Scenario: Acknowledgement is absent, invalid, or mismatched
- **WHEN** the collector does not return an acknowledgement or the participant device cannot verify its signature or transfer binding
- **THEN** the device SHALL retain the participant records and export data, SHALL not delete or mark them deletable, and SHALL allow retry or collection by another authorized collector

### Requirement: Transport compact event-ledger receipt inside acknowledgement
After the authoritative ledger atomically imports or identifies an exact duplicate for every event, the collector SHALL put one `EventLedgerReceipt` inside the signed `AcknowledgementBody`. Its exact signature-excluded body is:

```text
EventLedgerReceiptBody {
  protocolVersion, studyId, collectionPointId,
  sourceIdentityId, sourceKeyId,
  offerId, collectorSessionId, collectorTransferKeyId,
  transferId, envelopeDigest, importTransactionId, ledgerSequence,
  eventCount, eventSetDigest,
  outcomeEncoding: importedBitOneDuplicateBitZeroLsbFirst,
  outcomeBitmap, ledgerReceiptKeyId
}
EventLedgerReceipt = EventLedgerReceiptBody {
  eventLedgerReceiptDigest, eventLedgerReceiptSignature
}
```

`eventSetList` SHALL be the participant-known canonical ordered array of `{eventId,eventSequence,eventPayloadSha256}` tuples in the exact exported order, with `eventSequence` strictly increasing; `eventSetDigest = SHA-256(canonical(eventSetList))`. `eventCount` SHALL be 0–4,096 and `outcomeBitmap` SHALL be exactly `ceil(eventCount/8)` bytes, least-significant-bit first, where bit 1 means imported and bit 0 means an institution-ledger duplicate. `eventLedgerReceiptDigest = SHA-256(canonical(EventLedgerReceiptBody))`; the receipt signature SHALL use `gamer-icu/qr/v1/event-ledger-receipt/ledger`. `importResult:imported` SHALL mean at least one imported bit and `importResult:duplicate` SHALL mean all bits are duplicate. Conflict, rejected, partial, or otherwise non-committed events SHALL produce no receipt and no acknowledgement.

#### Scenario: Participant verifies every transported event outcome
- **WHEN** the participant receives an acknowledgement containing a receipt object and signature
- **THEN** it SHALL verify the collector acknowledgement signature and exact binding, recompute the nested receipt digest and event-set digest from its known events, verify the ledger receipt signature/key/transaction/sequence, and check every bitmap bit before marking the transfer acknowledged or entering the deletion gate

#### Scenario: Receipt is missing, altered, or inconsistent
- **WHEN** the nested receipt is missing, its digest/signature/key/binding is invalid, its count or bitmap length is out of bounds, or any bit cannot be matched to the participant-known ordered event list
- **THEN** the participant SHALL retain all source events and transfer state, SHALL not delete or mark data retention-eligible, and SHALL permit only a safe retry


### Requirement: Participant-level cloud boundary
Participant devices SHALL exchange participant-level study data through the local QR process only. They MUST NOT upload participant records, encrypted participant envelopes, participant codes, transfer identifiers, device identifiers, exact event times, or linkable study telemetry to Supabase or any other remote reporting service. Only a separately validated aggregate-reporting flow MAY leave the collector boundary.

#### Scenario: A participant device has network access during collection
- **WHEN** a participant completes a QR transfer while the device is connected to a network
- **THEN** the device SHALL keep all participant-level transfer data off the network and SHALL use the QR exchange as the sole collection path

#### Scenario: A participant attempts a direct cloud export
- **WHEN** a participant or device action requests publication of participant-level data to a remote service
- **THEN** the app SHALL refuse the request, preserve the data locally, and SHALL not emit a participant-level network payload


### Requirement: Use one canonical protocol object and byte profile
Every QR protocol object SHALL use one canonical JSON profile. The wire value SHALL be a JSON object with no duplicate or unknown members, no insignificant whitespace, and no `null`; an absent optional value SHALL be omitted. Member names SHALL be ordered by ascending UTF-16 code-unit lexicographic order, arrays SHALL retain schema order, and the canonical output SHALL be UTF-8 without a BOM. Strings SHALL be valid Unicode scalar sequences already NFC-normalized; unpaired surrogates SHALL be rejected. Quotes and reverse solidi SHALL use only `\"` and `\\`; U+0000 through U+001F SHALL use lowercase `\u00xx`; other scalars SHALL be emitted as UTF-8. Protocol numbers SHALL be non-negative integers at most `9007199254740991`, written as base-10 digits with no sign, leading zero, decimal point, exponent, or `-0`; protocol timestamps SHALL be RFC3339 UTC strings with seconds and `Z`. A receiver SHALL reject a non-canonical source rather than reserialize it.

Every binary, key, digest, nonce, ciphertext, chunk, and signature field SHALL be unpadded base64url (`A-Z`, `a-z`, `0-9`, `-`, `_`, no `=`) of its raw bytes. Random `offerId`, `collectorSessionId`, `transferId`, `sourceIdentityId`, `sourceKeyId`, `registrationOfferId`, `registrationRequestId`, and `registrationReceiptId` values SHALL be 16-byte binary registry values; `registrationChallenge` SHALL be 32 bytes; SHA-256/HMAC values (`payloadSha256`, `bootstrapDigest`, `envelopeDigest`, `registrationReceiptDigest`, `eventLedgerReceiptDigest`, `eventSetDigest`, event payload digests, and frame HMACs) SHALL be 32 bytes; `hkdfSalt` SHALL be 32 bytes; AES-GCM nonces SHALL be 12 bytes with a final 16-byte tag. P-256 public keys SHALL be SEC1 uncompressed 65-byte points beginning `0x04`; ECDSA P-256/SHA-256 signatures SHALL be 64-byte IEEE P1363 `r || s`, never DER. Other key IDs and human-facing study/site labels SHALL be bounded NFC strings unless the institution registers them as binary values, in which case they SHALL use the same unpadded base64url rule. The `hkdfInfo` field SHALL be the base64url encoding of the bytes `canonical(HkdfInfoObject)`, not a nested JSON object.

The following are exact signature- or MAC-excluded bodies; the transmitted object adds only the named authenticator fields:

```text
OfferBody {
  protocolVersion, studyId, collectionPointId, collectorId,
  collectorIdentityKeyId, offerId, collectorSessionId,
  collectorTransferKeyId, collectorEphemeralEcdhPublicKey,
  acknowledgementKeyId, acknowledgementVerificationPublicKey,
  supportedContentVersions, maxFrames, maxChunkBytes,
  offerPurpose: standard, issuedAt, expiresAt,
  maxFreshnessAgeSeconds, offerStatusEpoch,
  offerStatusSequence: 0, offerState: active
}
Offer = OfferBody { institutionAuthorizationSignature, offerSignature }

RegistrationOfferBody {
  protocolVersion, studyId, collectionPointId,
  collectorId, collectorIdentityKeyId, institutionRootKeyId,
  registrationOfferId, registrationChallenge,
  registrationFreshnessEpoch, registrationFreshnessCounter,
  issuedAt, expiresAt, maxFreshnessAgeSeconds,
  registrationState: active
}
RegistrationOffer = RegistrationOfferBody {
  institutionRegistrationOfferSignature
}

RegistrationRequestBody {
  protocolVersion, studyId, collectionPointId,
  collectorId, collectorIdentityKeyId,
  registrationOfferId, registrationRequestId,
  registrationChallenge, proofPurpose: firstRegistration,
  sourceKeyId, sourcePublicKey
}
RegistrationRequest = RegistrationRequestBody { sourceProofSignature }

RegistrationReceiptBody {
  protocolVersion, studyId, collectionPointId,
  collectorId, collectorIdentityKeyId, authoritativeLedgerKeyId,
  registrationOfferId, registrationRequestId, registrationReceiptId,
  registrationFreshnessEpoch, registrationFreshnessCounter,
  sourceIdentityId, sourceKeyId, sourcePublicKey,
  registrationLedgerSequence, registrationState: registered, issuedAt
}
RegistrationReceipt = RegistrationReceiptBody {
  registrationReceiptDigest, collectorRegistrationSignature,
  authoritativeLedgerSignature
}

OfferStatusBody {
  protocolVersion, studyId, collectionPointId, collectorId,
  collectorIdentityKeyId, offerId, collectorSessionId,
  collectorTransferKeyId, offerStatusEpoch, offerStatusSequence,
  offerState, statusReason, issuedAt, expiresAt
}
OfferStatus = OfferStatusBody { statusSignature, institutionStatusSignature }

FreshnessBody {
  protocolVersion, studyId, collectionPointId, collectorId,
  collectorSessionId, offerId, offerStatusEpoch, freshnessNonce,
  authoritativeNow, freshnessExpiresAt, freshnessCounter,
  latestOfferStatusSequence, latestOfferState
}
Freshness = FreshnessBody { institutionFreshnessSignature }

BootstrapBody {
  protocolVersion, studyId, collectionPointId,
  offerId, collectorSessionId, collectorTransferKeyId, transferId,
  offerPurpose, offerStatusEpoch, offerStatusSequence,
  offerState: accepted, replayState: firstUse,
  sourceIdentityId, sourceKeyId, sourceSigningPublicKey,
  participantEphemeralPublicKey, hkdfSalt, hkdfInfo
}
Bootstrap = BootstrapBody { bootstrapSignature }

Manifest {
  protocolVersion, studyId, collectionPointId,
  offerId, collectorSessionId, collectorTransferKeyId, transferId,
  offerPurpose, offerStatusEpoch, offerStatusSequence,
  offerState: accepted, replayState: firstUse,
  appRelease, contentVersion, sourceIdentityId, sourceKeyId,
  eventSequenceStart, eventSequenceEnd, eventCount,
  deviceTimeBasis, payloadSha256, bootstrapDigest,
  participantEphemeralPublicKey, hkdfSalt, hkdfInfo
}
EnvelopeBody { manifest, nonce, ciphertextAndGcmTag }
Envelope = EnvelopeBody { envelopeDigest, sourceSignature }

FrameBody {
  protocolVersion, studyId, collectionPointId,
  offerId, collectorSessionId, collectorTransferKeyId,
  transferId, sourceIdentityId, sourceKeyId,
  offerStatusEpoch, bootstrapDigest, envelopeDigest,
  frameIndex, frameCount, chunkLength, chunkBase64url
}
Frame = FrameBody { frameHmacSha256 }

MissingFrameStatusBody {
  protocolVersion, studyId, collectionPointId,
  collectorIdentityKeyId, offerId, collectorSessionId,
  collectorTransferKeyId, transferId, bootstrapDigest,
  envelopeDigest, statusState: incomplete|complete|expired|rejected,
  statusSequence, frameCount,
  missingEncoding: indexes|bitmap,
  missingFrameIndexes | missingFrameBitmap,
  freshnessEpoch, freshnessCounter
}
MissingFrameStatus = MissingFrameStatusBody { statusSignature }

EventLedgerReceiptBody {
  protocolVersion, studyId, collectionPointId,
  sourceIdentityId, sourceKeyId,
  offerId, collectorSessionId, collectorTransferKeyId,
  transferId, envelopeDigest, importTransactionId, ledgerSequence,
  eventCount, eventSetDigest,
  outcomeEncoding: importedBitOneDuplicateBitZeroLsbFirst,
  outcomeBitmap, ledgerReceiptKeyId
}
EventLedgerReceipt = EventLedgerReceiptBody {
  eventLedgerReceiptDigest, eventLedgerReceiptSignature
}

AcknowledgementBody {
  protocolVersion, studyId, collectionPointId,
  offerId, collectorSessionId, collectorTransferKeyId, transferId,
  sourceIdentityId, sourceKeyId, envelopeDigest,
  eventLedgerReceiptDigest, eventLedgerReceipt,
  importResult: imported|duplicate,
  offerStatusEpoch, offerStatusSequence, offerState: consumed,
  acknowledgementKeyId, issuedAt
}
Acknowledgement = AcknowledgementBody { acknowledgementSignature }
```

Each signature covers the domain-separated preimage `UTF8(domain) || 0x00 || canonical(signature-excluded body)`, with exactly one zero byte. The domains are `gamer-icu/qr/v1/offer/institution`, `gamer-icu/qr/v1/offer/collector`, `gamer-icu/qr/v1/offer-status/collector`, `gamer-icu/qr/v1/offer-status/institution`, `gamer-icu/qr/v1/freshness/institution`, `gamer-icu/qr/v1/bootstrap/participant`, `gamer-icu/qr/v1/envelope/source`, `gamer-icu/qr/v1/registration-offer/institution`, `gamer-icu/qr/v1/registration-request/participant`, `gamer-icu/qr/v1/registration-receipt/collector`, `gamer-icu/qr/v1/registration-receipt/ledger`, `gamer-icu/qr/v1/missing-frame-status/collector`, `gamer-icu/qr/v1/event-ledger-receipt/ledger`, and `gamer-icu/qr/v1/acknowledgement/collector`, matched to the named signature field. `frameHmacSha256` SHALL be `HMAC-SHA-256(frameHmacKey, canonical(FrameBody))`. `Envelope` SHALL be the flat JSON object containing the `manifest`, `nonce`, and `ciphertextAndGcmTag` members of `EnvelopeBody` plus `envelopeDigest` and `sourceSignature`; `EnvelopeBody` SHALL be exactly the object `{manifest, nonce, ciphertextAndGcmTag}` used for digest/signature, not an implementation-defined view. `envelopeDigest` SHALL be `SHA-256(canonical(EnvelopeBody))`; `sourceSignature` SHALL use the envelope/source domain; the exact GCM AAD SHALL be `canonical(Manifest)` and no outer/signature field. The encrypted plaintext SHALL be `canonical({enrollment, events, projectionContributors})`, with events in increasing `eventSequence`, and `payloadSha256` SHALL hash those exact plaintext bytes. The envelope SHALL be transmitted as `canonical(Envelope)` bytes before chunking; a collector SHALL not flatten or reserialize it during reconstruction.

The canonical wire-size limits SHALL be 4,096 bytes for `RegistrationOffer`, `RegistrationRequest`, and `Bootstrap`, 8,192 bytes for `RegistrationReceipt`, `MissingFrameStatus`, `EventLedgerReceipt`, and `Acknowledgement`, 4,096 frames per transfer, 1,024 decoded bytes per frame chunk, and 4,096 events per receipt. A bitmap SHALL have exactly `ceil(count/8)` bytes (at most 512 bytes at these bounds) with unused high bits zero; an index list SHALL be at most 4,096 sorted, unique, zero-based indexes. Key IDs and labels SHALL be at most 64 NFC characters. Exactly one of `missingFrameIndexes` and `missingFrameBitmap` SHALL be present.

Implementations SHALL reproduce these interoperability vectors: `canonical({"a":1,"b":"é"})` is UTF-8 hex `7b2261223a312c2262223a22c3a9227d` and SHA-256 hex `09ad9fd2fb648cb2f62141215828ea00a62c299db05d20aa9ade2f527a301cc6`; `base64url(00 ff 10)` is `AP8Q` with no padding; HMAC-SHA-256 with a 32-byte zero key over `canonical({"chunkBase64url":"AQI","chunkLength":2,"frameCount":1,"frameIndex":0})` is hex `d2f6170171d8e28f1f1865d85451926017be50872cb81a483f55f334757bc0bc`; the fixed registration request body (protocol `qr-v1`, study `study-demo`, point `point-a`, collector `collector-1`, collector key `collector-key-1`, IDs `base64url(00..0f)`/`base64url(10..1f)`/`base64url(20..2f)`, P-256 generator `sourcePublicKey`, challenge `base64url(40..5f)`, `proofPurpose:firstRegistration`) has canonical-body SHA-256 `f2ff0e4485344b5e700e108f2dafa987872ea72efba822b89b822318c5c1f7d2`; the fixed missing status body with `statusSequence:3`, `frameCount:4`, indexes `[1,3]`, `freshnessEpoch:7`, `freshnessCounter:9`, zero bootstrap digest, and 0x11 envelope digest has canonical-body SHA-256 `ed5f7c4da7bfae449ff3dd35ae2bd16a44a60ac529abaca66aad0687c2485507`; its ordered two-event list has SHA-256 `f95e7beb3477bd774450cacfc8a2819f350fc10dcb06908757da4f153a3688cd`; and the fixed receipt body with `eventCount:2`, `outcomeEncoding:"importedBitOneDuplicateBitZeroLsbFirst"`, and `outcomeBitmap:base64url(01)` has canonical-body SHA-256 `01526d84258f6245d2ed212a24a110543c0f0fa380bfb99f0335c6224d855c39`.

#### Scenario: Independent implementations canonicalize the same body
- **WHEN** two implementations serialize the same valid protocol object and compute its digest, signature input, or AAD
- **THEN** both SHALL produce exactly the same member order, UTF-8 bytes, digest/signature input, and cryptographic result, including the fixed vectors

#### Scenario: Noncanonical or padded binary input is scanned
- **WHEN** a QR object uses alternate member order/escaping/number spelling, a `null`, non-NFC string, DER signature, padded base64url, or an invalid binary length
- **THEN** the collector SHALL reject it before cryptographic processing and SHALL not mutate transfer state or issue an acknowledgement

### Requirement: Require institution-root freshness for every offer and resume
An offer SHALL include a root-signed bounded-age authorization and status epoch. The collector SHALL provide a root-signed `FreshnessBody` bound to a fresh participant challenge, the offer/session, the status epoch, a monotonic freshness counter, authoritative UTC values, and the latest known offer status sequence/state. The approved authoritative freshness/time rule SHALL be the institution-controlled time/status authority or its institution-approved hardware-backed monotonic equivalent; the participant device wall clock SHALL never establish offer age, status freshness, or revocation state. The participant SHALL verify the root and collector signatures, exact scope, status sequence/epoch/state, counter monotonicity, signed lifetime, and challenge before creating or resuming a transfer. If evidence is missing, stale, expired, ambiguous, regressed, untrusted, or cannot be checked under the approved rule, the participant SHALL fail closed before bootstrap or frame emission and SHALL retain participant records.

The bounded-age rule SHALL explicitly document that a collector operating offline can miss a later revocation until the signed freshness/offer lifetime expires; this is bounded offline revocation latency, not immediate revocation. The institution SHALL configure the maximum age and status-epoch propagation bound, and the participant SHALL require a new freshness observation after expiry, app restart, or an unbounded interruption.

#### Scenario: A fresh root-authorized offer is presented
- **WHEN** the offer and status signatures validate, the root-signed freshness challenge matches this collection attempt, the status sequence/state equals the latest signed observation, and the bounded authoritative lifetime is valid
- **THEN** the participant SHALL bind the exact offer/session/transfer-key/epoch tuple, permit export, and emit no frame for another binding

#### Scenario: Freshness cannot be established
- **WHEN** the collector presents no freshness evidence, presents an expired or regressed counter, cannot prove the latest status epoch/sequence, or the participant cannot apply the approved authoritative time rule
- **THEN** the participant SHALL fail closed before creating/resuming export, SHALL emit no bootstrap or data frame, and SHALL preserve the source records and unacknowledged transfer state

#### Scenario: An offline revocation is not yet propagated
- **GIVEN** an offer has valid root-signed evidence whose bounded lifetime has not expired
- **WHEN** a later revocation exists but is not present in the evidence available at the collection point
- **THEN** the protocol MAY remain usable only until that configured bounded lifetime, SHALL record the bounded offline revocation limitation, and SHALL reject the offer once freshness/offer evidence expires; it SHALL not claim zero-latency revocation

### Requirement: Enforce institution-wide source-event uniqueness across transfers and restores
The institution SHALL maintain one authoritative encrypted source-event ledger used by every approved collector and backup/restore path. Registration SHALL assign a stable `sourceIdentityId` to the participant's source-key lineage. For every event, the ledger identity SHALL be `(studyId, sourceIdentityId, eventId)` and SHALL store the source key ID, monotonic `eventSequence`, and `eventPayloadSha256 = SHA-256(canonical(eventPayload))`. A participant source-key rotation SHALL append a signed old-to-new transition to the same source identity rather than creating a new identity. The event/projection import and ledger decision SHALL commit atomically.

An exact existing `(studyId, sourceIdentityId, eventId, eventSequence, eventPayloadSha256)` SHALL be an idempotent duplicate even when presented under a new offer, transfer ID, envelope digest, collector, or restored database; the collector SHALL return the original import/acknowledgement result without counting or awarding it again. Reuse of the identity and event ID with a different payload digest or sequence SHALL be a hard conflict: the candidate envelope SHALL be rejected and audited, existing accepted data SHALL not be replaced, and no acknowledgement SHALL be issued. Collector-local ledgers MAY prefilter but SHALL not override the institution-wide ledger.

#### Scenario: A missing acknowledgement causes a new envelope
- **GIVEN** an event was durably accepted but the participant did not receive its acknowledgement
- **WHEN** the same event is retried under a new offer, transfer, envelope, and collector restore
- **THEN** the authoritative ledger SHALL recognize one exact source-event identity, SHALL not duplicate the event or derived points/attempts, and SHALL return an idempotent duplicate result

#### Scenario: An event identity is reused with conflicting content
- **WHEN** an envelope presents an existing `(studyId, sourceIdentityId, eventId)` with a different canonical payload digest or sequence
- **THEN** the collector SHALL reject and audit the conflict, SHALL preserve the accepted event, SHALL not import any conflicting projection, and SHALL issue no acknowledgement

#### Scenario: Two collectors or a restore race to import
- **WHEN** overlapping collectors or a restored backup submit the same event concurrently
- **THEN** one atomic institution-ledger decision SHALL win, all exact repeats SHALL be idempotent, and no path SHALL double-count or re-award the event

#### Scenario: Source-key rotation preserves continuity
- **WHEN** a valid signed transition replaces an old registered source key with a new key while retaining the same `sourceIdentityId`
- **THEN** events from both keys SHALL use the same institution-wide identity space, old events SHALL remain immutable, and a reused event ID SHALL be classified as duplicate or conflict by its canonical digest/sequence rather than treated as a new participant