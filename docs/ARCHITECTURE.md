# Architecture

This project uses a unified Gateway Core with multiple upstream Connectors. All user-facing and API-facing traffic should pass through the same Gateway Core so routing, billing, logging, policy, and provider behavior stay consistent.

## Directory Boundaries

- `apps/web`: User Web Chat and admin console.
- `apps/api`: Main backend API service.
- `packages/core`: Gateway Core, routing, billing, and logging.
- `packages/connectors`: Upstream connectors for OpenAI-compatible, New API, Sub2API, CPA, Search, Reader, and other providers.
- `packages/shared`: Shared types, schemas, and utility functions.
- `infra`: Deployment assets, Docker Compose, and environment templates.
- `scripts`: Development and maintenance scripts.

## Boundary Rules

- `apps/api` calls `packages/core`.
- `packages/core` calls connectors only through standard interfaces.
- `packages/core` must not contain provider-specific hacks.
- Every new upstream provider must be added as a connector.
- Billing must go through the unified Ledger.
- Logs must use the unified `request_id`.
- Web Chat and API calls share the same Gateway Core.
