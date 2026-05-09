// auth.js — Mappit Heartz
(function () {
  const cfg = window.MAPPIT_AUTH;
  if (!cfg || !cfg.supabaseUrl || !cfg.supabaseAnonKey) {
    console.error("auth.js: window.MAPPIT_AUTH is not defined. Load auth-config.js first.");
    return;
  }

  const supabase = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);

  const statusEl = document.getElementById("authStatus");

  function setStatus(msg, isError) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = isError ? "error" : "";
  }

  async function signInWithProvider(provider) {
    setStatus("Redirecting to " + provider + "…", false);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin }
    });
    if (error) setStatus(error.message, true);
  }

  const googleBtn = document.getElementById("googleLoginBtn");
  const githubBtn = document.getElementById("githubLoginBtn");

  if (googleBtn) googleBtn.addEventListener("click", () => signInWithProvider("google"));
  if (githubBtn) githubBtn.addEventListener("click", () => signInWithProvider("github"));

  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) {
      setStatus("Signed in as " + (session.user.email || session.user.id), false);
    }
  });
})();
