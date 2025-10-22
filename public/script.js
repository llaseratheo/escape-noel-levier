
document.addEventListener('DOMContentLoaded', () => {
  const introMusic = document.getElementById('introMusic');
  const introVoice = document.getElementById('introVoice');
  const bgMusic = document.getElementById('backgroundMusic');
  const startButton = document.getElementById('startButton');

  // Lancement auto musique et voix au début
  introMusic.volume = 0.5;
  introVoice.volume = 1.0;
  introMusic.play().catch(()=>{});
  introVoice.play().catch(()=>{});

  // Quand on clique sur "Commencer l’aventure"
  startButton.addEventListener('click', () => {
    introMusic.pause();
    introVoice.pause();
    document.querySelector('.intro-screen').remove();
    bgMusic.volume = 0.35;
    bgMusic.play().catch(()=>{});
  });
});
