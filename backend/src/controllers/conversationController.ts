import { Request, Response } from "express";
import { getConversationMessages, getConversations } from "../services/conversationService";
import { conversationRefSchema, documentRefSchema } from "../validations/chatSchemas";

export async function listConversationsController(req: Request, res: Response) {
  const { documentId } = documentRefSchema.parse(req.params);
  const data = await getConversations(documentId);
  return res.status(200).json({ data });
}

export async function listMessagesController(req: Request, res: Response) {
  const { conversationId } = conversationRefSchema.parse(req.params);
  const data = await getConversationMessages(conversationId);
  return res.status(200).json({ data });
}
