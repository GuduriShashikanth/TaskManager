import { Response } from "express";

export class ApiResponse {
  static success<T>(res: Response, data: T, message = "Success", statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static created<T>(res: Response, data: T, message = "Created successfully") {
    return this.success(res, data, message, 201);
  }

  static noContent(res: Response) {
    return res.status(204).send();
  }

  static error(res: Response, statusCode: number, message: string, errors?: unknown) {
    const response: { success: boolean; message: string; errors?: unknown } = {
      success: false,
      message,
    };
    if (errors !== undefined) {
      response.errors = errors;
    }
    return res.status(statusCode).json(response);
  }

  static badRequest(res: Response, message = "Bad Request", errors?: unknown) {
    return this.error(res, 400, message, errors);
  }

  static unauthorized(res: Response, message = "Unauthorized") {
    return this.error(res, 401, message);
  }

  static forbidden(res: Response, message = "Forbidden") {
    return this.error(res, 403, message);
  }

  static notFound(res: Response, message = "Not Found") {
    return this.error(res, 404, message);
  }

  static conflict(res: Response, message = "Conflict") {
    return this.error(res, 409, message);
  }

  static internal(res: Response, message = "Internal Server Error") {
    return this.error(res, 500, message);
  }
}
