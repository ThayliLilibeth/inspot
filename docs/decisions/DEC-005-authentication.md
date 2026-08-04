# DEC-005 — Authentication

**Status:** Approved

## Context
See TEC-001 §6. Restated here as a binding standard.

## Decision
- **Firebase Authentication** on the client (Flutter): Email/Password, Google, Apple, Phone OTP.
- **Firebase Admin SDK** on the backend (NestJS) verifies ID tokens.
- **`FirebaseAuthGuard`** is the single point of token verification for all protected routes.
- No custom authentication system (no self-rolled password storage, no custom session/JWT issuance).

## Consequences
**Gain:** minimal auth code to build/maintain/secure ourselves; native FCM integration; fast implementation.
**Give up:** vendor lock-in to Firebase for auth; multi-staff business orgs need a workaround (Firebase custom claims) rather than a first-class org model — acceptable for MVP per TEC-001 §6.

## Revisit trigger
If multi-staff business accounts become a real product need, or if Firebase Auth's pricing/limits become a problem at scale, evaluate a dedicated auth provider or self-hosted solution then — not before.
