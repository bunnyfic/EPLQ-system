import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MenuSystem() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { label: "Homepage", path: "/Homepage" },
    { label: "About", path: "/about" },
    { label: "Credits", path: "/credits" },
  ];

  const handleNavigate = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* Hamburger trigger */}
      <button
        onClick={() => setOpen(true)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          padding: "6px",
        }}
      >
        <span style={{ width: "20px", height: "1.5px", backgroundColor: "#9B7E85" }} />
        <span style={{ width: "20px", height: "1.5px", backgroundColor: "#8B9A7C" }} />
        <span style={{ width: "20px", height: "1.5px", backgroundColor: "#9B7E85" }} />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 998,
          }}
        />
      )}

      {/* Slide-out panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: open ? 0 : "-280px",
          width: "260px",
          height: "100vh",
          backgroundColor: "#1a1519",
          borderRight: "1px solid #9B7E8530",
          zIndex: 999,
          transition: "left 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          flexDirection: "column",
          padding: "28px 0",
        }}
      >
        <div style={{ padding: "0 24px", marginBottom: "36px" }}>
          <span
            className="menu-flicker"
            style={{
              color: "#9B7E85",
              fontFamily: "serif",
              fontSize: "20px",
              letterSpacing: "3px",
            }}
          >
            EPLQ
          </span>
          <div style={{ color: "#6b6560", fontSize: "10px", letterSpacing: "1px", marginTop: "4px" }}>
            you are not lost. yet.
          </div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column" }}>
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className="menu-item"
              style={{
                background: "none",
                border: "none",
                textAlign: "left",
                padding: "14px 24px",
                color: "#8B9A7C",
                fontSize: "13px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                cursor: "pointer",
                borderLeft: "2px solid transparent",
                transition: "all 0.2s ease",
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div
          style={{
            marginTop: "auto",
            padding: "0 24px",
            color: "#6b6560",
            fontSize: "10px",
            letterSpacing: "1px",
          }}
        >
          the fog remembers everything
        </div>
      </div>
    </>
  );
}