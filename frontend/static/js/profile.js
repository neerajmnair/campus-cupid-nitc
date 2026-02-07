// profile.js (Supabase-backed)
// - Loads existing profile details from Supabase.
// - Allows updating ONLY: Year + Interests.
//
// profile.html must include BEFORE this file:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
// <script>
//   window.SUPABASE_URL = "YOUR_PROJECT_URL";
//   window.SUPABASE_ANON_KEY = "YOUR_ANON_PUBLIC_KEY";
// </script>

(function () {
  const form = document.getElementById("profileForm");
  const messageEl = document.getElementById("message");

  const nameEl = document.getElementById("name");
  const deptEl = document.getElementById("department");
  const yearEl = document.getElementById("year");
  const interestsEl = document.getElementById("interests");
  const bioEl = document.getElementById("bio");

  function setMessage(text, ok) {
    if (!messageEl) return;
    messageEl.style.color = ok ? "#9cffc7" : "#ff8a80";
    messageEl.textContent = text;
  }

  function lockNonEditableFields() {
    // Only year + interests are editable
    if (nameEl) nameEl.readOnly = true;
    if (deptEl) deptEl.readOnly = true;
    if (bioEl) bioEl.readOnly = true;

    if (yearEl) yearEl.readOnly = false;
    if (interestsEl) interestsEl.readOnly = false;
  }

  function getSupabaseClient() {
    if (!window.supabase || !window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
      throw new Error(
        "Supabase not configured. Add the Supabase CDN + SUPABASE_URL + SUPABASE_ANON_KEY in profile.html before profile.js"
      );
    }
    return window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
  }

  async function getUserId(supabase) {
    // Prefer real auth user
    try {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user?.id) return data.user.id;
    } catch (_) {
      // ignore
    }
    // Fallback dummy user until login/signup is integrated
    return "11111111-1111-1111-1111-111111111111";
  }

  async function loadProfile() {
    const supabase = getSupabaseClient();
    const userId = await getUserId(supabase);

    const { data, error } = await supabase
      .from("profiles")
      .select("id,name,department,year,interests,bio")
      .eq("id", userId)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      lockNonEditableFields();
      setMessage("No profile found for this account yet. Create it first, then you can update Year/Interests.", false);
      return;
    }

    if (nameEl) nameEl.value = data.name ?? "";
    if (deptEl) deptEl.value = data.department ?? "";
    if (yearEl) yearEl.value = data.year ?? "";
    if (interestsEl) interestsEl.value = data.interests ?? "";
    if (bioEl) bioEl.value = data.bio ?? "";

    lockNonEditableFields();
    setMessage("Profile loaded ✅ You can update Year and Interests.", true);
  }

  async function updateYearAndInterests() {
    const supabase = getSupabaseClient();
    const userId = await getUserId(supabase);

    const year = (yearEl?.value || "").trim();
    const interests = (interestsEl?.value || "").trim();

    if (!year) throw new Error("Year is required.");

    const { error } = await supabase
  .from("profiles")
  .upsert({ id: userId, year, interests }, { onConflict: "id" });
    if (error) throw error;
  }

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      await updateYearAndInterests();
      setMessage("Profile updated ✅", true);
    } catch (err) {
      setMessage(`Error updating profile: ${err?.message || err}`, false);
    }
  });

  loadProfile().catch((err) => {
    lockNonEditableFields();
    setMessage(`Error loading profile: ${err?.message || err}`, false);
  });
})();
