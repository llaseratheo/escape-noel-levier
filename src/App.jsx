import React, { useState } from "react";

export default function App() {
  const [team, setTeam] = useState(null);

  return (
    <div style={{ padding: 20 }}>
      <h2>Bienvenue dans l'escape game 🎄</h2>
      <p>Choisissez votre équipe :</p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {["LLASERA", "Marlot", "Pecot", "Oléron", "Saulnier", "Cuenot", "Baud"].map((t) => (
          <button
            key={t}
            onClick={() => setTeam(t)}
            style={{
              padding: 8,
              borderRadius: 8,
              background: team === t ? "#c0392b" : "#eee",
              color: team === t ? "white" : "black",
              cursor: "pointer",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {team && (
        <div style={{ marginTop: 20 }}>
          Équipe sélectionnée : <strong>{team}</strong>
        </div>
      )}

      <hr />
      <p style={{ opacity: 0.8 }}>
        Ici, tu peux intégrer la logique d'énigmes personnalisées.
      </p>
    </div>
  );
}
