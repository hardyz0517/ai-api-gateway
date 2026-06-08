import type { ServiceType } from './domain';

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface RequestUsage {
  serviceType: ServiceType;
  model?: string;
  tokenUsage?: TokenUsage;
  requestCount?: number;
  resultCount?: number;
  inputBytes?: number;
  outputBytes?: number;
  upstreamCost?: number;
  metadata?: Record<string, unknown>;
}
