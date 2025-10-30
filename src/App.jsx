import React, { useState, useEffect, useRef } from "react";

/**
 * App.jsx centralise tout : intro, choix d'équipe, énigmes, sons, neige est rendu par snow.js
 */

const ENIGMES = [
  { id: 1, titre: "Énigme 1 — Le Marché de Noël", question: "Dans la vitrine du stand du chocolat chaud, compte le nombre de tasses accrochées. Multiplie-le par 2 et ajoute 1. Quel est le résultat ?", indice: "Regarde bien sur la photo du stand du chocolat chaud, juste à côté du grand sapin 🎄", reponse: "7" },
  { id: 2, titre: "Énigme 2 — L’École des Lutins", question: "Sur la porte de la salle des professeurs, une phrase magique est inscrite. Quel est le troisième mot de cette phrase ?", indice: "Indice : la phrase commence par 'L’esprit de Noël...'. Regarde bien la photo !", reponse: "partagé" },
  { id: 3, titre: "Énigme 3 — La Bibliothèque Enchantée", question: "Compte le nombre de livres rouges visibles sur l’étagère. Enlève 2, puis écris le nombre obtenu en lettres.", indice: "Regarde l’étagère du fond, tout à gauche 📚", reponse: "quatre" },
  { id: 4, titre: "Énigme 4 — Le Bureau du Père Noël", question: "Sur le bureau, une lettre est posée. Elle commence par une lettre majuscule dorée. Quelle est cette lettre ?", indice: "Indice : cherche la première ligne de la lettre ouverte sur le bureau.", reponse: "n" },
  { id: 5, titre: "Énigme 5 — Le Clocher de Levier", question: "Additionne les deux derniers chiffres de l’année gravée sous la cloche principale du clocher.", indice: "Regarde bien sur la plaque en métal accrochée juste sous la cloche 🔔", reponse: "11" },
  { id: 6, titre: "Énigme 6 — L’Atelier des Jouets", question: "Quel jouet porte un bonnet rouge et une écharpe bleue sur la table de travail ?", indice: "Il est posé à côté du train miniature et du pot de peinture.", reponse: "ours" },
  { id: 7, titre: "Énigme 7 — Le Trésor de Levier", question: "Assemble les lettres dorées récupérées dans chaque énigme pour former le mot magique final. Quel est-il ?", indice: "Le mot apparaît si tu relis les lettres dans l’ordre des énigmes… ✨", reponse: "levier" },
];

