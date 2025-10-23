// 🎄 Gestion du son et des interactions d'intro

document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("startButton");
  const intro = document.getElementById("intro");

  // 🔊 Sons et musiques
  const introMusic = new Audio("/assets/musique_intro.wav");
  const narration = new Audio("/assets/voice_narration.wav");
  const jingle = new Audio("/assets/jingle.wav");
  const backgroundMusic = new Audio("/assets/music_enigmes.wav");

  // Réglages audio
  introMusic.volume = 0.5;
  narration.volume = 0.9;
  jingle.volume = 0.8;
  backgroundMusic.volume = 0.4;
  backgroundMusic.loop = true;

  // Lancement automatique de la musique d’intro
  introMusic.play().catch(() => {
    console.log("Lecture automatique bloquée — clic requis.");
  });

  // 🔘 Interaction : clic sur “Commencer”
  startButton.addEventListener("click", () => {
    // Arrêt de la musique d’intro
    introMusic.pause();
    introMusic.currentTime = 0;

    // Jingle + narration
    jingle.play();
    narration.play();

    // Transition visuelle (fade)
    intro.classList.add("fade-out");
    setTimeout(() => {
      intro.style.display = "none";
      // Lancement musique de fond
      backgroundMusic.play();
    }, 2000);
  });

  // Sécurité : si narration finie → lancer musique
  narration.addEventListener("ended", () => {
    backgroundMusic.play();
  });
});
