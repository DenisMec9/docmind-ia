import { Link } from "react-router-dom";
import { DocumentItem } from "../types";

export function DocumentList({
  items,
  onDelete,
}: {
  items: DocumentItem[];
  onDelete: (id: string) => Promise<void>;
}) {
  if (items.length === 0) return <p className="muted">Nenhum documento ainda.</p>;

  return (
    <ul className="list">
      {items.map((item) => (
        <li key={item.id} className="step-card">
          <strong style={{ display: "block", marginBottom: 6 }}>{item.name}</strong>
          <p className="muted" style={{ marginTop: 0 }}>
            Criado em {new Date(item.created_at).toLocaleString()}
          </p>
          <div className="row">
            <Link to={`/chat/${item.id}`} className="primary-link-btn">
              Abrir chat
            </Link>
            <Link
              to={`/history/${item.id}`}
              className="primary-link-btn"
              style={{ background: "#e2e8f0", color: "#0f172a" }}
            >
              Historico
            </Link>
            <button style={{ maxWidth: 140 }} className="btn-secondary" onClick={() => void onDelete(item.id)}>
              Excluir
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
