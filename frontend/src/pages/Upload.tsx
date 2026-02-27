import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UploadForm } from "../components/UploadForm";
import { uploadDocument } from "../services/documents";
import { getErrorMessage } from "../utils/errors";

export function UploadPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function onUpload(file: File) {
    setLoading(true);
    setError("");

    try {
      const result = await uploadDocument(file);
      navigate(`/chat/${result.documentId}`);
    } catch (err) {
      setError(getErrorMessage(err, "Falha no upload do arquivo."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container upload-page">
      <Link to="/" className="back-link">
        Voltar para o inicio
      </Link>

      <header className="upload-hero">
        <h1>Envie e converse com seu documento</h1>
        <p>
          PDF ou TXT em segundos. O Docmind extrai o conteudo, cria contexto e
          abre o chat para respostas precisas.
        </p>
      </header>

      <section className="card upload-card">
        <UploadForm onSubmit={onUpload} loading={loading} />
        {error && <div className="alert-error">{error}</div>}
      </section>
    </div>
  );
}
