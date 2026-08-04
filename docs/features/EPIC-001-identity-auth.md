# EPIC-001 — Identity & Authentication

|                       |                                                                                                                                                                                        |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Feature ID**        | EPIC-001                                                                                                                                                                               |
| **Status**            | Proposed — Pending Approval                                                                                                                                                            |
| **Maps to**           | TEC-001 §17 "Module 1 — Identity & Auth"                                                                                                                                               |
| **Related APIs**      | `POST /api/v1/auth/sync`, `GET /api/v1/auth/me`                                                                                                                                        |
| **Related DB Tables** | `users`, `verifications` (both already in `prisma/schema.prisma`, no migration needed)                                                                                                 |
| **Related Screens**   | Splash, Onboarding, Login, Registro, Recuperación de contraseña (PRD-002 §5)                                                                                                           |
| **Dependencies**      | `FirebaseAuthGuard` (done, DEC-005), Prisma/`PrismaService` (done), Firebase project with Email/Password + Google + Apple + Phone providers enabled (external, not yet confirmed done) |
| **References**        | TEC-001 §3, §6, §7, §11, §17 · DEC-005 · DEC-006 · DEC-009 · PRD-002 §3/§5 · PRD-003 §3                                                                                                |

This spec follows TEC-001 §17's Development Workflow template. Per that template and [[feedback-wait-for-approval]]: **no implementation starts until this write-up is approved.**

---

## 1. Functional Specification

**Objective.** Turn a Firebase-authenticated client into a known InSpot user server-side: verify the client's Firebase ID token on every protected request, and maintain a `users` row keyed by `firebase_uid` that the rest of the backend (HotSpot, Discovery, Chat, etc.) can join against. This is the foundation every other module's auth depends on.

**In scope:**

- Real upsert logic behind the existing `POST /auth/sync` stub (`apps/api/src/modules/identity/`) — currently returns `501` per `apps/api/README.md`.
- A read endpoint (`GET /auth/me`) so the client can fetch its synced state (`verificationStatus`, `displayName`, etc.) without re-deriving it from the Firebase token, which doesn't carry Postgres-side fields.
- Reflecting Firebase-verified email/phone claims (`email_verified`, `phone_number` on the decoded ID token) into the `verifications` row's `emailVerified`/`phoneVerified` flags and recomputing `overallStatus`.
- Password recovery: no backend work — Firebase Auth's built-in "send password reset email" is called directly from the Flutter client (TEC-001 §6.1). Documented here only so it isn't accidentally re-scoped as backend work later.

**Out of scope (deliberately, per DEC-011):**

- **Selfie + liveness verification.** TEC-001 §3 defines this as its own pluggable `verification/` module (`start-verification`, `submit-selfie`, `review-verification` use-cases, admin review queue, Firebase Storage upload). It writes to the _same_ `verifications` table this epic reads, but none of that logic ships here. Consequence: within EPIC-001, `verifications.overallStatus` can reach at most `PARTIAL` — `VERIFIED` requires `selfieStatus`/`livenessStatus` = `PASSED`, which only the future Verification epic can set.
- **Profile creation/edit** (PRD-002 §3: "Creación de perfil", "Edición de perfil") — separate Profile module, not part of auth.
- **Business custom claims** (`role: business_owner`, TEC-001 §6.6) — depends on a Business/approval module that doesn't exist yet (no `businesses` table). Flagged for its own epic once Business module scope is approved.
- **Account deletion** — not in PRD MVP scope; not added speculatively.

---

## 2. User Flow

```
New user:
  Splash → Onboarding → "Sign up" (Firebase Auth SDK: email/password | Google | Apple | phone OTP)
    → Firebase issues ID token to client
    → Client calls POST /api/v1/auth/sync with the token
    → Backend verifies token, creates `users` row (+ empty `verifications` row), returns profile
    → Client proceeds to profile creation (separate epic) → Home

Returning user:
  Splash → Firebase SDK silently refreshes cached session (or shows Login if none)
    → Client calls GET /api/v1/auth/me with a fresh token
    → 200: backend returns known user → Home
    → 404: token is valid but no `users` row yet (e.g. Firebase account exists, sync
      was interrupted) → client calls POST /auth/sync to (re)create it → Home

Password recovery:
  Login screen → "Forgot password" → Firebase Auth SDK sendPasswordResetEmail(email)
    → user receives email directly from Firebase → resets → returns to Login
    (Backend is never involved — no InSpot API call in this branch.)

Email verification (async, not a blocking screen):
  Firebase sends the verification link automatically on signup → user taps it whenever
    → next POST /auth/sync or GET /auth/me call re-reads the ID token's `email_verified`
      claim and updates `verifications.emailVerified` → no dedicated screen needed for MVP.
```

