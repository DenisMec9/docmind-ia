import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { logger } from "../config/logger";

export function notFoundHandler(_req: Request, res: Response) {
  return res.status(404).json({ error: "Route not found" });
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Validation error",
      details: err.flatten()
    });
  }

  if (err instanceof Error && err.message === "Forbidden") {
    return res.status(403).json({ error: "Forbidden" });
  }

  if (err instanceof Error && err.message.includes("Unsupported file type")) {
    return res.status(400).json({ error: err.message });
  }

  if (err instanceof Error && err.message === "Chat message limit reached for this conversation") {
    return res.status(429).json({ error: "Limite de mensagens por chat atingido para este documento." });
  }

  logger.error({ err }, "Unhandled error");
  return res.status(500).json({ error: "Internal server error" });
}
