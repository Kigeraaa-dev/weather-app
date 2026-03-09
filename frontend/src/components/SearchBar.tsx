/**
 * components/SearchBar.tsx
 *
 * Covers wireframe items A, B, C:
 *   A — Text input for city name
 *   B — GO button to trigger search
 *   C — Toggle between °C and °F
 */

import { useState, KeyboardEvent } from "react";
import { TempUnit } from "../types/weather";

interface Props {
  onSearch:     (city: string) => void;
  unit:         TempUnit;
  onUnitChange: (unit: TempUnit) => void;
  loading:      boolean;
}

export default function SearchBar({ onSearch, unit, onUnitChange, loading }: Props) {

  // Track what the user is typing
  const [input, setInput] = useState("");

  const handleGo = () => {
    const trimmed = input.trim();
    if (trimmed) onSearch(trimmed);
  };

  // Allow pressing Enter key to search (better UX)
  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleGo();
  };

  return (
    <div style={{ display: "flex", gap: "10px", marginBottom: "28px", alignItems: "center" }}>

      {/* A — City search input */}
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKey}
        placeholder="Search city..."
        disabled={loading}
        style={{
          flex:         1,
          padding:      "14px 18px",
          borderRadius: "12px",
          border:       "1px solid rgba(255,255,255,0.3)",
          background:   "rgba(255,255,255,0.15)",
          color:        "#fff",
          fontSize:     "18px",
          outline:      "none",
        }}
      />

      {/* B — GO button (triggers Geocoding API search) */}
      <button
        onClick={handleGo}
        disabled={loading || !input.trim()}
        style={{
          padding:       "14px 26px",
          borderRadius:  "12px",
          border:        "none",
          background:    loading ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.92)",
          color:         "#333",
          fontWeight:    "700",
          fontSize:      "18px",
          letterSpacing: "1px",
          cursor:        loading ? "not-allowed" : "pointer",
          transition:    "background 0.2s",
        }}
      >
        {loading ? "..." : "GO"}
      </button>

      {/* C — °C / °F unit toggle */}
      <div style={{
        display:      "flex",
        borderRadius: "10px",
        border:       "1px solid rgba(255,255,255,0.35)",
        overflow:     "hidden",
      }}>
        {(["C", "F"] as TempUnit[]).map(u => (
          <button
            key={u}
            onClick={() => onUnitChange(u)}
            style={{
              padding:    "14px 18px",
              border:     "none",
              background: unit === u ? "rgba(255,255,255,0.92)" : "transparent",
              color:      unit === u ? "#333" : "#fff",
              fontWeight: "700",
              fontSize:   "17px",
              cursor:     "pointer",
              transition: "background 0.2s, color 0.2s",
            }}
          >
            °{u}
          </button>
        ))}
      </div>
    </div>
  );
}
