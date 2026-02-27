import { openai } from "../config/openai";
import { env } from "../config/env";
import { getDocumentById, searchSimilarChunks } from "../repositories/documentRepository";
import { getOrCreateConversation, insertMessage, listMessages } from "../repositories/conversationRepository";
import { sanitizeInput } from "../utils/sanitize";

export async function askDocumentQuestion(documentId: string, message: string) {
  const doc = await getDocumentById(documentId);

  const conversation = await getOrCreateConversation(documentId);
  const cleanMessage = sanitizeInput(message);
  const messageHistory = await listMessages(conversation.id);
  const userMessagesCount = messageHistory.filter((item) => item.role === "user").length;

  if (userMessagesCount >= env.CHAT_MAX_MESSAGES_PER_CONVERSATION) {
    throw new Error("Chat message limit reached for this conversation");
  }

  const queryEmbedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: cleanMessage
  });

  const similarChunks = await searchSimilarChunks(documentId, queryEmbedding.data[0].embedding, 5);
  const recentHistory = messageHistory.slice(-3);

  const context = similarChunks.map((chunk, index) => `[${index + 1}] ${chunk.content}`).join("\n\n");
  const historyText = recentHistory.map((item) => `${item.role}: ${item.content}`).join("\n");

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.3,
    max_tokens: 1000,
    messages: [
      {
        role: "system",
        content: "Você responde perguntas usando apenas o contexto do documento. Se faltar contexto, diga claramente."
      },
      {
        role: "user",
        content: `Contexto relevante:\n${context}\n\nHistórico recente:\n${historyText || "(sem histórico)"}\n\nPergunta:\n${cleanMessage}`
      }
    ]
  });

  const answer = completion.choices[0]?.message?.content ?? "Não consegui gerar resposta agora.";

  await insertMessage(conversation.id, "user", cleanMessage);
  await insertMessage(conversation.id, "assistant", answer);

  return {
    conversationId: conversation.id,
    response: answer
  };
}
