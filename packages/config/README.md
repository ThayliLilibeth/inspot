# packages/config

Shared base configs consumed by apps/api and (later) apps/admin, so both apps start from the same lint/format baseline.

Contains: `tsconfig.base.json` (strict TS compiler options) and `eslint-node.js` (shared Node/TypeScript ESLint rules), both consumed by `apps/api` as of the Backend Foundation chunk. `apps/admin`'s Next.js-flavored config extends this once the Admin Foundation chunk is built. No prettier config here — `.prettierrc.json` at the repo root already covers all apps.
