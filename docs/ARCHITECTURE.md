# Architecture

The authoritative system architecture for InSpot is **TEC-001 - Software Architecture v1.1**, approved and maintained outside this repository (product/architecture doc store). This file exists to map that document onto the actual repository structure and to record where the two might drift.

## Source-of-truth documents

- PRD-001 - Product Requirements Document
- PRD-002 - MVP Definition
- PRD-003 - Product Scope and Release Plan
- PRD-004 - User Personas
- TEC-001 - Software Architecture v1.1

If anything in this repo's docs contradicts TEC-001, **TEC-001 wins** and this file should be corrected.

## How TEC-001 maps to this repo

| TEC-001 component | Repo location |
|---|---|
| Flutter Mobile App | apps/mobile/ |
| NestJS Modular Monolith (Identity, HotSpot, Discovery, Chat, Safety, Business, Verification, Storage modules) | apps/api/src/modules/* (scaffolded module-by-module per approved Sprint, see DEC-011) |
| Next.js Admin/Business Dashboard | apps/admin/ |
| Shared API contracts | packages/shared/ |
| PostgreSQL + PostGIS | Provisioned via docker-compose.yml (local) / Cloud SQL (deployed environments) |
| Redis | Provisioned via docker-compose.yml (local) / Memorystore (deployed environments) |
| Firebase Auth / Storage / FCM | External services, configured via each app's .env |

## Binding technical standards

See docs/decisions/ for the full ADR log (DEC-001 through DEC-011 as of this writing). These are binding for all future work unless explicitly superseded by a new, approved ADR.

## Feature documentation convention

Every product feature (once scoped and approved, per our development methodology) gets a spec file under docs/features/ with:
- Feature ID
- Related APIs
- Related Database Tables
- Related Screens
- Dependencies
- Acceptance Criteria

This folder is empty as of Sprint 1 - no product features have been scoped yet.
