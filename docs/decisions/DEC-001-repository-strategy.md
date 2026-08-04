# DEC-001 — Repository Strategy

**Status:** Approved

## Context
InSpot has three consumer-facing apps (Flutter mobile, NestJS API, Next.js admin/business dashboard) built by a small team that needs to move fast and keep API contracts in sync.

## Decision
Single monorepo:

```
apps/
  mobile/
  api/
  admin/
packages/
  shared/
  ui/
  config/
docs/
scripts/
```

- `packages/shared` — cross-app TypeScript types (API DTOs, enums) generated/kept in sync from the NestJS OpenAPI spec, consumed by `admin`. Mobile consumes the API contract via generated Dart client, not this package (different language).
- `packages/ui` — shared design tokens / primitives for `admin` (Next.js). Flutter has its own theme system (DEC-004) and does not consume this package.
- `packages/config` — shared lint/tsconfig/prettier base configs.

## Consequences
**Gain:** one CI pipeline, one PR for changes spanning API + admin, single source of truth for types, low coordination overhead for a small team.
**Give up:** repo-level ownership boundaries are looser than separate repos; a bad commit can theoretically affect unrelated apps' CI status (mitigated by path-filtered CI jobs in DEC-011's related tooling, added when CI is built).

## Revisit trigger
If/when a dedicated mobile team forms and needs independent release cadence and access control, extract `apps/mobile` into its own repo. This is a cheap split (git history can be preserved via `git filter-repo`) — not a reason to avoid the monorepo now.
