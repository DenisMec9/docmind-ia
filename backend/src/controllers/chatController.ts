import { Request, Response } from "express";
import { askDocumentQuestion } from "../services/chatService";
import { chatSchema } from "../validations/chatSchemas";

export async function chatController(req: Request, res: Response) {
  const body = chatSchema.parse(req.body);
  const result = await askDocumentQuestion(body.documentId, body.message);

  return res.status(200).json(result);
}