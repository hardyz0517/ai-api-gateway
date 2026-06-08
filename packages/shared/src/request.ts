import type { ServiceType } from './domain';

export interface GatewayRequestContext {
  requestId: string;
  userId?: string;
  userTokenId?: string;
  providerId?: string;
  poolId?: string;
  routeId?: string;
  serviceType: ServiceType;
  model?: string;
  startedAt: Date;
}
