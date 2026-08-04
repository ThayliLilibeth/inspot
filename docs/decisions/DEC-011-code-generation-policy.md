# DEC-011 - Code Generation Policy

**Status:** Approved

## Context
It's tempting, while scaffolding a foundation, to also stub out modules for features that "will obviously be needed" (e.g., a `matching` module skeleton before Sprint 1's actual scope calls for it). This creates speculative code that has to be maintained, reviewed, and reasoned about before it's actually needed - real technical debt, just incurred early instead of late.

## Decision
**No code is generated unless it belongs to an approved Sprint scope.** Concretely:
- Sprint 1 produces: repo skeleton, tooling, infra config, backend/mobile/admin foundations, health endpoint, auth guard skeleton - exactly what was scoped and approved, nothing more.
- Domain modules (HotSpot, Discovery, Matching, Chat, Safety, Business) are **not** scaffolded until their own Sprint is planned and approved via the 9-point feature template (functional objective, user flow, technical design, DB impact, API design, security, acceptance criteria, risks, implementation plan).
- If an architectural improvement is identified that isn't part of the current Sprint, it is **documented** (as a new ADR draft or a note in `docs/backlog.md`) and **postponed**, not implemented preemptively.

## Consequences
**Gain:** the repository only ever contains code that's actually load-bearing for a shipped or in-progress feature; smaller surface area to review, test, and maintain; every file has a clear reason to exist.
**Give up:** occasionally we'll write a small amount of boilerplate twice (once when a pattern is established, again when the next similar module is built) rather than generalizing early - acceptable; premature abstraction is a worse failure mode than a little repetition at this stage.

## Revisit trigger
This is a standing principle, not a temporary one - it doesn't expire, though the bar for "approved Sprint scope" naturally gets faster to clear as the team and roadmap mature.
