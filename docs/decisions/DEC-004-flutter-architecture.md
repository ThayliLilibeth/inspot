# DEC-004 — Flutter Architecture

**Status:** Approved

## Context
The mobile app needs state management, dependency injection, navigation, networking, local storage, forms, and localization.

## Decision
| Concern | Choice |
|---|---|
| State management + DI + service location | **Riverpod** (no GetIt — Riverpod's `Provider`/`ProviderContainer` covers DI) |
| Navigation | **go_router** |
| Networking | **Dio** |
| Local storage (sensitive) | **flutter_secure_storage** (tokens, session data) |
| Local storage (non-sensitive) | **shared_preferences** (UI prefs, feature flag cache) |
| Forms | **reactive_forms** |
| Localization | **intl** |

## Consequences
**Gain:** one mental model (Riverpod) covers both state and DI, reducing concept count for the team; compile-safe providers catch DI errors at build time; testing is straightforward via `ProviderContainer` overrides.
**Give up:** Riverpod's DI is less explicit than a dedicated service-locator pattern for engineers coming from other ecosystems — mitigated by consistent folder conventions (`core/providers/`) and onboarding docs.

## Revisit trigger
None anticipated pre-PMF. Would only reconsider if the team scales significantly and a stricter architectural pattern (e.g., Bloc's explicit event/state contracts) becomes valuable for onboarding many engineers at once.
