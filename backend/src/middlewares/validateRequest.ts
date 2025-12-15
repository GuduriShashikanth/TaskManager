import { Request, Response, NextFunction } from "express";
import * as z from "zod";

export const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors,
        });
        return;
      }
      next(error);
    }
  };
};
