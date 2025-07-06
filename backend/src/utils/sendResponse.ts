import { Response } from "express";
import { ApiResponse } from "./ApiResponse";

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode = 200,
) => {
  res.status(statusCode).json(ApiResponse.success(message, data));
};

export const sendError = (
  res: Response,
  message: string,
  error?: unknown,
  statusCode = 500,
) => {
  res.status(statusCode).json(ApiResponse.error(message, error));
};
