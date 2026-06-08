# AGENTS.md

## Project Identity

This project is an invite-only AI/API Gateway platform with Web Chat, BYOK, multi-provider routing, connector-based upstream integration, and search/reader API support.

The project must prioritize maintainability.

## Core Architecture Rule

The platform must use:

- Unified Gateway Core
- Connector Layer
- Provider / Credential / Pool / Route / Service abstraction
- Unified Ledger
- Unified Request Logs
- Unified Admin Console
- Unified Web Chat

New API, Sub2API, CPA and similar projects must not become separate product centers.

They may only be used as:

- reference implementations
- external upstream services
- internal connectors
- temporary compatibility layers

## Directory Rules

- apps/web contains the user Web Chat and admin console.
- apps/api contains the main backend API service.
- packages/core contains Gateway Core, route engine, billing, logs and shared business logic.
- packages/connectors contains upstream connector implementations.
- packages/shared contains shared types, schemas and utilities.
- infra contains Docker Compose, deployment and environment templates.
- scripts contains development and maintenance scripts.
- docs contains PRD, architecture and design documents.

## Connector Rules

All upstream-specific behavior must be isolated inside packages/connectors.

Do not put provider-specific hacks in packages/core or apps/api.

Bad:

- if provider == "sub2api" in core business logic
- if provider == "cpa" in route engine
- duplicated billing logic inside connector

Good:

- Gateway Core calls a standard Connector interface
- Connector normalizes upstream request/response/error/usage
- Gateway Core handles routing, billing, logging and auth

## Billing Rules

The platform Ledger is the only user-facing billing source.

Upstream systems may provide usage or cost references, but they must not become user-facing billing centers.

All balance changes must be recorded as ledger entries.

## Logging Rules

Every request must have a request_id.

The same request_id should be passed through:

- Web Chat
- API endpoint
- Gateway Core
- Route Engine
- Connector
- Upstream request logs

## UI Rules

There must be one main product UI.

Do not rely on users or normal admins switching between New API UI, Sub2API UI, CPA UI and this platform UI.

External dashboards may only be used as advanced debugging tools.

## Development Workflow

Before making changes:

1. Read this AGENTS.md.
2. Run git status.
3. Inspect only directly relevant files.
4. Avoid reading large context documents unless the task explicitly requires it.

When editing:

1. Keep changes small and focused.
2. Do not mix unrelated refactors.
3. Preserve existing docs unless asked to update them.
4. Prefer explicit abstractions over provider-specific shortcuts.

After editing:

1. Run git status.
2. Report changed files.
3. Do not commit unless explicitly asked.

## Git Rules

Do not use git add .

When committing is requested, use explicit paths with git add -- <paths>.

Use clear commit messages such as:

- docs: add project collaboration rules
- feat(core): add connector interface
- feat(api): add invite registration endpoint
- feat(web): add initial chat layout
- chore: add workspace tooling