---

## 3. Database Entities

No schema changes — both tables already exist in `prisma/schema.prisma`. This epic is the first to actually write to them.

**`users`** (fields this epic reads/writes):

| Field                | Written by                                                                                                                                          |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `firebaseUid`        | Set once, on first sync. Immutable — it's the join key.                                                                                             |
| `email`              | Synced from the ID token's `email` claim on every sync call.                                                                                        |
| `displayName`        | Set from Firebase's `name` claim on first sync only; later edits belong to the Profile epic, not overwritten by subsequent syncs.                   |
| `verificationStatus` | Denormalized copy of `verifications.overallStatus`, kept in sync so other modules can filter on `users` alone without a join (per TEC-001 §5 note). |

**`verifications`** (fields this epic reads/writes):

| Field                            | Written by                                                                                                      |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `emailVerified`                  | Set from ID token's `email_verified` claim.                                                                     |
| `phoneVerified`                  | Set to `true` if the ID token carries a `phone_number` claim (Firebase only issues one after OTP confirmation). |
| `selfieStatus`, `livenessStatus` | **Not touched by this epic** — remain `NONE` until the Verification epic ships.                                 |
| `overallStatus`                  | Computed (see below), not client-settable.                                                                      |

**`overallStatus` computation** (pure function, no new table):

```
UNVERIFIED  — emailVerified = false AND phoneVerified = false
PARTIAL     — emailVerified = true OR phoneVerified = true (selfie/liveness not yet applicable)
VERIFIED    — PARTIAL conditions met AND selfieStatus = PASSED AND livenessStatus = PASSED
REJECTED    — selfieStatus = FAILED OR livenessStatus = FAILED (set by future Verification epic only)
```

Within EPIC-001's scope, only the `UNVERIFIED`/`PARTIAL` transitions are ever produced.

---

## 4. API Contract

Global prefix `/api/v1` (already set in `main.ts`). Both routes sit under the existing `IdentityController` (`apps/api/src/modules/identity/`), guarded by the existing `FirebaseAuthGuard`.

### `POST /api/v1/auth/sync`

Idempotent upsert, keyed by `firebase_uid` from the verified token — never a client-supplied ID.

**Request**

```
Headers: Authorization: Bearer <firebase-id-token>
Body (SyncUserDto, already defined):
{
  "email"?: string,        // IsOptional, IsEmail — used only if token lacks an email claim (rare)
  "displayName"?: string   // IsOptional, IsString
}
```

**Response `200 OK`** (existing user, re-synced) / **`201 Created`** (first sync):

```json
{
  "id": "uuid",
  "firebaseUid": "string",
  "email": "string | null",
  "displayName": "string | null",
  "verificationStatus": "UNVERIFIED | PARTIAL | VERIFIED | REJECTED",
  "createdAt": "ISO-8601",
  "updatedAt": "ISO-8601"
}
```

**Errors** (using the existing `ErrorCode` enum / `HttpExceptionFilter` shape):

| Status | errorCode          | When                                                                                    |
| ------ | ------------------ | --------------------------------------------------------------------------------------- |
| 401    | `UNAUTHORIZED`     | Missing/invalid/expired bearer token (guard-level, already implemented)                 |
| 422    | `VALIDATION_ERROR` | `email` present but malformed                                                           |
| 409    | `BAD_REQUEST`*     | Token's email/phone collides with a _different_ `firebaseUid`'s row (see Edge Cases §8) |

\* No dedicated `CONFLICT` code exists yet in `ErrorCode`; this epic proposes adding `ErrorCode.CONFLICT` mapped to `409` — the one addition to shared code this epic needs.

### `GET /api/v1/auth/me`

**Request:** `Authorization: Bearer <firebase-id-token>` only, no body.

