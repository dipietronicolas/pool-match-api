import { Request, Response, NextFunction } from 'express';
import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").optional(),
  ranking: z.string().min(1).optional(),
  preferred_cue: z.string().min(1).optional()
});

export const playerIdSchema = z.object({
  playerId: z.string().min(1),
});

export const validateBody = (schema: z.ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
      return;
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
      res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
      return;
    }
    next(error);
  }
};