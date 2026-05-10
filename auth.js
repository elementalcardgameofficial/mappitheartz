(function () {
  const config = window.MAPPIT_AUTH || {
    supabaseUrl: "https://mxzwtwhirpnccerrijrb.supabase.co",
    supabaseAnonKey: "sb_publishable_lra0O9LFM2hz-9ZIoEio8A_GH39JBya"
  };

  const supabase = window.supabase.createClient(
    config.supabaseUrl,
    config.supabaseAnonKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    }
  );

  const status = document.getElementById("authStatus");

  function showStatus(message, isError) {
    if (!status) return;
    status.textContent = message;
    status.className = isError ? "error" : "";
  }

  async function loginWithProvider(provider) {
    showStatus("Opening sign in...", false);

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: new URL("login.html", window.location.href).href,
        scopes: provider === "github" ? "read:user user:email" : undefined
      }
    });

    if (error) showStatus(error.message, true);
  }

  async function checkSession() {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      showStatus(error.message, true);
      return;
    }

    if (data.session && window.location.pathname.includes("login")) {
      window.location.href = "index.html";
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    document
      .getElementById("googleLoginBtn")
      ?.addEventListener("click", function () {
        loginWithProvider("google");
      });

    document
      .getElementById("githubLoginBtn")
      ?.addEventListener("click", function () {
        loginWithProvider("github");
      });

    checkSession();
  });
})();
