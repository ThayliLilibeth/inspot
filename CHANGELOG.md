# Changelog

All notable changes to InSpot are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Repository governance: `CHANGELOG.md`, `VERSION`, `LICENSE`, `SECURITY.md`, `CODEOWNERS`.

## [0.1.0] - 2026-08-04

### Added

- Repository structure, tooling, and conventions: pnpm workspace, ESLint/Prettier,
  Husky, commitlint, `CONTRIBUTING.md`.
- Architecture Decision Records DEC-001 through DEC-011 (`docs/decisions/`).
- Backend foundation (`apps/api`): NestJS bootstrap, Prisma module and schema,
  Firebase auth guard, structured logging, health checks (Prisma/Redis
  indicators), `identity` module, Socket.IO realtime gateway with Redis adapter.
- Flutter foundation (`apps/mobile`): app bootstrap, `go_router` router, theme,
  splash screen.
- Infrastructure: Docker Compose for local Postgres/PostGIS + Redis, GitHub
  Actions CI workflow (`.github/workflows/ci.yml`), `docs/infrastructure.md`.
