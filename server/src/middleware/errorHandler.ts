import type { Request, Response, NextFunction } from 'express';

/**
 * Custom error class that includes an HTTP status code.
 * Throw this in services/controllers to send proper error responses.
 */
export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

/**
 * Global error handler middleware.
 * Express calls this when next(error) is called or when an error is thrown.
 * Must have 4 parameters (err, req, res, next) for Express to recognize it as error middleware.
 */
export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';

  console.error(`❌ [${statusCode}] ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
  });
}
