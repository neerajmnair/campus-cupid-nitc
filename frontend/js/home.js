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

  // Demo fill
  document.getElementById("demoFill").addEventListener("click", () => {
    requests = [
      { name: "Sneha", meta: "MECH • 2nd year", letter: "S" },
      { name: "Akhil", meta: "EEE • 3rd year", letter: "A" },
      { name: "Nihal", meta: "CSE • 1st year", letter: "N" },
      { name: "Meera", meta: "ECE • 4th year", letter: "M" },
    ];
    idx = 0;
    seen = 0;
    likes = 0;
    renderRequests();
    renderPerson();
  });

  renderPerson();
  renderRequests();
})();
