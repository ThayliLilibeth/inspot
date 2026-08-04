# DEC-008 - File Storage

**Status:** Approved

## Context
TEC-001 already established Firebase Storage behind a StoragePort. This ADR adds a binding rule about where files flow.

## Decision
**Firebase Storage.** Clients (Flutter, and admin where relevant) upload directly to Firebase Storage using scoped security rules. **The backend never proxies or stores file bytes** - it only stores and validates metadata (storage path/reference, content type, upload timestamp, ownership).

## Consequences
**Gain:** backend stays stateless and cheap to run (no file bytes flowing through NestJS compute); simpler scaling story; native Flutter SDK handles retries/resumable uploads.
**Give up:** some validation (e.g., "is this actually a photo of a face") has to happen either client-side or via a follow-up server-side check after upload completes (relevant for the Verification module's selfie flow) rather than inline during upload - acceptable, already anticipated in TEC-001's verification design.

## Revisit trigger
If migrating to Cloudflare R2 (flagged as a future option in TEC-001), only the StoragePort adapter and Firebase Storage security rules change - no backend logic changes, since the backend never touched file bytes to begin with.
