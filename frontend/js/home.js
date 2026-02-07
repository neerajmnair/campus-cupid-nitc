// home.js
(function () {
  document.getElementById("year").textContent = new Date().getFullYear();

  // Sidebar (mobile)
  const sidebar = document.querySelector(".sidebar");
  const openSidebar = document.getElementById("openSidebar");
  const overlay = document.getElementById("overlay");

  function setOverlay(show) {
    overlay.hidden = !show;
    if (show) overlay.removeAttribute("hidden");
    else overlay.setAttribute("hidden", "");
  }

  openSidebar?.addEventListener("click", () => {
    sidebar.classList.add("is-open");
    setOverlay(true);
  });

  overlay?.addEventListener("click", () => {
    sidebar.classList.remove("is-open");
    setOverlay(false);
  });

  // Profile dropdown
  const profile = document.getElementById("profileMenu");
  const profileBtn = document.getElementById("profileBtn");

  profileBtn.addEventListener("click", () => {
    const open = profile.classList.toggle("is-open");
    profileBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });

  document.addEventListener("click", (e) => {
    if (!profile.contains(e.target)) {
      profile.classList.remove("is-open");
      profileBtn.setAttribute("aria-expanded", "false");
    }
  });

  // Tabs
  const navItems = Array.from(document.querySelectorAll(".nav__item"));
  const tabs = {
    find: document.getElementById("tab-find"),
    chats: document.getElementById("tab-chats"),
    requests: document.getElementById("tab-requests"),
  };
  const pageTitle = document.getElementById("pageTitle");
  const pageSubtitle = document.getElementById("pageSubtitle");

  const titles = {
    find: ["Find People", "Discover students around campus"],
    chats: ["Chats", "Message your mutual matches"],
    requests: ["Requests", "Review pending likes and matches"],
  };

  function showTab(key) {
    navItems.forEach(btn => btn.classList.toggle("is-active", btn.dataset.tab === key));
    Object.entries(tabs).forEach(([k, el]) => el.classList.toggle("is-active", k === key));
    pageTitle.textContent = titles[key][0];
    pageSubtitle.textContent = titles[key][1];

    sidebar.classList.remove("is-open");
    setOverlay(false);
  }

  // ================= Chats (interactive) =================
const chatItems = Array.from(document.querySelectorAll(".chat-item"));
const chatBody = document.getElementById("chatBody");
const chatForm = document.getElementById("chatForm");
const chatMsg = document.getElementById("chatMsg");

const activeChatAvatar = document.getElementById("activeChatAvatar");
const activeChatName = document.getElementById("activeChatName");
const activeChatSub = document.getElementById("activeChatSub");

// Simple local chat store (replace with API later)
const chats = [
  {
    id: 0,
    name: "Ananya Menon",
    avatar: "A",
    sub: "Online • Mutual match",
    messages: [
      { from: "them", text: "Hey! You’re the one who likes badminton too?" },
      { from: "me", text: "Yep 😄 Wanna play sometime near SAC?" },
      { from: "them", text: "Sure! Evening works best." },
    ],
  },
  {
    id: 1,
    name: "Rahul",
    avatar: "R",
    sub: "Last seen 1h ago • Mutual match",
    messages: [
      { from: "them", text: "Nice playlist 😄" },
      { from: "me", text: "Haha thanks! Send yours too?" },
    ],
  },
];

let activeChatId = 0;

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[m]));
}

function renderChatHeader(chat) {
  activeChatAvatar.textContent = chat.avatar;
  activeChatName.textContent = chat.name;
  activeChatSub.textContent = chat.sub;
}

function renderChatBody(chat) {
  chatBody.innerHTML = chat.messages
    .map(m => `<div class="bubble bubble--${m.from}">${escapeHtml(m.text)}</div>`)
    .join("");
  chatBody.scrollTop = chatBody.scrollHeight;
}

function setActiveChat(id) {
  activeChatId = id;

  chatItems.forEach(btn => {
    btn.classList.toggle("is-active", Number(btn.dataset.chat) === id);
  });

  const chat = chats.find(c => c.id === id);
  if (!chat) return;

  renderChatHeader(chat);
  renderChatBody(chat);
}

function updateChatPreview(id, text) {
  const btn = chatItems.find(b => Number(b.dataset.chat) === id);
  if (!btn) return;
  const previewEl = btn.querySelector("[data-preview]");
  const timeEl = btn.querySelector("[data-time]");
  if (previewEl) previewEl.textContent = `You: ${text}`;
  if (timeEl) timeEl.textContent = "now";
}

