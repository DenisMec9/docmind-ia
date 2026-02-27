import { z } from "zod";

export const chatSchema = z.object({
  documentId: z.string().uuid(),
  message: z.string().min(1).max(5000)
});

export const documentIdParamSchema = z.object({
  id: z.string().uuid()
});

export const documentRefSchema = z.object({
  documentId: z.string().uuid()
});

export const conversationRefSchema = z.object({
  conversationId: z.string().uuid()
});
