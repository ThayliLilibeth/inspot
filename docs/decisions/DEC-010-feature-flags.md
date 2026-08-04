# DEC-010 - Feature Flags

**Status:** Approved

## Context
TEC-001's Future Business Features roadmap (premium, boosts, sponsored HotSpots, etc.) will need gradual rollout later. Building a flag system after features already exist is more disruptive than building a minimal one alongside the foundation.

## Decision
A **local (in-repo, no external SaaS) feature flag system** from Sprint 1:
- Backend: a `FeatureFlagsModule` reading flags from environment/config (later: a simple `feature_flags` DB table with `key`, `enabled`, `rollout_percentage`, `updated_at`) - no external vendor (e.g., LaunchDarkly) for MVP.
- Flutter: flags fetched from the backend at app start (or via Remote Config later), consumed via a Riverpod provider (`featureFlagsProvider`), never hardcoded `if` checks scattered through UI code.
- Convention: every flag is documented in `docs/feature-flags.md` with owner, purpose, and removal plan (flags are not meant to live forever).

## Consequences
**Gain:** any future feature (premium, boosts, sponsored HotSpots, etc.) can ship dark and be rolled out gradually or killed instantly without a redeploy; reduces risk of any single feature launch.
**Give up:** a small amount of upfront plumbing (flag provider, config table) before there's a concrete feature that needs it - justified because retrofitting flags into already-shipped features is meaningfully more expensive than building the seam now.

## Revisit trigger
If flag volume or targeting complexity (percentage rollouts, user segments, A/B testing) outgrows the local system, evaluate a managed provider. Not needed for MVP.