**Response `200 OK`:** same shape as `POST /auth/sync`.

**Errors:**

| Status | errorCode      | When                                                                               |
| ------ | -------------- | ---------------------------------------------------------------------------------- |
| 401    | `UNAUTHORIZED` | Missing/invalid/expired token                                                      |
| 404    | `NOT_FOUND`    | Valid token, but no `users` row yet (client should fall back to `POST /auth/sync`) |

---

## 5. Firebase Integration

- **Client (Flutter, not built yet — separate mobile work):** Firebase Auth SDK handles sign-up/sign-in UI and flows directly (Email/Password, Google, Apple, Phone OTP per DEC-005). The client never talks to InSpot's backend for credential handling — only to exchange the resulting ID token via `/auth/sync`/`/auth/me`.
- **Backend (already scaffolded):** `FirebaseAuthGuard` (`apps/api/src/common/guards/firebase-auth.guard.ts`) initializes the Admin SDK from `FIREBASE_PROJECT_ID` / `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` (validated in `env.validation.ts`) and calls `admin.auth().verifyIdToken(idToken)`, attaching the decoded token to `request.user`. This epic only _consumes_ `request.user` — no guard changes needed except the revocation check below.
- **Proposed guard change:** switch to `verifyIdToken(idToken, /* checkRevoked */ true)`. Today the guard accepts any token that's cryptographically valid, even if the Firebase account was disabled/deleted after issuance (see Edge Cases §8). This is a one-line change to existing scaffolded code, called out here since it's this epic's dependency, not a new module.
- **Custom claims:** not set or read by this epic (see Out of Scope).
- **FCM:** not touched — notification registration is a separate concern.

---

## 6. Security Considerations

- **Single verification point.** All identity comes from `FirebaseAuthGuard`; this epic never trusts a client-supplied `firebaseUid`, `email`, or `id` — the token is the only source of truth for who the caller is (DEC-005).
- **No custom credential storage.** No passwords, OTP codes, or session tokens are ever persisted by InSpot's backend — consistent with DEC-005's "no custom auth system."
- **Revoked/disabled accounts.** Addressed via `checkRevoked: true` above — otherwise a disabled Firebase account keeps working against InSpot until its (up to 1h) ID token expires.
- **Race on first sync.** Two near-simultaneous `POST /auth/sync` calls for a brand-new `firebaseUid` (e.g. app retried a slow request) must not create two `users` rows or crash unhandled — implemented as a DB-level upsert (`prisma.user.upsert` on the unique `firebaseUid`), not a read-then-write.
- **Cross-account collision.** `users.email` and `users.phone` are `@unique` in the schema. If a token's email claim collides with a _different_ existing `firebaseUid`'s row (e.g. someone linked the same email to two Firebase providers oddly), the upsert must fail loudly (`409`, see §4) rather than silently overwriting another user's row.
- **PII minimization.** Only `email`, `phone` (via `verifications`), and `displayName` are stored — no raw tokens, no auth provider metadata, nothing beyond what other modules actually need.
- **Logging.** `LoggingInterceptor` already logs only `request.user?.uid`, never headers or token contents — this epic adds no new logging surface that needs redaction review.
- **Rate limiting.** `/auth/sync` and `/auth/me` should sit behind the same per-IP/per-uid rate limit InSpot applies elsewhere once a rate-limiting mechanism exists globally (not yet scaffolded anywhere in the API) — flagged as a repo-wide dependency, not solved ad hoc inside this epic.

---

## 7. Acceptance Criteria

- [ ] `POST /auth/sync` with a valid, first-time token creates a `users` row and a linked `verifications` row (default `UNVERIFIED`), returns `201`.
- [ ] `POST /auth/sync` with a valid token for an already-synced user updates `email`/`displayName` from the token and returns `200`, without duplicating rows.
- [ ] `GET /auth/me` returns the current synced state for a known user; `404` for a valid-but-unsynced token.
- [ ] Requests without a bearer token, or with an invalid/expired one, get `401` from the existing guard — unchanged behavior, verified by test, not re-implemented.
- [ ] `verifications.overallStatus` transitions `UNVERIFIED → PARTIAL` correctly as `emailVerified`/`phoneVerified` flip, and never reaches `VERIFIED` from this epic's code paths alone.
- [ ] `users.verificationStatus` always mirrors `verifications.overallStatus` after any sync.
- [ ] A revoked/disabled Firebase account is rejected (`401`) even with a still-cryptographically-valid cached token.
- [ ] No two `users` rows are ever created for the same `firebaseUid` under concurrent sync calls.

