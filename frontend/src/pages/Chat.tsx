import { Link, useParams } from "react-router-dom";
import { ChatInterface } from "../components/ChatInterface";

export function ChatPage() {
  const { documentId } = useParams<{ documentId: string }>();

  if (!documentId) {
    return (
      <div className="container">
        <div className="card">Documento invalido.</div>
      </div>
    );
  }

  return (
    <div className="container">
      <section className="card chat-shell">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
            gap: 12,
          }}
        >
          <div>
            <h1 className="section-title" style={{ marginBottom: 4 }}>
              Chat com documento
            </h1>
            <p className="muted" style={{ margin: 0 }}>
              A IA responde com base no conteudo do arquivo.
            </p>
          </div>

          <Link to="/" className="primary-link-btn" style={{ whiteSpace: "nowrap" }}>
            Dashboard
          </Link>
        </div>

        <ChatInterface documentId={documentId} />
      </section>
    </div>
  );
}
