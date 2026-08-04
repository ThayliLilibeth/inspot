# Security Policy

InSpot is currently in active pre-release development (Sprint 1 — Foundation).
This policy applies to the `main` and `develop` branches.

## Reporting a Vulnerability

Please report suspected security vulnerabilities privately — do not open a
public GitHub issue.

**Contact:** thay.lilibeth@gmail.com

Include when possible:

- A description of the vulnerability and its potential impact
- Steps to reproduce, or a proof-of-concept
- The affected component (`apps/api`, `apps/mobile`, `apps/admin`, or
  infrastructure)

We aim to acknowledge reports within 5 business days.

## Scope

- Authentication and session handling (Firebase Auth — see
  [DEC-005](docs/decisions/DEC-005-authentication.md))
- API authorization and data exposure (`apps/api`)
- Realtime channel security (Socket.IO + Redis — see
  [DEC-007](docs/decisions/DEC-007-realtime.md))
- File storage metadata handling (see
  [DEC-008](docs/decisions/DEC-008-file-storage.md))
- Dependency vulnerabilities across `apps/*` and `packages/*`

## Supported Versions

No tagged releases exist yet. Only the current state of `main` is supported
during pre-release development.

## Disclosure

Please allow time for a fix to be developed before any public disclosure.
Reporters will be credited on request once a fix ships.
