import { HttpException, InternalServerErrorException } from '@nestjs/common';

export function handleError(error: unknown, fallbackMessage: string): never {
  if (error instanceof HttpException) {
    throw error;
  }

  if (error instanceof Error) {
    throw new InternalServerErrorException({
      message: fallbackMessage,
      originalError: error.message,
      stack: error.stack,
    });
  }

  throw new InternalServerErrorException(fallbackMessage);
}
