export type ServiceType =
  | 'llm.chat'
  | 'llm.responses'
  | 'llm.embedding'
  | 'llm.rerank'
  | 'image.generate'
  | 'search.web'
  | 'search.news'
  | 'reader.url'
  | 'custom.http';

export type ProviderType =
  | 'openai_compatible'
  | 'newapi'
  | 'sub2api'
  | 'cpa'
  | 'search'
  | 'reader'
  | 'custom_http';

export type CredentialOwnerType = 'system' | 'user';

export type CredentialStatus =
  | 'ready'
  | 'cooldown'
  | 'quota_exhausted'
  | 'auth_failed'
  | 'rate_limited'
  | 'network_error'
  | 'disabled';

export type RouteStrategy = 'priority' | 'weighted' | 'fallback';

export interface ProviderRef {
  id: string;
  name?: string;
}

export interface CredentialRef {
  id: string;
  name?: string;
}

export interface PoolRef {
  id: string;
  name?: string;
}

export interface RouteRef {
  id: string;
  name?: string;
}

export interface UserRef {
  id: string;
  name?: string;
}
