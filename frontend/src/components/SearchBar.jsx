import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const categories = [
    { value: "all", label: "All" },
    { value: "restaurant", label: "Restaurants" },
    { value: "hospital", label: "Hospitals" },
    { value: "atm", label: "ATMs" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.({ query: query.trim(), category });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        position: "absolute",
        bottom: "24px",
        left: "24px",
        zIndex: 500,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        width: "300px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "rgba(43, 49, 56, 0.9)",
          border: "1px solid #9B7E8550",
          borderRadius: "8px",
          padding: "10px 14px",
          backdropFilter: "blur(4px)",
        }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="search the fog..."
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#e8e2dc",
            fontSize: "13px",
            letterSpacing: "0.5px",
          }}
        />
        <button
          type="submit"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#9B7E85",
            fontSize: "13px",
            padding: "0 0 0 8px",
          }}
        >
          ➤
        </button>
      </div>

      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {categories.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => setCategory(c.value)}
            style={{
              fontSize: "10px",
              letterSpacing: "1px",
              textTransform: "uppercase",
              padding: "5px 10px",
              borderRadius: "4px",
              border: "1px solid",
              cursor: "pointer",
              transition: "all 0.15s ease",
              backgroundColor:
                category === c.value ? "#5C0A0A" : "rgba(43, 49, 56, 0.85)",
              borderColor: category === c.value ? "#5C0A0A" : "#8B9A7C40",
              color: category === c.value ? "#e8e2dc" : "#8B9A7C",
            }}
          >
            {c.label}
          </button>
        ))}
      </div>
    </form>
  );
}