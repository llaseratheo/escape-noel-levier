import React, { useState } from "react";

const enigmes = [
  {
    id: 1,
    titre: "Énigme 1 — Le Marché de Noël",
    question:
      "Dans la vitrine du stand du chocolat chaud, compte le nombre de tasses accrochées. Multiplie-le par 2 et ajoute 1. Quel est le résultat ?",
    indice:
      "Regarde bien sur la photo du stand du chocolat chaud, juste à côté du grand sapin 🎄",
    reponse: "7",
  },
  {
    id: 2,
    titre: "Énigme 2 — L’École des Lutins",
    question:
      "Sur la porte de la salle des professeurs, une phrase magique est inscrite. Quel est le **troisième mot** de cette phrase ?",
    indice:
      "Indice : la phrase commence par 'L’esprit de Noël...'. Regarde bien la photo !",
    reponse: "partagé",
  },
  {
    id: 3,
    titre: "Énigme 3 — La Bibliothèque Enchantée",
    question:
      "Compte le nombre de livres rouges visibles sur l’étagère. Enlève 2, puis écris le nombre obtenu en lettres (ex: 'deux').",
    indice: "Regarde l’étagère du fond, tout à gauche 📚",
    reponse: "quatre",
  },
  {
    id: 4,
    titre: "Énigme 4 — Le Bureau du Père Noël",
    question:
      "Sur le bureau, une lettre est posée. Elle commence par une lettre majuscule dorée. Quelle est cette lettre ?",
    indice:
      "Indice : cherche la première ligne de la lettre ouverte sur le bureau.",
    reponse: "N",
  },
  {
    id: 5,
    titre: "Énigme 5 — Le Clocher de Levier",
    question:
      "Additionne les deux derniers chiffres de l’année gravée sous la cloche principale du clocher.",
    indice:
      "Regarde bien sur la plaque en métal accrochée juste sous la cloche 🔔",
    reponse: "11",
  },
  {
    id: 6,
    titre: "Énigme 6 — L’Atelier des Jouets",
    question:
      "Quel jouet porte un bonnet rouge et une écharpe bleue sur la table de travail ?",
    indice:
      "Indice : il est posé à côté du train miniature et du pot de peinture.",
    reponse: "ours",
  },
  {
    id: 7,
    titre: "Énigme 7 — Le Trésor de Levier",
    question:
      "Assemble les lettres dorées récupérées dans chaque énigme pour former le mot magique final. Quel est-il ?",
    indice:
      "Le mot apparaît si tu relis les lettres dans l’ordre des énigmes… ✨",
    reponse: "levier",
  },
];

export default function App() {
  const [etape, setEtape] = useState(0);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [showIndice, setShowIndice] = useState(false);

  const enigme = enigmes[etape];

  const valider = () => {
    if (input.trim().toLowerCase() === enigme.reponse.toLowerCase()) {
      setMessage("🎉 Bravo, bonne réponse !");
      setTimeout(() => {
        setMessage("");
        setInput("");
        setShowIndice(false);
        setEtape((prev) => prev + 1);
      }, 1500);
    } else {
      setMessage("❌ Essaie encore !");
    }
  };

  if (etape >= enigmes.length) {
    return (
      <div className="app-container">
        <h2>🎄 Félicitations aventurier !</h2>
        <p>Tu as résolu toutes les énigmes et trouvé le trésor de Levier ✨</p>
        <p>Merci d’avoir participé à l’Escape Game de Noël 🎅</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <h2>{enigme.titre}</h2>
      <p>{enigme.question}</p>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Votre réponse..."
      />
      <button onClick={valider}>Valider</button>

      {message && <p className="message">{message}</p>}

      <button className="indice-btn" onClick={() => setShowIndice(!showIndice)}>
        💡 Indice
      </button>
      {showIndice && <p className="indice">{enigme.indice}</p>}
    </div>
  );
}
