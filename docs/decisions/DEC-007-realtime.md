# DEC-007 — Realtime Communication

**Status:** Approved

## Context
TEC-001 already specified a WebSocket gateway + Redis pub/sub for presence, matching, and chat. This ADR formalizes the specific library choice.

## Decision
**Socket.IO**, via `@nestjs/platform-socket.io` on the backend and `socket_io_client` on Flutter, backed by the Redis adapter for horizontal scaling across API instances (Cloud Run).

Powers: presence (active users per HotSpot), match notifications, chat, and general realtime notifications.

## Consequences
**Gain:** mature ecosystem, built-in reconnection/heartbeat handling, room-based broadcasting maps cleanly onto "per-HotSpot presence room" and "per-conversation chat room," strong NestJS and Flutter support, easy to debug with existing tooling.
**Give up:** Socket.IO's protocol has some overhead versus raw WebSockets — a non-issue at MVP scale.

## Revisit trigger
If message volume/connection count reaches a scale where raw WebSocket or a dedicated realtime infrastructure (e.g., a managed pub/sub service) becomes necessary — not anticipated before significant traction.
