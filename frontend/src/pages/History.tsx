import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { listConversations } from "../services/chat";
import { Conversation } from "../types";
import { getErrorMessage } from "../utils/errors";

export function HistoryPage() {
  const { documentId } = useParams<{ documentId: string }>();
  const [items, setItems] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!documentId) return;

    setLoading(true);
    setError("");

    listConversations(documentId)
      .then((data) => setItems(data as Conversation[]))
      .catch((err) => setError(getErrorMessage(err, "Falha ao carregar historico.")))
      .finally(() => setLoading(false));
  }, [documentId]);

  return (
    <div className="container" style={{ maxWidth: 860 }}>
      <section className="card">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h1 className="section-title" style={{ marginBottom: 0 }}>
            Historico de conversas
          </h1>
          <Link to="/" className="primary-link-btn">
            Dashboard
          </Link>
        </div>

        {loading && <p className="muted">Carregando conversas...</p>}
        {error && <div className="alert-error">{error}</div>}

        {!loading && !error && items.length === 0 && (
          <p className="muted">Nenhuma conversa registrada para este documento.</p>
        )}

        <ul className="list" style={{ marginTop: 12 }}>
          {items.map((conv) => (
            <li key={conv.id} className="step-card">
              <Link to={`/chat/${conv.document_id}`}>
                Conversa {conv.id.slice(0, 8)} - {new Date(conv.created_at).toLocaleString()}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
