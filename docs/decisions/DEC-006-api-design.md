# DEC-006 — API Design Standard

**Status:** Approved

## Context
GraphQL, gRPC, and CQRS each solve real problems (flexible querying, high-performance internal RPC, read/write model separation) — but each adds meaningful complexity that isn't justified by MVP-stage traffic or team size.

## Decision
**REST only** for the MVP. Versioned under `/api/v1`. No GraphQL, no gRPC, no CQRS (the lightweight domain-event bus from TEC-001 is an internal decoupling mechanism, not CQRS — no separate read/write models or event sourcing).

## Consequences
**Gain:** simplest possible mental model for a small team; easiest to document (OpenAPI/Swagger), test, and debug; every engineer already knows REST.
**Give up:** clients that want flexible field selection (GraphQL's strength) don't get it — acceptable since we control both the Flutter and Next.js clients and can shape REST endpoints to their actual needs.

## Revisit trigger
- GraphQL: if the admin dashboard's data needs become highly variable/nested and REST endpoints start multiplying to serve slightly different shapes.
- CQRS: if write-heavy paths (e.g., matching at high concurrency) need independent scaling from read paths.
Neither is anticipated before PMF.
