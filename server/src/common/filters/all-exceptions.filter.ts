import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

interface HttpExceptionResponse {
  message: string[];
  error?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string[] = ['Internal server error'];

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        const httpResponse = exceptionResponse as HttpExceptionResponse;
        message = Array.isArray(httpResponse.message)
          ? httpResponse.message
          : [httpResponse.message];
      } else if (typeof exceptionResponse === 'string') {
        message = [exceptionResponse];
      }
    } else if (exception instanceof Error) {
      message = [exception.message];
    }

    response.status(status).json({
      message,
    });

    if (
      (status as HttpStatus) === HttpStatus.INTERNAL_SERVER_ERROR ||
      !(exception instanceof HttpException)
    ) {
      const logMessage = Array.isArray(message) ? message.join(', ') : message;

      this.logger.error(
        exception instanceof Error ? exception.message : logMessage,
        {
          statusCode: status,
          method: request.method,
          path: request.url,
          stack: exception instanceof Error ? exception.stack : undefined,
          originalError:
            exception instanceof HttpException
              ? exception.getResponse()
              : undefined,
        },
      );
    }
  }
}
