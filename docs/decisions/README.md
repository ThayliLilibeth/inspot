# Architecture Decision Records (ADR)

This folder is the permanent, versioned record of every approved technical decision for InSpot — separate from `TEC-001` (which describes the *system*), these describe the *choices and their tradeoffs*.

Rule: **a decision only gets an ADR once it's approved.** Proposals under discussion stay in chat/planning docs until the Founder approves them, at which point they're written here and become binding for all future work.

| ID | Title | Status |
|---|---|---|
| [DEC-001](./DEC-001-repository-strategy.md) | Repository Strategy — Monorepo | Approved |
| [DEC-002](./DEC-002-workspace-tooling.md) | Workspace Tooling — pnpm Workspaces | Approved |
| [DEC-003](./DEC-003-backend-orm.md) | Backend ORM — Prisma + isolated GeoRepository | Approved |
| [DEC-004](./DEC-004-flutter-architecture.md) | Flutter Architecture — Riverpod | Approved |
| [DEC-005](./DEC-005-authentication.md) | Authentication — Firebase | Approved |
| [DEC-006](./DEC-006-api-design.md) | API Design — REST only for MVP | Approved |
| [DEC-007](./DEC-007-realtime.md) | Realtime — Socket.IO | Approved |
| [DEC-008](./DEC-008-file-storage.md) | File Storage — Firebase Storage, metadata-only backend | Approved |
| [DEC-009](./DEC-009-observability.md) | Observability — structured logging now, OTel later | Approved |
| [DEC-010](./DEC-010-feature-flags.md) | Feature Flags — local implementation from day one | Approved |
| [DEC-011](./DEC-011-code-generation-policy.md) | Code Generation Policy — no speculative modules | Approved |

Each ADR follows the same shape: **Context → Decision → Consequences (what we gain / what we give up) → Revisit trigger** (the condition under which we'd reopen this decision).
