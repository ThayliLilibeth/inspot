# DEC-003 — Backend ORM

**Status:** Approved

## Context
TEC-001 requires PostgreSQL + PostGIS for HotSpot geofencing. Prisma has the best TypeScript DX but no native geography/geometry column support; TypeORM supports PostGIS columns natively but has weaker migration DX and typing.

## Decision
**Prisma** for all standard entities and migrations.
**Raw SQL, isolated inside a dedicated `GeoRepository`**, for all PostGIS-specific geospatial queries (radius search, distance calculations, geofence validation).

Rule: raw SQL for geo queries must never appear outside `GeoRepository` implementations. Every other module depends only on the `GeoRepository`'s typed interface, never on raw SQL directly.

```
apps/api/src/modules/hotspot/infrastructure/
  geo.repository.ts        # interface (port)
  geo.repository.prisma.ts # raw-SQL implementation, the ONLY file with $queryRaw for geo
```

## Consequences
**Gain:** Prisma's migration tooling and generated types for ~95% of the schema; geospatial logic is encapsulated, testable in isolation, and replaceable (e.g., if we later move geo queries to a dedicated service/database).
**Give up:** the geo-query path doesn't get Prisma's compile-time type safety — mitigated by hand-written return-type interfaces on `GeoRepository` methods and unit tests against a real Postgres+PostGIS instance (via Docker/testcontainers).

## Revisit trigger
If geo-query complexity grows significantly (e.g., multi-polygon HotSpots, spatial joins across large datasets) to the point the `GeoRepository` becomes a large, hard-to-maintain surface, evaluate a dedicated geo-query layer or TypeORM for that bounded context only.
