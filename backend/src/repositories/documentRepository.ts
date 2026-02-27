import { supabaseAdmin } from "../config/supabase";

export interface DocumentRecord {
  id: string;
  name: string;
  created_at: string;
}

export interface ChunkInsert {
  document_id: string;
  content: string;
  embedding: number[];
  metadata?: Record<string, unknown>;
}

export async function createDocument(name: string) {
  const { data, error } = await supabaseAdmin
    .from("documents")
    .insert({ name })
    .select("id, name, created_at")
    .single();

  if (error) throw error;
  return data as DocumentRecord;
}

export async function insertChunks(chunks: ChunkInsert[]) {
  const { error } = await supabaseAdmin.from("document_chunks").insert(chunks);
  if (error) throw error;
}

export async function listDocuments() {
  const { data, error } = await supabaseAdmin
    .from("documents")
    .select("id, name, created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getDocumentById(id: string) {
  const { data, error } = await supabaseAdmin
    .from("documents")
    .select("id, name")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function deleteDocument(id: string) {
  const { error } = await supabaseAdmin.from("documents").delete().eq("id", id);
  if (error) throw error;
}

export async function searchSimilarChunks(documentId: string, queryEmbedding: number[], matchCount = 5) {
  const { data, error } = await supabaseAdmin.rpc("match_document_chunks", {
    query_embedding: queryEmbedding,
    input_document_id: documentId,
    match_count: matchCount
  });

  if (error) throw error;
  return data as Array<{ content: string; similarity: number }>;
}