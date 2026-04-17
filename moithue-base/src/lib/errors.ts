export type ErrorBody = {
  code: string;
  message: string;
  details?: unknown;
};

export class AppError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(code: string, message: string, status = 400, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.details = details;
  }

  toJSON(): ErrorBody {
    const body: ErrorBody = { code: this.code, message: this.message };
    if (this.details !== undefined) body.details = this.details;
    return body;
  }
}

export const Errors = {
  notFound: (resource: string) =>
    new AppError('NOT_FOUND', `${resource} not found`, 404),
  conflict: (message: string) => new AppError('CONFLICT', message, 409),
  unauthorized: (message = 'Unauthorized') =>
    new AppError('UNAUTHORIZED', message, 401),
  forbidden: (message = 'Forbidden') => new AppError('FORBIDDEN', message, 403),
  validation: (details: unknown) =>
    new AppError('VALIDATION_ERROR', 'Validation failed', 422, details),
  badRequest: (message: string) => new AppError('BAD_REQUEST', message, 400),
  internal: (message = 'Internal server error') =>
    new AppError('INTERNAL_ERROR', message, 500),
} as const;
