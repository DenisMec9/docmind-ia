import { openai } from "../config/openai";
import {
  createDocument,
  deleteDocument,
  getDocumentById,
  insertChunks,
  listDocuments
} from "../repositories/documentRepository";
import { chunkText } from "../utils/chunkText";
import { extractTextFromBuffer } from "../utils/extractText";
import { sanitizeInput } from "../utils/sanitize";

export async function uploadDocument(file: Express.Multer.File) {
  const rawText = await extractTextFromBuffer(file);
  const cleanText = sanitizeInput(rawText);

  if (!cleanText) {
    throw new Error("Could not extract text from file");
  }

  const chunks = chunkText(cleanText, 1000, 200);
  if (chunks.length === 0) {
    throw new Error("No chunks generated");
  }

  const doc = await createDocument(file.originalname);

  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: chunks
  });

  await insertChunks(
    chunks.map((content, index) => ({
      document_id: doc.id,
      content,
      embedding: embeddingResponse.data[index].embedding,
      metadata: { chunkIndex: index }
    }))
  );

  return doc;
}

export async function getDocuments() {
  return listDocuments();
}

export async function removeDocument(documentId: string) {
  const doc = await getDocumentById(documentId);

  await deleteDocument(documentId);
}