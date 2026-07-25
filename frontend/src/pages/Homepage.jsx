import { useNavigate } from "react-router-dom";

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

function SafetyPoint({ title, description }) {
  return (
    <div style={{ marginBottom: "28px", textAlign: "left" }}>
      <h3
        style={{
          color: "#9B7E85",
          fontFamily: "serif",
          fontSize: "16px",
          letterSpacing: "1px",
          marginBottom: "6px",
        }}
      >
        {title}
      </h3>
      <p style={{ color: "#8B9A7C", fontSize: "14px", lineHeight: 1.7 }}>
        {description}
      </p>
    </div>
  );
}

export default function Homepage() {
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
        {/* Back button — square, solid red */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "36px" }}>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              background: "#5C0A0A",
              border: "none",
              color: "#e8e2dc",
              fontSize: "11px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              padding: "10px 20px",
              borderRadius: "0px",
              cursor: "pointer",
              transition: "filter 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.filter = "brightness(1.3)")}
            onMouseOut={(e) => (e.currentTarget.style.filter = "brightness(1)")}
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Header */}
        <h1
          style={{
            color: "#9B7E85",
            fontFamily: "serif",
            letterSpacing: "4px",
            fontSize: "40px",
            margin: 0,
          }}
        >
          EPLQ
        </h1>
        <p style={{ color: "#8B9A7C", fontSize: "15px", letterSpacing: "1px", fontStyle: "italic", marginTop: "8px" }}>
          find what's near you, without giving yourself away
        </p>

        <SectionDivider />

        {/* What it is */}
        <p style={{ color: "#e8e2dc", fontSize: "15px", lineHeight: 1.8, maxWidth: "460px", margin: "0 auto" }}>
          EPLQ lets you search for nearby places — restaurants, hospitals, ATMs — the same way
          any map app would. The difference is what happens behind the scenes: your exact
          location is never seen, stored, or readable by anyone but you, not even by us.
        </p>

        <SectionDivider />

        {/* Safety points */}
        <h2
          style={{
            color: "#8B9A7C",
            fontFamily: "serif",
            fontSize: "20px",
            letterSpacing: "3px",
            marginBottom: "24px",
          }}
        >
          Why It's Safe
        </h2>

        <SafetyPoint
          title="Your location stays yours"
          description="Before your search ever leaves your device, your coordinates are encrypted. The server that finds results for you never sees where you actually are."
        />
        <SafetyPoint
          title="Search without a trail"
          description="Because your queries are encrypted end-to-end, there's no plain-text record of everywhere you've searched sitting on a server somewhere, waiting to be leaked or misused."
        />
        <SafetyPoint
          title="Results, not surveillance"
          description="You get accurate nearby results — same as any map app — but the system answering your query is mathematically incapable of decrypting your location to look at it."
        />
        <SafetyPoint
          title="Built on real encryption research"
          description="This isn't marketing language. EPLQ is built on established privacy-preserving query techniques from academic cryptography research, not a vague 'we care about privacy' promise."
        />

        <SectionDivider />

        <p style={{ color: "#6b6560", fontSize: "12px", maxWidth: "440px", margin: "0 auto" }}>
          In short: you search, you find, and nobody but you ever knows where "here" was.
        </p>
      </div>
    </div>
  );
}