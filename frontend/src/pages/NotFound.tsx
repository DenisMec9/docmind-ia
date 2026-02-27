import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="container" style={{ maxWidth: 680 }}>
      <section className="card">
        <h1 className="section-title">Pagina nao encontrada</h1>
        <p className="muted">A rota que voce tentou acessar nao existe.</p>
        <Link to="/" className="primary-link-btn">
          Voltar ao dashboard
        </Link>
      </section>
    </div>
  );
}
