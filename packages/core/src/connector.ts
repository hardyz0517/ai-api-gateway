import type {
  GatewayRequestContext,
  NormalizedGatewayError,
  ProviderType,
  RequestUsage,
  ServiceType,
} from '@gateway/shared';

export type ConnectorCapability =
  | 'listModels'
  | 'checkHealth'
  | 'chatCompletion'
  | 'responses'
  | 'embedding'
  | 'search'
  | 'readUrl'
  | 'calculateUsage';

export interface ConnectorHealth {
  ok: boolean;
  latencyMs?: number;
  message?: string;
  checkedAt: Date;
}

export interface ConnectorModel {
  id: string;
  name?: string;
  serviceTypes: ServiceType[];
  metadata?: Record<string, unknown>;
}

export type ChatMessageRole = 'system' | 'user' | 'assistant' | 'tool';

export interface ChatMessage {
  role: ChatMessageRole;
  content: string;
  name?: string;
  metadata?: Record<string, unknown>;
}

export interface ChatCompletionInput {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  metadata?: Record<string, unknown>;
}

export interface ChatCompletionOutput {
  id?: string;
  model?: string;
  message?: ChatMessage;
  content?: string;
  finishReason?: string;
  usage?: RequestUsage;
  raw?: unknown;
}

export interface ResponsesInput {
  model: string;
  input: string | ChatMessage[];
  instructions?: string;
  temperature?: number;
  maxOutputTokens?: number;
  stream?: boolean;
  metadata?: Record<string, unknown>;
}

export interface ResponsesOutput {
  id?: string;
  model?: string;
  outputText?: string;
  usage?: RequestUsage;
  raw?: unknown;
}

export interface EmbeddingInput {
  model: string;
  input: string | string[];
  metadata?: Record<string, unknown>;
}

export interface EmbeddingOutput {
  model?: string;
  embeddings: number[][];
  usage?: RequestUsage;
  raw?: unknown;
}

export interface SearchInput {
  query: string;
  serviceType?: Extract<ServiceType, 'search.web' | 'search.news'>;
  limit?: number;
  locale?: string;
  metadata?: Record<string, unknown>;
}

export interface SearchResult {
  title: string;
  url: string;
  snippet?: string;
  publishedAt?: Date;
  metadata?: Record<string, unknown>;
}

export interface SearchOutput {
  query: string;
  results: SearchResult[];
  usage?: RequestUsage;
  raw?: unknown;
}

export interface ReadUrlInput {
  url: string;
  includeHtml?: boolean;
  metadata?: Record<string, unknown>;
}

export interface ReadUrlOutput {
  url: string;
  title?: string;
  content: string;
  html?: string;
  metadata?: Record<string, unknown>;
  usage?: RequestUsage;
  raw?: unknown;
}

export interface GatewayConnector {
  id: string;
  type: ProviderType;
  displayName: string;
  capabilities: ConnectorCapability[];
  listModels(ctx: GatewayRequestContext): Promise<ConnectorModel[]>;
  checkHealth(ctx: GatewayRequestContext): Promise<ConnectorHealth>;
  chatCompletion(input: ChatCompletionInput, ctx: GatewayRequestContext): Promise<ChatCompletionOutput>;
  responses(input: ResponsesInput, ctx: GatewayRequestContext): Promise<ResponsesOutput>;
  embedding(input: EmbeddingInput, ctx: GatewayRequestContext): Promise<EmbeddingOutput>;
  search(input: SearchInput, ctx: GatewayRequestContext): Promise<SearchOutput>;
  readUrl(input: ReadUrlInput, ctx: GatewayRequestContext): Promise<ReadUrlOutput>;
  calculateUsage(raw: unknown, ctx: GatewayRequestContext): Promise<RequestUsage>;
  normalizeError(error: unknown, ctx: GatewayRequestContext): NormalizedGatewayError;
}
