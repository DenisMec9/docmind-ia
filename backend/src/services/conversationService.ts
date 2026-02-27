import {
  getConversationById,
  listConversationsByDocument,
  listMessages
} from "../repositories/conversationRepository";
import { getDocumentById } from "../repositories/documentRepository";

export async function getConversations(documentId: string) {
  const doc = await getDocumentById(documentId);

  return listConversationsByDocument(documentId);
}

export async function getConversationMessages(conversationId: string) {
  const conversation = await getConversationById(conversationId);

  return listMessages(conversationId);
}