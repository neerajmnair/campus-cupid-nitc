// home.js
(function () {
  // ===== Footer year =====
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ===== Supabase (dummy mode until auth is ready) =====
  // NOTE: home.html must include:
  // <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  // and define window.SUPABASE_URL + window.SUPABASE_ANON_KEY before loading this file.
  const supabase = window.supabase?.createClient?.(
    window.SUPABASE_URL,
    window.SUPABASE_ANON_KEY
  );

  // Dummy "current user" id (replace later with: (await supabase.auth.getUser()).data.user.id)
  const me = "11111111-1111-1111-1111-111111111111";

  async function loadMyProfile() {
  if (!supabase) return;

  const { data: myProfile, error } = await supabase
    .from("profiles")
    .select("name, department, year")
    .eq("id", me)
    .maybeSingle();

  if (error) {
    console.error("Failed to load my profile:", error);
    return;
  }

  // If no row exists yet, keep the default UI text.
  if (!myProfile) {
    console.warn("No profile row found for current user id:", me);
    return;
  }

  // Update UI
  const nameEl = document.querySelector(".profile__name");
  const subEl = document.querySelector(".profile__sub");
  const avatarEl = document.querySelector(".avatar");

  if (nameEl) nameEl.textContent = myProfile.name || "User";
  if (subEl) subEl.textContent = `${myProfile.department || ""} • ${myProfile.year || ""} yr`.trim();
  if (avatarEl) avatarEl.textContent = (myProfile.name || "U").trim().slice(0, 1).toUpperCase();
}


  // ===== Sidebar (mobile) =====
  const sidebar = document.querySelector(".sidebar");
  const openSidebar = document.getElementById("openSidebar");
  const overlay = document.getElementById("overlay");

  function setOverlay(show) {
    if (!overlay) return;
    overlay.hidden = !show;
    if (show) overlay.removeAttribute("hidden");
    else overlay.setAttribute("hidden", "");
  }

  openSidebar?.addEventListener("click", () => {
    sidebar?.classList.add("is-open");
    setOverlay(true);
  });

  overlay?.addEventListener("click", () => {
    sidebar?.classList.remove("is-open");
    setOverlay(false);
  });

  // ===== Profile dropdown =====
  const profile = document.getElementById("profileMenu");
  const profileBtn = document.getElementById("profileBtn");

  profileBtn?.addEventListener("click", () => {
    if (!profile) return;
    const open = profile.classList.toggle("is-open");
    profileBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });

  document.addEventListener("click", (e) => {
    if (!profile || !profileBtn) return;
    if (!profile.contains(e.target)) {
      profile.classList.remove("is-open");
      profileBtn.setAttribute("aria-expanded", "false");
    }
  });

  // ===== Tabs =====
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
    navItems.forEach((btn) => btn.classList.toggle("is-active", btn.dataset.tab === key));
    Object.entries(tabs).forEach(([k, el]) => el?.classList.toggle("is-active", k === key));
    if (pageTitle) pageTitle.textContent = titles[key][0];
    if (pageSubtitle) pageSubtitle.textContent = titles[key][1];

    sidebar?.classList.remove("is-open");
    setOverlay(false);
  }

  navItems.forEach((btn) => btn.addEventListener("click", () => showTab(btn.dataset.tab)));

  // ===== Supabase Feed + Swipes (Find tab) =====
  let feed = [];
  let feedIdx = 0;

  async function loadFeed() {
    if (!supabase) {
      console.error("Supabase client not initialized. Check SUPABASE_URL/ANON_KEY and script include.");
      return;
    }

    // Who I already swiped
    const { data: swiped, error: swipedErr } = await supabase
      .from("swipes")
      .select("to_user")
      .eq("from_user", me);

    if (swipedErr) throw swipedErr;

    const swipedSet = new Set((swiped || []).map((s) => s.to_user));

    // Get profiles (exclude those I already swiped AND exclude 'me' if your dummy is also in profiles)
    const { data: profiles, error: profilesErr } = await supabase
      .from("profiles")
      .select("*");

    if (profilesErr) throw profilesErr;

    feed = (profiles || []).filter((p) => p.id !== me && !swipedSet.has(p.id));
    feedIdx = 0;
    renderCurrent();
  }

  function renderCurrent() {
    const p = feed[feedIdx];
    const nameEl = document.getElementById("pName");
    const metaEl = document.getElementById("pMeta");
    const bioEl = document.getElementById("pBio");
    const tagsEl = document.getElementById("pTags");
    const scoreEl = document.getElementById("pScore");

    if (!nameEl || !metaEl || !bioEl || !tagsEl || !scoreEl) return;

    if (!p) {
      nameEl.textContent = "No more profiles";
      metaEl.textContent = "Try again later";
      bioEl.textContent = "";
      tagsEl.innerHTML = "";
      scoreEl.textContent = "--";
      return;
    }

    nameEl.textContent = p.name || "Unknown";
    metaEl.textContent = `${p.department || ""} • ${p.year || ""} year • ${p.hostel || ""}`.replace(/\s+•\s+•/g, " • ");
    bioEl.textContent = p.bio || "";

    const tags = String(p.interests || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    tagsEl.innerHTML = tags.map((t) => `<span class="tag">${t}</span>`).join("");

    // Simple match score demo (interest overlap)
    const myInterests = ["music", "coding", "chai"]; // dummy
    const overlap = tags.filter((t) => myInterests.includes(t.toLowerCase())).length;
    const score = Math.min(95, 60 + overlap * 10);
    scoreEl.textContent = `${score}%`;
  }

  async function doSwipe(decision) {
    const p = feed[feedIdx];
    if (!p || !supabase) return;

    // Insert swipe
    const { error: swipeErr } = await supabase.from("swipes").insert([
      { from_user: me, to_user: p.id, decision },
    ]);

    // Ignore duplicate (unique constraint) errors for demo
    if (swipeErr && !String(swipeErr.message || "").toLowerCase().includes("duplicate")) {
      throw swipeErr;
    }

    if (decision === "like") {
      // Check reverse like
      const { data: reverse, error: reverseErr } = await supabase
        .from("swipes")
        .select("id")
        .eq("from_user", p.id)
        .eq("to_user", me)
        .eq("decision", "like")
        .maybeSingle();

      if (reverseErr) throw reverseErr;

      if (reverse) {
        // Create match (unique index prevents duplicates)
        const { error: matchErr } = await supabase.from("matches").insert([
          { user1: me, user2: p.id },
        ]);

        if (!matchErr || String(matchErr.message || "").toLowerCase().includes("duplicate")) {
          alert(`🎉 It's a match with ${p.name}!`);
        } else {
          throw matchErr;
        }
      }
    }

    feedIdx += 1;
    renderCurrent();
  }

  document.getElementById("likeBtn")?.addEventListener("click", () => doSwipe("like"));
  document.getElementById("skipBtn")?.addEventListener("click", () => doSwipe("pass"));

  // ===== Requests (still mock for now) =====
  const reqGrid = document.getElementById("reqGrid");
  const reqCount = document.getElementById("reqCount");

  let requests = [
    { name: "Sneha", meta: "MECH • 2nd year", letter: "S" },
    { name: "Akhil", meta: "EEE • 3rd year", letter: "A" },
    { name: "Nihal", meta: "CSE • 1st year", letter: "N" },
  ];

  function renderRequests() {
    if (!reqCount || !reqGrid) return;

    reqCount.textContent = String(requests.length);
    reqGrid.innerHTML = requests
      .map(
        (r, i) => `
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
      `
      )
      .join("");

    const badgeReq = document.getElementById("badgeReq");
    if (badgeReq) badgeReq.textContent = String(requests.length);
  }

  reqGrid?.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    const i = Number(btn.dataset.i);
    const action = btn.dataset.action;

    requests.splice(i, 1);
    renderRequests();

    if (action === "accept") {
      const badgeChats = document.getElementById("badgeChats");
      if (badgeChats) badgeChats.textContent = String(Number(badgeChats.textContent || "0") + 1);
    }
  });

  // Boot
  renderRequests();
  loadMyProfile().catch(console.error);
  loadFeed().catch((err) => console.error("loadFeed failed:", err));
})();
