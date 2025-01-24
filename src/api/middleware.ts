import { Request, Response, NextFunction } from 'express';
import { z } from "zod";
import { httpErrors } from './errors';

interface CustomError extends Error {
  status?: number; // HTTP status code
  details?: any;   // Additional error details
}


// exception handler o error handler, typescript express
export const errorHandlerMiddleware = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[${new Date().toISOString()}] Error:`, {
    status: err.status,
    message: err.message,
  });

  res.status(status).json({
    status,
    message,
    ...(err.details && { details: err.details }),
  });
};

export const validateBody = (schema: z.ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorDetails = error.errors.map(e => `${e.message}: ${e.path.join(', ')}`).join('. ')
      next(httpErrors.badRequestError(errorDetails))
    }
    next(error);
  }
};

export const validateParams = (schema: z.ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.params);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorDetails = error.errors.map(e => `${e.message}: ${e.path.join(', ')}`).join('. ')
      next(httpErrors.badRequestError(errorDetails))
    }
    next(error);
  }
};

export const validateQueryParams = (schema: z.ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.query);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorDetails = error.errors.map(e => `${e.message}: ${e.path.join(', ')}`).join('. ')
      next(httpErrors.badRequestError(errorDetails))
    }
    next(error);
  }
};