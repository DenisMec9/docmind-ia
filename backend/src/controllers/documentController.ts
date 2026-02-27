import { Request, Response } from "express";
import { documentIdParamSchema } from "../validations/chatSchemas";
import { getDocuments, removeDocument, uploadDocument } from "../services/documentService";

export async function uploadDocumentController(req: Request, res: Response) {
  const file = req.file;

  if (!file) return res.status(400).json({ error: "File is required" });

  const doc = await uploadDocument(file);
  return res.status(201).json({ documentId: doc.id });
}

export async function listDocumentsController(req: Request, res: Response) {
  const docs = await getDocuments();
  return res.status(200).json({ data: docs });
}

export async function deleteDocumentController(req: Request, res: Response) {
  const { id } = documentIdParamSchema.parse(req.params);
  await removeDocument(id);

  return res.status(204).send();
}