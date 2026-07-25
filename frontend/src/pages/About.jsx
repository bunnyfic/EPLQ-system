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

function Step({ number, title, description }) {
  return (
    <div style={{ display: "flex", gap: "16px", marginBottom: "22px", textAlign: "left" }}>
      <div
        style={{
          flexShrink: 0,
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          border: "1px solid #8B9A7C",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#9B7E85",
          fontSize: "12px",
          fontFamily: "serif",
        }}
      >
        {number}
      </div>
      <div>
        <h3
          style={{
            color: "#9B7E85",
            fontFamily: "serif",
            fontSize: "15px",
            letterSpacing: "0.5px",
            marginBottom: "4px",
          }}
        >
          {title}
        </h3>
        <p style={{ color: "#8B9A7C", fontSize: "13.5px", lineHeight: 1.7 }}>
          {description}
        </p>
      </div>
    </div>
  );
}

export default function About() {
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
          About
        </h1>
        <p style={{ color: "#8B9A7C", fontSize: "15px", letterSpacing: "1px", fontStyle: "italic", marginTop: "8px" }}>
          how to find your way through the fog
        </p>

        <SectionDivider />

        {/* What EPLQ is */}
        <h2
          style={{
            color: "#8B9A7C",
            fontFamily: "serif",
            fontSize: "20px",
            letterSpacing: "3px",
            marginBottom: "12px",
          }}
        >
          What This App Does
        </h2>
        <p style={{ color: "#e8e2dc", fontSize: "15px", lineHeight: 1.8, maxWidth: "460px", margin: "0 auto" }}>
          EPLQ (Efficient Privacy-preserving Location-based Query) is a search system for finding
          nearby places — restaurants, hospitals, ATMs, and more — without ever revealing your
          real location to the server processing your search. Your coordinates are encrypted on
          your device before they're sent anywhere, and the results come back the same way:
          encrypted, then decrypted locally on your device.
        </p>

        <SectionDivider />

        {/* How to use it */}
        <h2
          style={{
            color: "#8B9A7C",
            fontFamily: "serif",
            fontSize: "20px",
            letterSpacing: "3px",
            marginBottom: "24px",
          }}
        >
          How To Use It
        </h2>

        <Step
          number="1"
          title="Create your account"
          description="Sign up with your email, then activate your account through the link we send you. This confirms the email is really yours before you can log in."
        />
        <Step
          number="2"
          title="Complete your profile"
          description="Add your name and, optionally, a profile picture. This is only used to personalize your experience — it has nothing to do with your searches."
        />
        <Step
          number="3"
          title="Land on your dashboard"
          description="You'll see a live map centered near you, with a search bar in the bottom-left corner and a menu in the top-left for navigating the app."
        />
        <Step
          number="4"
          title="Search and filter"
          description="Type what you're looking for, optionally narrow it down using the category filters (restaurants, hospitals, ATMs), and hit enter."
        />
        <Step
          number="5"
          title="Browse your results"
          description="Nearby places appear on the map. Your query and location are encrypted the entire time — the server matching your results never sees either in readable form."
        />

        <SectionDivider />

        {/* Contact */}
        <h2
          style={{
            color: "#8B9A7C",
            fontFamily: "serif",
            fontSize: "20px",
            letterSpacing: "3px",
            marginBottom: "12px",
          }}
        >
          Questions?
        </h2>
        <p style={{ color: "#e8e2dc", fontSize: "14px", lineHeight: 1.7 }}>
          Reach out anytime at
        </p>
        <a
          href="mailto:mayahkamat@gmail.com"
          style={{
            color: "#9B7E85",
            fontSize: "15px",
            letterSpacing: "0.5px",
            textDecoration: "underline",
          }}
        >
          mayahkamat@gmail.com
        </a>

        <SectionDivider />

        <p style={{ color: "#6b6560", fontSize: "12px", maxWidth: "440px", margin: "0 auto" }}>
          Built as part of an MSc Data Science dissertation. Fog imagery, color scheme, and
          design direction: Soft Hora.
        </p>
      </div>
    </div>
  );
}