export default function App() {
  const [phase, setPhase] = useState("intro"); // intro | choix | enigmes | fin
  const [team, setTeam] = useState(null);
  const [idx, setIdx] = useState(0); // index current enigme
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [showIndice, setShowIndice] = useState(false);

  // refs pour audios (pour ne pas recréer à chaque render)
  const refIntroMusic = useRef(null);
  const refEnigmesMusic = useRef(null);
  const refNarration = useRef(null);
  const refJingle = useRef(null);

  // initialisation audio (une seule fois)
  useEffect(() => {
    refIntroMusic.current = new Audio("/assets/musique_intro.wav");
    refEnigmesMusic.current = new Audio("/assets/music_enigmes.wav");
    refNarration.current = new Audio("/assets/voice_narration.wav");
    refJingle.current = new Audio("/assets/jingle.wav");

    // réglages
    refIntroMusic.current.loop = true;
    refEnigmesMusic.current.loop = true;
    refIntroMusic.current.volume = 0.45;
    refEnigmesMusic.current.volume = 0.35;
    refNarration.current.volume = 0.9;

    // autoplay intro music try (will be blocked on some browsers until user gesture)
    refIntroMusic.current.play().catch(() => {
      // OK: we'll start on user click
      console.log("Autoplay intro blocked; waiting user interaction.");
    });

    return () => {
      // cleanup on unmount
      refIntroMusic.current?.pause();
      refEnigmesMusic.current?.pause();
      refNarration.current?.pause();
      refJingle.current?.pause();
    };
  }, []);

  // manage music when phase changes
  useEffect(() => {
    const introMusic = refIntroMusic.current;
    const enigmesMusic = refEnigmesMusic.current;
    if (!introMusic || !enigmesMusic) return;

    if (phase === "intro") {
      enigmesMusic.pause();
      introMusic.play().catch(() => {});
    } else if (phase === "choix" || phase === "enigmes") {
      introMusic.pause();
      introMusic.currentTime = 0;
      enigmesMusic.play().catch(() => {});
    } else {
      // fin
      introMusic.pause();
      enigmesMusic.pause();
    }
  }, [phase]);

  // start from intro: play narration if click to start
  const handleStartClick = () => {
    // user gesture ensures audio will play
    const j = refJingle.current;
    const n = refNarration.current;
    j?.play().catch(() => {});
    // start narration shortly after jingle
    setTimeout(() => {
      n?.play().catch(() => {});
    }, 400);

    // after short delay go to choix
    setTimeout(() => setPhase("choix"), 1600);
  };

  const handleChooseTeam = (t) => {
    setTeam(t);
    setPhase("enigmes");
    setIdx(0);
    setAnswer("");
    setMessage("");
  };

  const submitAnswer = () => {
    const correct = (ENIGMES[idx].reponse || "").toString().toLowerCase().trim();
    const given = (answer || "").toString().toLowerCase().trim();
    if (given === correct) {
      setMessage("✅ Bonne réponse !");
      // small success sound (jingle)
      refJingle.current?.play().catch(() => {});
      setTimeout(() => {
        if (idx + 1 < ENIGMES.length) {
          setIdx((i) => i + 1);
          setAnswer("");
          setShowIndice(false);
          setMessage("");
        } else {
          setPhase("fin");
        }
      }, 900);
    } else {
      setMessage("❌ Mauvaise réponse, réessaie !");
    }
  };

  // UI: intro screen (rendered from React only)
  if (phase === "intro") {
    return (
      <div className="app-intro" style={introRootStyle}>
        <img src="/intro_logo.svg" alt="logo" style={{ width: 140, marginBottom: 14 }} />
        <h1 style={{ margin: 6 }}>Escape Noël : Les Copains de Levier</h1>
        <p style={{ marginTop: 6, opacity: 0.9 }}>Cliquez pour lancer la narration et commencer l'aventure</p>
        <button onClick={handleStartClick} style={primaryButtonStyle}>🎄 Commencer l’aventure</button>
      </div>
    );
  }

  // choix d'équipe
  if (phase === "choix") {
    return (
      <div style={centerBox}>
        <h2>🎄 Choisissez votre équipe</h2>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginTop: 12 }}>
          {["LLASERA","Marlot","Pecot","Oléron","Saulnier","Cuenot","Baud"].map(t => (
            <button key={t} onClick={() => handleChooseTeam(t)} style={teamButtonStyle}>{t}</button>
          ))}
        </div>
      </div>
    );
  }

  // enigmes
  if (phase === "enigmes") {
    const e = ENIGMES[idx];
    return (
      <div style={centerBox}>
        <div className="app-container">
          <h2>{e.titre}</h2>
          <p style={{ maxWidth: 700 }}>{e.question}</p>

          <input value={answer} onChange={ev => setAnswer(ev.target.value)} placeholder="Votre réponse..." style={{ padding: 8, borderRadius: 8, width: 220 }} />
          <div style={{ marginTop: 10 }}>
            <button onClick={submitAnswer} style={{ ...primaryButtonStyle, background: "#2e7d32" }}>Valider</button>
            <button onClick={() => setShowIndice(s => !s)} style={{ marginLeft: 8, ...primaryButtonStyle, background: "#b71c1c" }}>💡 Indice</button>
          </div>

          {message && <p style={{ marginTop: 12, fontWeight: "700" }}>{message}</p>}
          {showIndice && <p style={{ marginTop: 10, fontStyle: "italic" }}>{e.indice}</p>}

          <p style={{ marginTop: 18, color: "#666" }}>Énigme {idx + 1} / {ENIGMES.length}</p>
        </div>
      </div>
    );
  }

  // fin
  if (phase === "fin") {
    return (
      <div style={centerBox}>
        <div className="app-container">
          <h2>🎉 Bravo {team} !</h2>
          <p>Tu as résolu toutes les énigmes et trouvé le trésor des Copains de Levier ✨</p>
          <div style={{ marginTop: 16 }}>
            <button onClick={() => { setPhase("choix"); setIdx(0); setTeam(null); setAnswer(""); }} style={primaryButtonStyle}>Rejouer</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

/* ==== Styles JS inline simples pour éviter dépendance CSS supplémentaire ==== */
const centerBox = { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 };
const primaryButtonStyle = { padding: "10px 16px", borderRadius: 8, background: "#b30000", color: "#fff", border: "none", cursor: "pointer" };
const teamButtonStyle = { padding: "10px 14px", borderRadius: 8, background: "#b30000", color: "#fff", border: "none", cursor: "pointer" };
const introRootStyle = { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8, textAlign: "center", padding: 20 };
