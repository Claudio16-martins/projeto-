const profileForm = document.getElementById("profile-form");
const profileName = document.getElementById("profile-name");
const profileClass = document.getElementById("profile-class");
const profileLevel = document.getElementById("profile-level");
const profileXp = document.getElementById("profile-xp");
const profileAchievements = document.getElementById("profile-achievements");
const profileAvatar = document.getElementById("profile-avatar");
const titleList = document.getElementById("title-list");

const statInputs = document.querySelectorAll("input[type='range']");
const combatOutput = document.getElementById("combat-output");
const buildRanking = document.getElementById("build-ranking");
const simulateBtn = document.getElementById("simulate");
const saveBuildBtn = document.getElementById("save-build");

const modsList = document.getElementById("mods-list");
const modSearch = document.getElementById("mod-search");
const modFilter = document.getElementById("mod-filter");

const chatLog = document.getElementById("chat-log");
const chatForm = document.getElementById("chat-form");

const questList = document.getElementById("quest-list");
const newQuestBtn = document.getElementById("new-quest");
const inventoryEl = document.getElementById("inventory");
const offlineStatus = document.getElementById("offline-status");
const toggleOfflineBtn = document.getElementById("toggle-offline");

const postForm = document.getElementById("post-form");
const postsEl = document.getElementById("posts");

const mapInfo = document.getElementById("map-info");
const mapNodes = document.querySelectorAll(".map-node");

const audioBtn = document.getElementById("toggle-audio");
const easterEggBtn = document.getElementById("easter-egg");

const storage = {
  get(key, fallback) {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
};

const titles = ["Dovahkiin", "Mestre das Runas", "Guardião", "Sombra de Hrothgar"];

const mods = [
  { name: "Dragonborn Reforged", type: "combat", rating: 5, desc: "Combate visceral e novos gritos." },
  { name: "Aurora Boreal", type: "visual", rating: 4, desc: "Céus com auroras e gelo cintilante." },
  { name: "Nordic Legends", type: "quest", rating: 5, desc: "Histórias épicas de Jarls esquecidos." },
  { name: "Runas Antigas", type: "visual", rating: 3, desc: "UI místico com símbolos nórdicos." },
  { name: "Sangue de Dragão", type: "combat", rating: 4, desc: "Habilidades lendárias e novos inimigos." },
];

const quests = [
  "Proteja a vila de Riverwood dos saqueadores.",
  "Recupere o amuleto perdido em uma tumba nórdica.",
  "Encontre o dragão escondido nas Montanhas Cinzentas.",
  "Escolte o mago arcano até Winterhold.",
];

const inventoryItems = [
  "Poção de resistência",
  "Espada de aço",
  "Pergaminho antigo",
  "Armadura de couro",
];

const buildScores = storage.get("buildScores", []);
const posts = storage.get("posts", []);

function updateProfileDisplay(data) {
  profileName.textContent = data.name || "Sem herói registrado";
  profileClass.textContent = `Classe: ${data.classe || "—"}`;
  profileLevel.textContent = data.nivel || 0;
  profileXp.textContent = data.xp || 0;
  profileAchievements.textContent = data.achievements || 0;

  if (data.avatar) {
    profileAvatar.innerHTML = `<img src="${data.avatar}" alt="Avatar" />`;
  } else {
    profileAvatar.textContent = "ᛞ";
  }

  titleList.innerHTML = "";
  (data.titles || []).forEach((title) => {
    const tag = document.createElement("span");
    tag.textContent = title;
    titleList.appendChild(tag);
  });
}

function initProfile() {
  const savedProfile = storage.get("profile", null) || {
    name: "",
    classe: "",
    avatar: "",
    nivel: 0,
    xp: 0,
    achievements: 2,
    titles: [titles[0]],
  };
  updateProfileDisplay(savedProfile);
}

profileForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(profileForm);
  const profile = {
    name: formData.get("name"),
    classe: formData.get("classe"),
    avatar: formData.get("avatar"),
    nivel: Number(formData.get("nivel")),
    xp: Number(formData.get("xp")),
    achievements: Math.floor(Math.random() * 10) + 1,
    titles: titles.slice(0, Math.floor(Math.random() * titles.length) + 1),
  };
  storage.set("profile", profile);
  updateProfileDisplay(profile);
});

statInputs.forEach((input) => {
  input.addEventListener("input", () => {
    document.getElementById(input.dataset.stat).textContent = input.value;
  });
});

function calculateBuildScore() {
  const stats = Array.from(statInputs).reduce((sum, input) => sum + Number(input.value), 0);
  return Math.round(stats * (0.9 + Math.random() * 0.4));
}

function renderRanking() {
  buildRanking.innerHTML = "";
  buildScores.slice(0, 5).forEach((score, index) => {
    const item = document.createElement("li");
    item.textContent = `#${index + 1} - ${score} pontos`;
    buildRanking.appendChild(item);
  });
}

simulateBtn.addEventListener("click", () => {
  const score = calculateBuildScore();
  combatOutput.textContent = `Ataque lendário: ${score}`;
});

saveBuildBtn.addEventListener("click", () => {
  const score = calculateBuildScore();
  buildScores.unshift(score);
  buildScores.sort((a, b) => b - a);
  storage.set("buildScores", buildScores);
  renderRanking();
});

