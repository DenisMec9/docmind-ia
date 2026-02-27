import { FormEvent, useState } from "react";

const MAX_SIZE_BYTES = 2 * 1024 * 1024;

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function UploadForm({
  onSubmit,
  loading,
}: {
  onSubmit: (file: File) => Promise<void>;
  loading: boolean;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!file || loading) return;
    setLocalError("");
    await onSubmit(file);
  }

  function validateAndSetFile(nextFile: File | null) {
    setLocalError("");

    if (!nextFile) {
      setFile(null);
      return;
    }

    const isValidType = nextFile.type === "application/pdf" || nextFile.type === "text/plain";
    if (!isValidType) {
      setFile(null);
      setLocalError("Formato invalido. Use PDF ou TXT.");
      return;
    }

    if (nextFile.size > MAX_SIZE_BYTES) {
      setFile(null);
      setLocalError("Arquivo maior que 2MB.");
      return;
    }

    setFile(nextFile);
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="upload-form">
      <div
        className={`upload-dropzone ${isDragging ? "drag-active" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          validateAndSetFile(e.dataTransfer.files?.[0] ?? null);
        }}
      >
        <p className="upload-kicker">Upload inteligente</p>
        <h3>Arraste seu arquivo aqui</h3>
        <p className="muted" style={{ marginTop: 0 }}>
          ou clique para escolher no seu computador
        </p>

        <input
          id="file-input"
          type="file"
          accept=".pdf,.txt"
          onChange={(e) => validateAndSetFile(e.target.files?.[0] ?? null)}
          disabled={loading}
          className="file-input-hidden"
        />
        <label htmlFor="file-input" className="primary-link-btn upload-action">
          Selecionar arquivo
        </label>
      </div>

      <div className="upload-meta">
        <p>
          <strong>Formatos:</strong> PDF e TXT
        </p>
        <p>
          <strong>Tamanho maximo:</strong> 2MB
        </p>
      </div>

      {file && (
        <div className="upload-file-chip">
          <span>{file.name}</span>
          <small>{formatFileSize(file.size)}</small>
        </div>
      )}

      {localError && <div className="alert-error">{localError}</div>}

      <button type="submit" disabled={loading || !file}>
        {loading ? "Processando..." : "Iniciar analise"}
      </button>
    </form>
  );
}
