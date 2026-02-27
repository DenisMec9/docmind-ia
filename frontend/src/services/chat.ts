import { api } from "./api";

export async function sendMessage(documentId: string, message: string) {
  const { data } = await api.post("/api/chat", { documentId, message });
  return data;
}

export async function listConversations(documentId: string) {
  const { data } = await api.get(`/api/conversations/${documentId}`);
  return Array.isArray(data?.data) ? data.data : [];
}

export async function listMessages(conversationId: string) {
  const { data } = await api.get(
    `/api/conversations/${conversationId}/messages`,
  );
  return Array.isArray(data?.data) ? data.data : [];
}
