import React, { useState } from "react";

export default function App() {
  const [team, setTeam] = useState(null);

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h2>Bienvenue dans l'Escape Game 🎄</h2>
      <p>Choisissez votre équipe :</p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        {["LLASERA", "Marlot", "Pecot", "Oléron", "Saulnier", "Cuenot", "Baud"].map((t) => (
          <button
            key={t}
            onClick={() => setTeam(t)}
            style={{
              padding: "10px 16px",
              borderRadius: "10px",
              backgroundColor: "#b30000",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "transform 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {t}
          </button>
        ))}
      </div>

      {team && (
        <div style={{ marginTop: 30 }}>
          <h3>🎅 Équipe sélectionnée : <strong>{team}</strong></h3>
          <p style={{ opacity: 0.8 }}>
            L'aventure commence… Suivez les indices et résolvez les énigmes !
          </p>
        </div>
      )}
    </div>
  );
}
