import { useCallback, useEffect, useState } from "react";
import { deleteDocument, listDocuments } from "../services/documents";
import { DocumentItem } from "../types";
import { getErrorMessage } from "../utils/errors";

export function useDocuments() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listDocuments();
      setDocuments(Array.isArray(data) ? (data as DocumentItem[]) : []);
    } catch (err) {
      setError(getErrorMessage(err, "Nao foi possivel carregar documentos."));
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(
    async (id: string) => {
      setError("");
      try {
        await deleteDocument(id);
        await load();
      } catch (err) {
        setError(getErrorMessage(err, "Falha ao excluir documento."));
      }
    },
    [load],
  );

  useEffect(() => {
    void load();
  }, [load]);

  return { documents, loading, error, reload: load, remove };
}
