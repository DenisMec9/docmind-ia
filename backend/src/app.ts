import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import multer from "multer";
import pinoHttp from "pino-http";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { chatController } from "./controllers/chatController";
import { listConversationsController, listMessagesController } from "./controllers/conversationController";
import { deleteDocumentController, listDocumentsController, uploadDocumentController } from "./controllers/documentController";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";

const upload = multer({ storage: multer.memoryStorage() });
export const app = express();
const allowedOrigins = env.CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean);

app.use(pinoHttp({ logger }));
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);
app.use(express.json({ limit: "2mb" }));

const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});

const uploadLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // 5 uploads per 10 minutes per IP
  message: { error: "Muitos uploads recebidos deste IP, por favor tente novamente mais tarde." },
  standardHeaders: true,
  legacyHeaders: false
});

const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 15, // 15 messages per minute per IP
  message: { error: "Muitas mensagens enviadas, aguarde um momento." },
  standardHeaders: true,
  legacyHeaders: false
});

app.use(globalLimiter);

app.get("/health", (_req, res) => res.status(200).json({ ok: true }));

app.post("/api/documents/upload", uploadLimiter, upload.single("file"), uploadDocumentController);
app.get("/api/documents", listDocumentsController);
app.delete("/api/documents/:id", deleteDocumentController);

app.post("/api/chat", chatLimiter, chatController);
app.get("/api/conversations/:documentId", listConversationsController);
app.get("/api/conversations/:conversationId/messages", listMessagesController);

app.use(notFoundHandler);
app.use(errorHandler);
