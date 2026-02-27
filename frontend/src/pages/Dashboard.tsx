import { Link } from "react-router-dom";
import { DocumentList } from "../components/DocumentList";
import { useDocuments } from "../hooks/useDocuments";

export function DashboardPage() {
  const { documents, loading, error, remove } = useDocuments();

  return (
    <div className="container">
      <header className="hero">
        <h1>Docmind IA</h1>
        <p>
          Converta seus arquivos em respostas objetivas com RAG. Envie um PDF ou
          TXT, processe em segundos e converse com contexto real do documento.
        </p>
      </header>

      <section className="card" style={{ marginBottom: "16px" }}>
        <h2 className="section-title">Como funciona</h2>
        <div className="grid-3" style={{ marginBottom: "18px" }}>
          <article className="step-card">
            <h3>1. Upload</h3>
            <p>Voce envia o arquivo e o sistema extrai o texto automaticamente.</p>
          </article>
          <article className="step-card">
            <h3>2. Vetorizacao</h3>
            <p>O conteudo e dividido em blocos e indexado para busca semantica.</p>
          </article>
          <article className="step-card">
            <h3>3. Chat RAG</h3>
            <p>A IA responde com base nos trechos mais relevantes do documento.</p>
          </article>
        </div>

        <div style={{ textAlign: "center" }}>
          <Link to="/upload" className="primary-link-btn">
            Enviar novo documento
          </Link>
        </div>
      </section>

      <section className="card">
        <h2 className="section-title">Documentos recentes</h2>
        {error && <div className="alert-error">{error}</div>}

        {loading ? (
          <p className="muted">Carregando documentos...</p>
        ) : documents.length === 0 ? (
          <p className="muted" style={{ textAlign: "center", padding: "20px 0" }}>
            Nenhum documento encontrado. Envie seu primeiro arquivo.
          </p>
        ) : (
          <DocumentList items={documents} onDelete={remove} />
        )}
      </section>
    </div>
  );
}
