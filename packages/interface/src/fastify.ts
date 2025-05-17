import type { LoggedUser } from './user.interface.js';
import type { FastifyRequest } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    user?: LoggedUser;
  }
}
