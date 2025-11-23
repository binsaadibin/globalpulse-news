import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('❌ Global Error Handler:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    code: error.code
  });

  // Default error response
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal Server Error';
  let code = error.code || 'INTERNAL_ERROR';
  let details = error.details;

  // Handle specific error types
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    code = 'VALIDATION_ERROR';
    details = Object.values((error as any).errors).map((err: any) => err.message);
  }

  if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
    code = 'INVALID_ID';
  }

  if ((error as any).code === 11000) {
    statusCode = 409;
    message = 'Duplicate entry found';
    code = 'DUPLICATE_ENTRY';
    const field = Object.keys((error as any).keyValue)[0];
    details = { field, value: (error as any).keyValue[field] };
  }

  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
    code = 'INVALID_TOKEN';
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
    code = 'TOKEN_EXPIRED';
  }

  if (error.message === 'Not allowed by CORS') {
    statusCode = 403;
    message = 'CORS policy: Origin not allowed';
    code = 'CORS_ERROR';
  }

  // Construct response
  const response: any = {
    success: false,
    message,
    code,
    timestamp: new Date().toISOString(),
    path: req.url
  };

  // Add details in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = error.stack;
    if (details) response.details = details;
  }

  // Add details for validation errors in production
  if (details && code === 'VALIDATION_ERROR') {
    response.details = details;
  }

  res.status(statusCode).json(response);
};

// Utility function to create custom errors
export const createError = (
  message: string,
  statusCode: number = 500,
  code: string = 'INTERNAL_ERROR',
  details?: any
): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  error.details = details;
  return error;
};