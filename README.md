# AI API Gateway

Invite-only AI/API Gateway with Web Chat, BYOK, Provider routing, multi-connector upstream support, and search/reader API integration.

## Project Status

This project is in the early PRD and architecture design stage.

## Core Direction

- Invite-only registration
- Redeem code based balance system
- Web Chat as first-class user experience
- OpenAI-compatible API distribution
- Multi-provider Gateway Core
- Connector-based upstream integration
- Sub2API / CPA / New API / OpenAI-compatible / Search / Reader support
- Unified logging, billing, routing and health checks

## Architecture Principle

New API, Sub2API and CPA should not become separate product centers.

They should be treated as internal connectors, upstream services, or reference implementations.

The main platform must provide one unified UI, one billing system, one logging system, and one routing center.
