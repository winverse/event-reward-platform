export interface ProxyRoute {
  upstream: string;
  prefix: string;
  rewritePrefix: string;
}

export const authRoutes = (authApiHost: string): ProxyRoute[] => [
  {
    upstream: authApiHost,
    prefix: '/api/v1/auth',
    rewritePrefix: '/api/v1/auth',
  },
  {
    upstream: authApiHost,
    prefix: '/api/v1/users',
    rewritePrefix: '/api/v1/users',
  },
];

export const eventRoutes = (eventApiHost: string): ProxyRoute[] => [
  {
    upstream: eventApiHost,
    prefix: '/api/v1/event',
    rewritePrefix: '/api/v1/event',
  },
  {
    upstream: eventApiHost,
    prefix: '/api/v1/reward',
    rewritePrefix: '/api/v1/reward',
  },
];
