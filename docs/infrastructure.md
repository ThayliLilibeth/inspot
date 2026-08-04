# Infrastructure — Local Development

Local dev runs two services via Docker Compose: **PostgreSQL 16 with PostGIS 3.4** (`postgis/postgis:16-3.4`) and **Redis 7** (`redis:7-alpine`). See TEC-001 §1/§12 for why PostGIS is required (HotSpot geofencing) even though no geo-query code is scaffolded yet — that's deferred per DEC-011 (see `docs/backlog.md`).

## Starting the stack

```bash
docker compose up -d
docker compose ps      # both services should report "healthy"
```

## Connection strings

Match `apps/api/.env.example`:

- `DATABASE_URL=postgresql://inspot:inspot_dev_password@localhost:5432/inspot_dev?schema=public`
- `REDIS_URL=redis://localhost:6379`

## PostGIS extension

The `postgis/postgis` image enables the `postgis` extension automatically on first boot of a fresh volume. Prisma's schema (`apps/api/prisma/schema.prisma`) does not define any PostGIS-backed columns yet — those arrive with the HotSpot module (DEC-003), once its own Sprint is approved.

## Stopping / resetting

```bash
docker compose down       # stop containers, keep data
docker compose down -v    # stop containers and delete volumes (full reset)
```

## Credentials

Local-only, non-production defaults (`inspot` / `inspot_dev_password`). Never reused for staging/production — those are provisioned separately (Cloud SQL / Memorystore per TEC-001 §15) with secrets managed outside this repo.
