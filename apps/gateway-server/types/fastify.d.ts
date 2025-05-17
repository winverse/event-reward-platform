import { LoggedUser } from '@packages/interface';

declare module 'fastify' {
  interface FastifyRequest {
    user?: LoggedUser;
  }
}
