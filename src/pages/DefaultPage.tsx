import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="accordion-wrapper" style={{ textAlign: "center", padding: "60px 20px" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "8px" }}>404</h1>
      <p style={{ marginBottom: "16px" }}>
        Cette page n'existe pas.
      </p>
      <button
        className="accordion-send-btn"
        onClick={() => navigate("/users", { replace: true })}
      >
        Aller à /users maintenant
      </button>
    </div>
  );
}