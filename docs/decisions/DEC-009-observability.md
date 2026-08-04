# DEC-009 - Observability

**Status:** Approved

## Context
Given the safety-critical nature of the product (panic button, reports), we need enough operational visibility from day one to debug incidents quickly, without building a full tracing stack before we have traffic to justify it.

## Decision
Every backend service must emit **structured (JSON) logs** including, at minimum:
- `requestId` (correlation ID, generated per request)
- `userId` (when authenticated)
- `hotspotId` (when applicable to the request)
- `executionTimeMs`
- `errorCode` (on failures, from a standardized error-code enum, not free-text messages)

Logging is implemented via a Nest `LoggingInterceptor` + a JSON-formatted logger (pino), Cloud Run/Cloud Logging compatible out of the box.

**OpenTelemetry tracing is not implemented yet.** The logging interceptor is structured so a `traceId`/`spanId` field can be added later without changing every call site - but no tracing SDK, exporter, or collector is set up in Sprint 1.

## Consequences
**Gain:** every incident (including panic-button and safety events) is traceable by request/user/hotspot without needing a full observability platform; low setup cost.
**Give up:** no distributed tracing across service boundaries yet - acceptable while the backend is a single modular monolith (TEC-001) with no cross-service calls to trace.

## Revisit trigger
When/if the modular monolith is split into separate services (TEC-001 future scalability roadmap), introduce OpenTelemetry tracing at that point - the structured logging fields already in place make that an additive change, not a rework.
