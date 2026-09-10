let allGames = [];
let fuse;

// THEME TOGGLE
const themeBtn = document.getElementById("theme-toggle");
themeBtn.onclick = () => {
  const body = document.body;

  if (body.classList.contains("theme-blue")) {
    body.classList.replace("theme-blue", "theme-dark");
    themeBtn.textContent = "Blue Theme";
  } else {
    body.classList.replace("theme-dark", "theme-blue");
    themeBtn.textContent = "Dark Theme";
  }
};

// RENDER GAMES
function renderGames(games) {
  const grid = document.getElementById("game-grid");
  grid.innerHTML = "";

  games.forEach(game => {
    const card = document.createElement("div");
    card.className = "game-card";
    card.style.cursor = "pointer";

    // Navigate when the card itself is clicked
    card.addEventListener("click", () => {
      window.location.href = game.url;
    });   

    card.innerHTML = `
      <img src="${game.thumbnail}" class="game-thumb">
      <h2>${game.name}</h2>
      <p>${game.description}</p>

      <button class="download-btn">
        Download for Windows
      </button>

      <button class="download-btn">
        Download for Linux
      </button>
    `;

    // Buttons: stop the click from bubbling to the card
    card.querySelectorAll(".download-btn").forEach((btn, i) => {
      const url = i === 0 ? game.downloads.windows : game.downloads.linux;
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        window.location.href = url;
      });
    });

    grid.appendChild(card);
  });
}   

// MARKETPLACE LOADER
async function loadMarketplace() {
  const featured = document.getElementById("featured-row");

  try {
    const res = await fetch("index.json");
    allGames = await res.json();
  } catch {
    document.getElementById("game-grid").innerHTML =
      "<div class='empty-message'>Failed to load marketplace.</div>";
    return;
  }

  // FIX: Ensure it's an array
  if (!Array.isArray(allGames)) {
    allGames = [allGames];
  }

  // FEATURED
  allGames.slice(0, 3).forEach(game => {
    const card = document.createElement("div");
    card.className = "featured-card";
    card.style.backgroundImage = `url(${game.thumbnail})`;

    // Navigate when the card itself is clicked
    card.addEventListener("click", () => {
      window.location.href = game.url;
    });

    card.innerHTML = `
      <div class="featured-overlay">
        <h3>${game.name}</h3>
      </div>
    `;

    featured.appendChild(card);
  });

  // INIT FUSE
  fuse = new Fuse(allGames, {
    keys: ["name", "description"],
    threshold: 0.3
  });

  // INITIAL RENDER
  renderGames(allGames);
}

loadMarketplace();

// SEARCH BAR
document.getElementById("search").addEventListener("input", e => {
  const query = e.target.value.trim();

  if (query === "") {
    renderGames(allGames);
    return;
  }

  const results = fuse.search(query).map(r => r.item);
  renderGames(results);
});