---

## 8. Edge Cases

| Case                                                                               | Expected behavior                                                                                                                              |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Concurrent first-sync from two devices (same new `firebaseUid`)                    | Single `users` row created; second call resolves as an update, not a duplicate or crash.                                                       |
| Token valid but Firebase account since disabled/deleted                            | `401`, via `checkRevoked: true` (§5).                                                                                                          |
| Email claim on token already belongs to a different `firebaseUid`'s row            | `409 CONFLICT`; existing row is not overwritten.                                                                                               |
| Phone-only account (no email at all)                                               | `email` stays `null`; `overallStatus` can still reach `PARTIAL` via `phoneVerified` alone.                                                     |
| User verifies email in Firebase _after_ first sync                                 | Reflected on the _next_ `/auth/sync` or `/auth/me` call (token is re-decoded fresh each request) — no webhook/push needed for MVP.             |
| `displayName` missing from token and not supplied in the DTO                       | Stored as `null`; not treated as an error.                                                                                                     |
| Clock skew between client and Firebase causing a "not yet valid" token             | Surfaces as the guard's existing generic `401 Invalid or expired token` — no special case needed, Admin SDK handles skew tolerance internally. |
| Client calls `GET /auth/me` before ever calling `/auth/sync`                       | `404`, client is expected to fall back to `/auth/sync` (documented in User Flow §2).                                                           |
| Malformed `SyncUserDto.email` in the body while the token itself has a valid email | `422`; body validation runs independently of token claims.                                                                                     |

---

## 9. Test Scenarios

**Unit (`identity` service/repository, once written):**

- Upsert creates a new `users` + `verifications` pair for an unseen `firebaseUid`.
- Upsert on an existing `firebaseUid` updates fields without creating a new row.
- `overallStatus` computation: all four input combinations of `emailVerified`/`phoneVerified` produce the documented status (§3), and `selfieStatus`/`livenessStatus` are never read as `PASSED` (nothing in this epic sets them).
- Cross-account email collision throws the mapped `409` error, not a raw Prisma unique-constraint exception.

**E2E (`test/`, extending the existing `health.e2e-spec.ts` pattern):**

- `POST /auth/sync` without `Authorization` header → `401`.
- `POST /auth/sync` with a valid test token (Firebase Auth emulator) → `201` on first call, `200` on repeat.
- `GET /auth/me` before any sync → `404`; after sync → `200` with matching payload.
- `POST /auth/sync` with a malformed `email` in the body → `422`.
- Concurrency test: fire two `POST /auth/sync` calls in parallel for the same new token, assert exactly one `users` row exists afterward.
- Revoked-token test against the Firebase Auth emulator (disable the test user, reuse the previously issued token) → `401`.

---

## 10. Implementation Plan (incremental chunks)

Per the request to implement "each feature incrementally" after approval:

1. **Repository layer** — `UserRepository`/`VerificationRepository` (or a single `IdentityRepository`) wrapping `PrismaService`, with the upsert + `overallStatus` computation as pure, unit-testable functions. No HTTP changes yet.
2. **`POST /auth/sync` real implementation** — wire the controller to the repository layer, replacing the `501` stub. E2E tests from §9 for this endpoint.
3. **`GET /auth/me`** — new route + e2e tests.
4. **Guard hardening** — `checkRevoked: true` change to `FirebaseAuthGuard`, plus the `ErrorCode.CONFLICT` addition, each as its own reviewable diff since both touch shared code outside `identity/`.
5. **Firebase Auth emulator wiring for tests** — needed by chunk 2 onward; called out as its own small chunk since it's test infrastructure, not app logic.

Each chunk ships as its own PR per `CONTRIBUTING.md`'s branch strategy, scoped commit `feat(identity): ...` / `feat(auth): ...` per `commitlint.config.js`'s enum.

---

**Next step:** awaiting approval on this write-up before any implementation chunk begins.
