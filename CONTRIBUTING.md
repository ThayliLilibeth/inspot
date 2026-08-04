# Contributing to InSpot

## Branch strategy

| Branch | Purpose |
|---|---|
| `main` | Always production-ready. Protected. Only updated via `release/*` or `hotfix/*` merges. |
| `develop` | Integration branch. Protected. All `feature/*` branches merge here via PR. |
| `feature/*` | One feature/task per branch, branched from `develop`. Example: `feature/auth-email-verification`. |
| `release/*` | Cut from `develop` when preparing a release. Only bugfixes allowed here. Merges into both `main` and `develop`. |
| `hotfix/*` | Cut from `main` for urgent production fixes. Merges into both `main` and `develop`. |

Rules:
- No direct commits to `main` or `develop`.
- Every `feature/*` branch merges via PR, requires CI green (lint, format, test, build), and links back to its Feature ID (see `docs/` feature spec convention) or ADR.
- Squash-merge feature branches into `develop` to keep history clean; the squash commit message must itself be a valid Conventional Commit.

## Commit conventions

All commits follow [Conventional Commits](https://www.conventionalcommits.org/), enforced by commitlint via a Husky `commit-msg` hook.

Format: `type(scope): short description`

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
**Scopes:** app names (`api`, `mobile`, `admin`), domain modules as they come online (`auth`, `hotspot`, `chat`, ...), or cross-cutting (`infra`, `ci`, `docs`, `config`, `deps`, `repo`). Full list in `commitlint.config.js`.

Examples:
```
feat(auth): add email verification
fix(chat): resolve websocket reconnect issue
docs(prd): update MVP scope
chore(infra): add docker-compose for local postgis
```

## Before opening a PR

- `pnpm lint` and `pnpm format:check` pass locally (also enforced by the pre-commit hook and CI).
- `pnpm test` passes for any touched package.
- New/changed behavior for a **product feature** includes the 9-point spec (functional objective, user flow, technical design, DB impact, API design, security considerations, acceptance criteria, risks, implementation plan) linked in the PR description, per our development methodology.
- Infrastructure/tooling changes reference the relevant ADR in `docs/decisions/`, or add a new one if it's a new standing decision.

## Code review expectations

- Clean Architecture / SOLID boundaries respected (no business logic leaking into controllers/widgets).
- No speculative code for unapproved scope (DEC-011).
- Strong typing - no `any` in TypeScript, no untyped `dynamic` in Dart without a documented reason.