// Click chat in left list -> open it
chatItems.forEach(btn => {
  btn.addEventListener("click", () => {
    const id = Number(btn.dataset.chat);
    setActiveChat(id);
  });
});

// Send message
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = chatMsg.value.trim();
  if (!text) return;

  const chat = chats.find(c => c.id === activeChatId);
  if (!chat) return;

  chat.messages.push({ from: "me", text });
  renderChatBody(chat);
  updateChatPreview(activeChatId, text);

  chatMsg.value = "";
  chatMsg.focus();
});

// Better UX: Enter sends, Shift+Enter does nothing (input is single-line anyway)
chatMsg.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    chatForm.requestSubmit();
  }
});

// Initialize chat area based on first active item
setActiveChat(0);


  navItems.forEach(btn => btn.addEventListener("click", () => showTab(btn.dataset.tab)));

  // Find People (mock rotation)
  const people = [
    {
      name: "Ananya Menon",
      meta: "ECE • 3rd year • Girls Hostel",
      score: "82%",
      bio: "Love late-night chai, campus walks, and indie playlists. Looking for someone to explore Calicut food spots with.",
      tags: ["Chai", "Music", "Badminton", "Movies"],
    },
    {
      name: "Rohit Nair",
      meta: "CSE • 2nd year • B-Block",
      score: "76%",
      bio: "Hackathons, football, and dosa hunts. If you like late-night coding + memes, we’ll vibe.",
      tags: ["Hackathons", "Football", "Memes", "Food"],
    },
    {
      name: "Fathima K",
      meta: "ARCH • 4th year • Architecture Dept",
      score: "88%",
      bio: "Sketching, design, and sunrise walks near the lake. Teach me your favorite song?",
      tags: ["Design", "Sketching", "Walks", "Music"],
    },
  ];

  let idx = 0;
  let seen = 12;
  let likes = 4;

  const pName = document.getElementById("pName");
  const pMeta = document.getElementById("pMeta");
  const pScore = document.getElementById("pScore");
  const pBio = document.getElementById("pBio");
  const pTags = document.getElementById("pTags");
  const statSeen = document.getElementById("statSeen");
  const statLikes = document.getElementById("statLikes");

  function renderPerson() {
    const p = people[idx % people.length];
    pName.textContent = p.name;
    pMeta.textContent = p.meta;
    pScore.textContent = p.score;
    pBio.textContent = p.bio;
    pTags.innerHTML = p.tags.map(t => `<span class="tag">${t}</span>`).join("");
    statSeen.textContent = String(seen);
    statLikes.textContent = String(likes);
  }

  function advance(type) {
    seen += 1;
    if (type === "like") likes += 1;
    idx += 1;
    renderPerson();
  }

  document.getElementById("skipBtn").addEventListener("click", () => advance("skip"));
  document.getElementById("likeBtn").addEventListener("click", () => advance("like"));

  // Requests (mock)
  const reqGrid = document.getElementById("reqGrid");
  const reqCount = document.getElementById("reqCount");
  let requests = [
    { name: "Sneha", meta: "MECH • 2nd year", letter: "S" },
    { name: "Akhil", meta: "EEE • 3rd year", letter: "A" },
    { name: "Nihal", meta: "CSE • 1st year", letter: "N" },
  ];

  function renderRequests() {
    reqCount.textContent = String(requests.length);
    reqGrid.innerHTML = requests.map((r, i) => `
      <article class="req-card">
        <div class="req-card__top">
          <div class="req-card__avatar" aria-hidden="true">${r.letter}</div>
        </div>
        <div class="req-card__body">
          <div class="req-card__name">${r.name}</div>
          <div class="req-card__meta">${r.meta}</div>
          <div class="req-card__actions">
            <button class="btn btn--ghost" data-action="reject" data-i="${i}" type="button">Reject</button>
            <button class="btn btn--primary" data-action="accept" data-i="${i}" type="button">Accept</button>
          </div>
        </div>
      </article>
    `).join("");

    document.getElementById("badgeReq").textContent = String(requests.length);
  }

  reqGrid.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const i = Number(btn.dataset.i);
    const action = btn.dataset.action;

    requests.splice(i, 1);
    renderRequests();

    if (action === "accept") {
      const badgeChats = document.getElementById("badgeChats");
      badgeChats.textContent = String(Number(badgeChats.textContent || "0") + 1);
    }
  });

  renderPerson();
  renderRequests();
})();
