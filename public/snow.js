// Animation de flocons de neige ❄️

const snowContainer = document.getElementById("snow-container");

function createSnowflake() {
  const snowflake = document.createElement("div");
  snowflake.classList.add("snowflake");
  snowflake.textContent = "❄";

  // Position et taille aléatoires
  snowflake.style.left = Math.random() * 100 + "vw";
  snowflake.style.fontSize = Math.random() * 12 + 10 + "px";
  snowflake.style.animationDuration = Math.random() * 5 + 5 + "s";
  snowflake.style.opacity = Math.random();

  snowContainer.appendChild(snowflake);

  // Supprime le flocon après sa chute
  setTimeout(() => {
    snowflake.remove();
  }, 10000);
}

// Génère les flocons régulièrement
setInterval(createSnowflake, 200);
