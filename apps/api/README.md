# apps/api - InSpot Backend (NestJS)

Status: Backend Foundation chunk of Sprint 1 (chunk 3) is scaffolded. No domain/business logic yet.

Contains: NestJS project (`src/main.ts`, `src/app.module.ts`), typed/validated `ConfigModule` (`src/config/`), `FirebaseAuthGuard` (`src/common/guards/`, DEC-005), standardized error codes + exception filter and structured pino logging interceptor (DEC-009), `PrismaService`/`PrismaModule` with `users`/`verifications` models only (`prisma/schema.prisma`), a `GET /api/v1/health` endpoint checking Postgres + Redis (`src/health/`), an `identity` module skeleton (`src/modules/identity/`) with a stubbed `POST /api/v1/auth/sync` route (guarded, DTO-validated, no upsert logic yet), and a Socket.IO gateway scaffold with the Redis adapter wired (`src/realtime/`, DEC-007).

Deferred (see `../../docs/backlog.md`): the PostGIS-isolated `GeoRepository` (DEC-003) belongs to the HotSpot module's own future Sprint, not this one. Real Identity/Auth business logic (the actual `firebase_uid` upsert) ships as TEC-001 §17's "Module 1", once its own 7-point write-up is approved.

Local setup: `cp .env.example .env`, fill in Firebase Admin credentials, then from the repo root `docker compose up -d && pnpm --filter @inspot/api prisma:migrate && pnpm --filter @inspot/api dev`.

See ../../docs/ARCHITECTURE.md and ../../docs/decisions/ for binding standards.
