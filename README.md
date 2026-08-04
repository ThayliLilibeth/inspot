# InSpot

Real-life social platform. Not a dating app - a way to connect in real life inside verified locations called **HotSpots** (bars, clubs, cafes, universities, events, festivals, networking events), across four intentions: **Friendship, Networking, Dating, Socializing**.

This is a **pnpm monorepo** containing all InSpot applications and shared packages.

## Repository status

**Sprint 1 - Foundation.** This repository currently contains project scaffolding, tooling, and infrastructure configuration only. No product/business logic has been implemented yet. See `docs/decisions/` for the binding technical standards this foundation follows, and `TEC-001` (linked in `docs/ARCHITECTURE.md`) for the full system architecture.

## Structure

```
apps/
  mobile/    Flutter app (iOS/Android)
  api/       NestJS backend (REST API + WebSocket gateway)
  admin/     Next.js admin / business dashboard
packages/
  shared/    Shared TypeScript types (API contracts), used by admin
  ui/        Shared UI primitives/design tokens, used by admin
  config/    Shared lint/tsconfig/prettier base configs
docs/        Architecture, ADRs, feature specs
scripts/     Repo-level automation scripts
```

## Prerequisites

- Node.js 20+ (see `.nvmrc`)
- pnpm 9+ (`corepack enable` will pick up the pinned version from `package.json`)
- Docker + Docker Compose (for local Postgres/PostGIS + Redis - see `docs/infrastructure.md`)
- Flutter SDK (stable channel) for `apps/mobile`
- Firebase project credentials (see each app's `.env.example`)

## Getting started

```bash
corepack enable
pnpm install
cp apps/api/.env.example apps/api/.env
cp apps/admin/.env.example apps/admin/.env
docker compose up -d
pnpm --filter api dev
```

See each app's own README for app-specific setup:
- [`apps/api/README.md`](./apps/api/README.md)
- [`apps/mobile/README.md`](./apps/mobile/README.md)
- [`apps/admin/README.md`](./apps/admin/README.md)

## Documentation

- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) - links to the source-of-truth architecture (TEC-001) and how this repo implements it
- [`docs/decisions/`](./docs/decisions/) - Architecture Decision Records (binding technical standards)
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) - branch strategy, commit conventions, PR process

## License

Proprietary - InSpot. All rights reserved.
