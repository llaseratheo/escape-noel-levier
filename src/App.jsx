import React, { useState, useEffect } from "react";

export default function App() {
  const [team, setTeam] = useState(null);
  const [phase, setPhase] = useState("intro"); // intro, choix, enigmes, fin
  const [currentEnigme, setCurrentEnigme] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [message, setMessage] = useState("");

  // --- AUDIOS ---
  const musiqueIntro = new Audio("/assets/musique_intro.wav");
  const musiqueEnigmes = new Audio("/assets/music_enigmes.wav");
  const narration = new Audio("/assets/voice_narration.wav");
  const jingle = new Audio("/assets/jingle.wav");

  // --- EFFET NEIGE (canvas simple) ---
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.id = "snow-canvas";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.zIndex = "-1";
    canvas.style.pointerEvents = "none";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let flakes = Array.from({ length: 120 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 4 + 1,
      d: Math.random() + 1,
    }));

    function drawFlakes() {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "white";
      ctx.beginPath();
      for (let flake of flakes) {
        ctx.moveTo(flake.x, flake.y);
        ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
      }
      ctx.fill();
      updateFlakes();
    }

    let angle = 0;
    function updateFlakes() {
      angle += 0.01;
      for (let flake of flakes) {
        flake.y += Math.pow(flake.d, 2) + 1;
        flake.x += Math.sin(angle) * 2;
        if (flake.y > h) {
          flake.y = 0;
          flake.x = Math.random() * w;
        }
      }
    }

    let interval = setInterval(drawFlakes, 33);
    return () => {
      clearInterval(interval);
      document.body.removeChild(canvas);
    };
  }, []);

  // --- LISTE DES ÉNIGMES ---
  const enigmes = [
    { id: 1, question: "Je suis un grand bâtiment en pierre, on y trouve le clocher et les cloches de Noël résonnent souvent ici. Où es-tu ?", reponse: "église" },
    { id: 2, question: "Je suis un lieu où les enfants viennent apprendre, mais pendant les vacances, je reste calme. Où suis-je ?", reponse: "école" },
    { id: 3, question: "Je suis un endroit où les livres dorment sagement en attendant qu’on les ouvre. Où dois-tu aller ?", reponse: "bibliothèque" },
    { id: 4, question: "Je suis un lieu où le ballon roule, où les Copains de Levier aiment marquer des buts ! Où es-tu ?", reponse: "stade" },
    { id: 5, question: "Je suis un lieu où l’eau coule, où parfois les enfants jouent en été, mais je suis bien froid en hiver. Que suis-je ?", reponse: "fontaine" },
    { id: 6, question: "Je suis un lieu où l’on vient pour poster des lettres au Père Noël. Où suis-je ?", reponse: "poste" },
    { id: 7, question: "Je suis un endroit plein de douceurs et de gourmandises, surtout à Noël. Que suis-je ?", reponse: "boulangerie" },
    { id: 8, question: "Je suis un grand bâtiment avec un drapeau tricolore, où le maire travaille. Où dois-tu aller ?", reponse: "mairie" },
    { id: 9, question: "Je suis une place où tout le monde se retrouve, parfois pour le marché ou pour fêter Noël. Où suis-je ?", reponse: "place" },
    { id: 10, question: "Je suis le cœur de cette aventure, là où se cachait le trésor des Copains de Levier. Où te trouves-tu maintenant ?", reponse: "levier" },
  ];

  // --- GESTION MUSIQUE SELON LA PHASE ---
  useEffect(() => {
    musiqueIntro.loop = true;
    musiqueEnigmes.loop = true;
    narration.volume = 0.8;

    if (phase === "intro") {
      musiqueIntro.play().catch(() => {});
      narration.play().catch(() => {});
    } else if (phase === "choix" || phase === "enigmes") {
      musiqueIntro.pause();
      narration.pause();
      musiqueEnigmes.play().catch(() => {});
    } else {
      musiqueIntro.pause();
      musiqueEnigmes.pause();
      narration.pause();
    }

    return () => {
      musiqueIntro.pause();
      musiqueEnigmes.pause();
      narration.pause();
    };
  }, [phase]);

  // --- ACTIONS DU JEU ---
  const handleStart = () => {
    jingle.play();
    setTimeout(() => setPhase("choix"), 2000);
  };

  const handleTeamSelect = (t) => {
    setTeam(t);
    setPhase("enigmes");
  };

  const handleSubmit = () => {
    const correct = enigmes[currentEnigme].reponse.toLowerCase().trim();
    const given = userAnswer.toLowerCase().trim();

    if (given === correct) {
      if (currentEnigme + 1 < enigmes.length) {
        setMessage("✅ Bonne réponse !");
        setTimeout(() => {
          setCurrentEnigme(currentEnigme + 1);
          setUserAnswer("");
          setMessage("");
        }, 1500);
      } else {
        setPhase("fin");
      }
    } else {
      setMessage("❌ Mauvaise réponse, réessaie !");
    }
  };

  // --- ÉCRANS ---
  if (phase === "intro") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to bottom, #ffefef, #ffffff)",
          color: "#b30000",
          textAlign: "center",
        }}
      >
        <h1>🎅 Bienvenue dans l'Escape Noël 🎄</h1>
        <h2>Les Copains de Levier à l’Aventure</h2>
        <button
          onClick={handleStart}
          style={{
            marginTop: 20,
            padding: "12px 20px",
            borderRadius: 10,
            backgroundColor: "#b30000",
            color: "white",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Commencer l’aventure
        </button>
      </div>
    );
  }

  if (phase === "choix") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <h2>🎄 Choisis ton équipe :</h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {["LLASERA", "Marlot", "Pecot", "Oléron", "Saulnier", "Cuenot", "Baud"].map((t) => (
            <button key={t} onClick={() => handleTeamSelect(t)} style={{ padding: "10px 16px", borderRadius: 8, backgroundColor: "#b30000", color: "white", border: "none" }}>
              {t}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (phase === "enigmes") {
    const e = enigmes[currentEnigme];
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <h2>🧩 Énigme {e.id}</h2>
        <p style={{ maxWidth: 600 }}>{e.question}</p>
        <input
          value={userAnswer}
          onChange={(ev) => setUserAnswer(ev.target.value)}
          placeholder="Votre réponse"
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc", width: 250, textAlign: "center" }}
        />
        <button onClick={handleSubmit} style={{ marginTop: 10, padding: "10px 16px", borderRadius: 8, backgroundColor: "#007b00", color: "white", border: "none" }}>
          Valider
        </button>
        <p style={{ marginTop: 20 }}>{message}</p>
      </div>
    );
  }

  if (phase === "fin") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <h2>🎉 Bravo {team} !</h2>
        <p>Tu as trouvé le trésor des Copains de Levier ! 🏆</p>
        <button onClick={() => { setTeam(null); setCurrentEnigme(0); setPhase("intro"); }} style={{ marginTop: 20, padding: "10px 16px", borderRadius: 8, backgroundColor: "#b30000", color: "white", border: "none" }}>
          Rejouer
        </button>
      </div>
    );
  }

  return null;
}
