import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface TitleProps {
  title: string;
}

const Title: React.FC<TitleProps> = ({ title }) => {
  const navigate = useNavigate();

  const headerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const backButtonStyle: React.CSSProperties = {
    background: "rgba(0,0,0,0.05)",
    border: "none",
    cursor: "pointer",
    width: "40px",
    height: "40px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "2.5rem",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "28px",
    fontWeight: 700,
    background: "linear-gradient(135deg, #7c3fe8, #f04e8a)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    margin: "0",
    marginBottom: "2.5rem",
  };

  return (
    <div style={headerStyle}>
      <button style={backButtonStyle} onClick={() => navigate(-1)}>
        <ArrowLeft size={25} />
      </button>

      <p style={titleStyle}>{title}</p>
    </div>
  );
};

export default Title;