function renderMods(filterText = "", type = "all") {
  modsList.innerHTML = "";
  mods
    .filter((mod) => mod.name.toLowerCase().includes(filterText.toLowerCase()))
    .filter((mod) => type === "all" || mod.type === type)
    .forEach((mod) => {
      const item = document.createElement("div");
      item.className = "mod-item";
      item.innerHTML = `
        <div>
          <h4>${mod.name}</h4>
          <p class="muted">${mod.desc}</p>
          <div class="stars">${"★".repeat(mod.rating)}${"☆".repeat(5 - mod.rating)}</div>
        </div>
        <div>
          <button class="btn outline" data-download="${mod.name}">Download</button>
        </div>
      `;
      modsList.appendChild(item);
    });
}

modsList.addEventListener("click", (event) => {
  if (event.target.matches("button[data-download]")) {
    event.target.textContent = "Baixando...";
    setTimeout(() => {
      event.target.textContent = "Instalado";
    }, 900);
  }
});

modSearch.addEventListener("input", () => {
  renderMods(modSearch.value, modFilter.value);
});

modFilter.addEventListener("change", () => {
  renderMods(modSearch.value, modFilter.value);
});

function addChatMessage(message, role = "player") {
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${role === "npc" ? "npc" : ""}`;
  bubble.textContent = message;
  chatLog.appendChild(bubble);
  chatLog.scrollTop = chatLog.scrollHeight;
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = chatForm.message;
  addChatMessage(input.value, "player");
  const responses = [
    "As estrelas murmuram sobre sua coragem, viajante.",
    "Traga-me a relíquia perdida e será honrado pelos Jarls.",
    "Sinto o eco dos dragões em sua voz. Prossiga com cautela.",
  ];
  setTimeout(() => {
    addChatMessage(responses[Math.floor(Math.random() * responses.length)], "npc");
  }, 500);
  input.value = "";
});

function renderQuests() {
  questList.innerHTML = "";
  const savedQuests = storage.get("quests", quests.slice(0, 2));
  savedQuests.forEach((quest) => {
    const li = document.createElement("li");
    li.textContent = quest;
    questList.appendChild(li);
  });
}

newQuestBtn.addEventListener("click", () => {
  const quest = quests[Math.floor(Math.random() * quests.length)];
  const current = storage.get("quests", []);
  current.unshift(quest);
  storage.set("quests", current.slice(0, 4));
  renderQuests();
});

function renderInventory() {
  inventoryEl.innerHTML = "";
  inventoryItems.forEach((item) => {
    const span = document.createElement("span");
    span.textContent = `🧭 ${item}`;
    inventoryEl.appendChild(span);
  });
}

function renderOfflineStatus() {
  const status = storage.get("offline", false);
  offlineStatus.textContent = status ? "Ativado" : "Desativado";
}

toggleOfflineBtn.addEventListener("click", () => {
  const current = storage.get("offline", false);
  storage.set("offline", !current);
  renderOfflineStatus();
});

postForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(postForm);
  const post = {
    title: formData.get("title"),
    content: formData.get("content"),
    likes: 0,
    reputation: Math.floor(Math.random() * 100),
  };
  posts.unshift(post);
  storage.set("posts", posts);
  renderPosts();
  postForm.reset();
});

function renderPosts() {
  postsEl.innerHTML = "";
  posts.forEach((post, index) => {
    const el = document.createElement("div");
    el.className = "post";
    el.innerHTML = `
      <h4>${post.title}</h4>
      <p>${post.content}</p>
      <div class="post-actions">
        <button class="btn outline" data-like="${index}">❤️ ${post.likes}</button>
        <span class="muted">Reputação: ${post.reputation}</span>
      </div>
    `;
    postsEl.appendChild(el);
  });
}

postsEl.addEventListener("click", (event) => {
  if (event.target.matches("button[data-like]")) {
    const index = Number(event.target.dataset.like);
    posts[index].likes += 1;
    storage.set("posts", posts);
    renderPosts();
  }
});

mapNodes.forEach((node) => {
  node.addEventListener("click", () => {
    mapInfo.textContent = `${node.dataset.location}: ruínas, tesouros e histórias ocultas.`;
  });
});

const revealElements = document.querySelectorAll(".section, .hero-content");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((el) => {
  el.classList.add("reveal");
  observer.observe(el);
});

let audioContext;
let audioSource;

audioBtn.addEventListener("click", () => {
  if (!audioContext) {
    audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 110;
    gainNode.gain.value = 0.04;
    oscillator.connect(gainNode).connect(audioContext.destination);
    oscillator.start();
    audioSource = oscillator;
    audioBtn.textContent = "🔊 Sons ON";
    return;
  }

  if (audioContext.state === "running") {
    audioContext.suspend();
    audioBtn.textContent = "🔇 Sons OFF";
  } else {
    audioContext.resume();
    audioBtn.textContent = "🔊 Sons ON";
  }
});

let secretSequence = "";
const secretCode = "dovah";

document.addEventListener("keydown", (event) => {
  secretSequence += event.key.toLowerCase();
  if (!secretCode.startsWith(secretSequence)) {
    secretSequence = "";
  }
  if (secretSequence === secretCode) {
    addChatMessage("Você encontrou o Easter Egg do Dragão Ancestral!", "npc");
    secretSequence = "";
  }
});

easterEggBtn?.addEventListener("click", () => {
  addChatMessage("O segredo está nos ventos de Skyrim...", "npc");
});

initProfile();
renderRanking();
renderMods();
renderQuests();
renderInventory();
renderOfflineStatus();
renderPosts();
addChatMessage("Saudações, viajante. Como posso guiar sua lenda hoje?", "npc");
