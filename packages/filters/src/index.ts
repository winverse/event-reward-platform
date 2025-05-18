import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { FastifyReply } from 'fastify';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const response = exception.getResponse();
      reply.status(statusCode).send(response);
    } else {
      reply
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal Server Error');
    }
  }
}
