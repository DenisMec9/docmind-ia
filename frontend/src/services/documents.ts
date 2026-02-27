import { api } from "./api";

export async function listDocuments() {
  const { data } = await api.get("/api/documents");
  return Array.isArray(data?.data) ? data.data : [];
}

export async function uploadDocument(file: File) {
  const form = new FormData();
  form.append("file", file);

  const { data } = await api.post("/api/documents/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
}

export async function deleteDocument(documentId: string) {
  await api.delete(`/api/documents/${documentId}`);
}
