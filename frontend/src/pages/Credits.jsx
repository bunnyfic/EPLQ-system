import { useNavigate } from "react-router-dom";
import cameraIcon from "../assets/camera.png";
import keyIcon from "../assets/key.png";

const palette = [
  { name: "void", hex: "#1a1519" },
  { name: "slate", hex: "#2B3138" },
  { name: "blood", hex: "#5C0A0A" },
  { name: "sage", hex: "#8B9A7C" },
  { name: "dusty rose", hex: "#9B7E85" },
  { name: "bone", hex: "#e8e2dc" },
];

const frontendStack = ["React", "Vite", "Tailwind CSS", "React Router", "Axios"];
const backendStack = [
  "FastAPI",
  "SQLAlchemy",
  "SQLite",
  "JWT (python-jose)",
  "Passlib + bcrypt",
  "Gmail SMTP",
];
const servicesUsed = ["OpenWeatherMap API", "Gmail SMTP (email delivery)"];

function SectionDivider() {
  return (
    <div
      style={{
        margin: "40px auto",
        width: "60px",
        textAlign: "center",
        color: "#5C0A0A",
        fontSize: "16px",
        letterSpacing: "6px",
      }}
    >
      ✦
    </div>
  );
}

function Pill({ children }) {
  return (
    <span
      style={{
        display: "inline-block",
        margin: "4px 6px",
        padding: "6px 14px",
        fontSize: "13px",
        letterSpacing: "1px",
        color: "#e8e2dc",
        backgroundColor: "rgba(43, 49, 56, 0.75)",
        border: "1px solid rgba(139, 154, 124, 0.3)",
        borderRadius: "999px",
      }}
    >
      {children}
    </span>
  );
}

export default function Credits() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#1a1519",
        padding: "80px 24px",
        color: "#e8e2dc",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: "560px", margin: "0 auto" }}>
        {/* Back to dashboard */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "36px" }}>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              background: "none",
              border: "1px solid rgba(139, 154, 124, 0.4)",
              color: "#8B9A7C",
              fontSize: "11px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              padding: "8px 18px",
              borderRadius: "999px",
              cursor: "pointer",
              transition: "filter 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.filter = "brightness(1.4)")}
            onMouseOut={(e) => (e.currentTarget.style.filter = "brightness(1)")}
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "18px",
            marginBottom: "8px",
          }}
        >
          <h1
            style={{
              color: "#9B7E85",
              fontFamily: "serif",
              letterSpacing: "4px",
              fontSize: "40px",
              margin: 0,
            }}
          >
            Credits
          </h1>
        </div>

        <p style={{ color: "#8B9A7C", fontSize: "15px", letterSpacing: "1px", fontStyle: "italic" }}>
          things half-remembered, kept for the record
        </p>

        <SectionDivider />

        {/* Design & Direction */}
        <h2
          style={{
            color: "#8B9A7C",
            fontFamily: "serif",
            fontSize: "20px",
            letterSpacing: "3px",
            marginBottom: "12px",
          }}
        >
          Design &amp; Direction
        </h2>
        <p style={{ color: "#e8e2dc", fontSize: "15px", lineHeight: 1.7, maxWidth: "440px", margin: "0 auto" }}>
          A moody, vintage, fog-drenched aesthetic — half gothic romance, half forgotten
          photograph. Moodboarded and curated on{" "}
          <span style={{ color: "#9B7E85" }}>Pinterest</span>, then translated into a
          consistent palette, serif type, and soft-focus imagery across every page.
        </p>

        <div style={{ marginTop: "20px", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "18px" }}>
          {palette.map((c) => (
            <div key={c.hex} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
              <span
                style={{
                  display: "inline-block",
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  backgroundColor: c.hex,
                  border: "1px solid rgba(232, 226, 220, 0.25)",
                }}
              />
              <span style={{ fontSize: "10px", color: "#8B9A7C", letterSpacing: "0.5px" }}>{c.name}</span>
              <span style={{ fontSize: "10px", color: "#6b6560" }}>{c.hex}</span>
            </div>
          ))}
        </div>

        <SectionDivider />

        {/* Built With */}
        <h2
          style={{
            color: "#8B9A7C",
            fontFamily: "serif",
            fontSize: "20px",
            letterSpacing: "3px",
            marginBottom: "16px",
          }}
        >
          Built With
        </h2>

        <p style={{ color: "#9B7E85", fontSize: "12px", letterSpacing: "2px", marginBottom: "8px" }}>
          FRONTEND
        </p>
        <div style={{ marginBottom: "20px" }}>
          {frontendStack.map((t) => (
            <Pill key={t}>{t}</Pill>
          ))}
        </div>

        <p style={{ color: "#9B7E85", fontSize: "12px", letterSpacing: "2px", marginBottom: "8px" }}>
          BACKEND
        </p>
        <div>
          {backendStack.map((t) => (
            <Pill key={t}>{t}</Pill>
          ))}
        </div>

        <SectionDivider />

        {/* APIs & Services */}
        <h2
          style={{
            color: "#8B9A7C",
            fontFamily: "serif",
            fontSize: "20px",
            letterSpacing: "3px",
            marginBottom: "16px",
          }}
        >
          APIs &amp; Services
        </h2>
        <div>
          {servicesUsed.map((s) => (
            <Pill key={s}>{s}</Pill>
          ))}
        </div>

        <SectionDivider />

        {/* Author */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
          <img
            src={keyIcon}
            alt=""
            style={{ width: "90px", height: "90px", opacity: 0.9, filter: "drop-shadow(0 0 8px rgba(155,126,133,0.5))" }}
          />
        </div>
        <p style={{ color: "#e8e2dc", fontSize: "17px", letterSpacing: "1px" }}>
          Built by <span style={{ color: "#9B7E85" }}>Maya Kamat</span>
        </p>
        <p style={{ color: "#8B9A7C", fontSize: "13px", marginTop: "4px", letterSpacing: "0.5px" }}>
          Master's student in Data Science
        </p>

        <p style={{ color: "#6b6560", marginTop: "40px", fontSize: "12px", maxWidth: "440px", margin: "40px auto 0" }}>
          Fog imagery, color scheme, and design direction: Soft Hora.
        </p>
      </div>
    </div>
  );
}