# DEC-002 — Workspace Tooling

**Status:** Approved

## Context
The monorepo (DEC-001) needs a package manager/workspace tool. Nx and Turborepo offer caching and task orchestration but add config surface and a learning curve.

## Decision
**pnpm workspaces**, plain — no Nx, no Turborepo.

## Consequences
**Gain:** fast install times, disk-efficient (content-addressable store), simple mental model, fast onboarding for new engineers, minimal config.
**Give up:** no build caching or task-graph optimization — `pnpm -r run build` runs every package's build every time. At 3 apps this is a non-issue; it becomes a real cost once CI build times regularly exceed a few minutes.

## Revisit trigger
If CI build/test time becomes a measurable bottleneck (rule of thumb: consistently >5–7 minutes per PR), evaluate Turborepo for remote caching. Do not introduce it speculatively.
