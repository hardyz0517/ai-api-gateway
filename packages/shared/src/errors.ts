export type NormalizedErrorCode =
  | 'auth_failed'
  | 'rate_limited'
  | 'quota_exhausted'
  | 'model_not_found'
  | 'upstream_timeout'
  | 'upstream_unavailable'
  | 'invalid_request'
  | 'unsupported_capability'
  | 'insufficient_balance'
  | 'unknown_error';

export interface NormalizedGatewayError {
  code: NormalizedErrorCode;
  message: string;
  providerMessage?: string;
  providerCode?: string;
  retryable: boolean;
  statusCode?: number;
  requestId?: string;
  cause?: unknown;
}
