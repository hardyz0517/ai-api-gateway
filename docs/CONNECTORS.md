# Connector Design v1

Connectors adapt upstream providers into the Gateway Core standard interface. Each connector declares and implements only the capabilities it supports. Unsupported capabilities should be explicit so the Gateway Core can route requests safely.

## Unified Interface

- `listModels`: List models available from the upstream.
- `checkHealth`: Check whether the upstream is reachable and usable.
- `chatCompletion`: Execute chat completion requests.
- `responses`: Execute responses-style requests.
- `embedding`: Generate embeddings.
- `search`: Execute search requests.
- `readUrl`: Read and normalize URL content.
- `calculateUsage`: Calculate normalized token, request, and cost usage.
- `normalizeError`: Convert upstream errors into standard Gateway error types.

## Initial Connector Types

- `openai-compatible`
- `newapi`
- `sub2api`
- `cpa`
- `search`
- `reader`
- `custom-http`

## Error Standardization

Connectors must normalize upstream errors into one of these error types:

- `auth_failed`
- `rate_limited`
- `quota_exhausted`
- `model_not_found`
- `upstream_timeout`
- `upstream_unavailable`
- `invalid_request`
- `unknown_error`
