import { supabaseAdmin } from "../config/supabase";

export async function getOrCreateConversation(documentId: string) {
  const existing = await supabaseAdmin
    .from("conversations")
    .select("id, document_id, created_at")
    .eq("document_id", documentId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing.error) throw existing.error;
  if (existing.data) return existing.data;

  const created = await supabaseAdmin
    .from("conversations")
    .insert({ document_id: documentId })
    .select("id, document_id, created_at")
    .single();

  if (created.error) throw created.error;
  return created.data;
}

export async function listConversationsByDocument(documentId: string) {
  const { data, error } = await supabaseAdmin
    .from("conversations")
    .select("id, document_id, created_at")
    .eq("document_id", documentId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function listMessages(conversationId: string) {
  const { data, error } = await supabaseAdmin
    .from("messages")
    .select("id, role, content, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

export async function insertMessage(conversationId: string, role: "user" | "assistant", content: string) {
  const { data, error } = await supabaseAdmin
    .from("messages")
    .insert({ conversation_id: conversationId, role, content })
    .select("id, role, content, created_at")
    .single();

  if (error) throw error;
  return data;
}

export async function getConversationById(conversationId: string) {
  const { data, error } = await supabaseAdmin
    .from("conversations")
    .select("id, document_id, created_at")
    .eq("id", conversationId)
    .single();

  if (error) throw error;
  return data;
}