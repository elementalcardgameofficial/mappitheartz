(function () {
  const fallbackConfig = {
    supabaseUrl: "https://mxzwtwhirpnccerrijrb.supabase.co",
    supabaseAnonKey: "sb_publishable_lra0O9LFM2hz-9ZIoEio8A_GH39JBya"
  };

  function getConfig() {
    const config = window.MAPPIT_AUTH || {};
    return {
      supabaseUrl: config.supabaseUrl || fallbackConfig.supabaseUrl,
      supabaseAnonKey: config.supabaseAnonKey || fallbackConfig.supabaseAnonKey
    };
  }

  function setAuthStatus(message, isError = false) {
    const authStatus = document.getElementById("authStatus");
    if (!authStatus) return;
    authStatus.textContent = message;
    authStatus.className = isError ? "error" : "";
  }

  function getRedirectUrl() {
    return new URL("login.html", window.location.href).href;
  }

  function createSupabaseClient() {
    if (!window.supabase || !window.supabase.createClient) {
      setAuthStatus("Supabase library did not load. Check the CDN script tag.", true);
      return null;
    }

    const config = getConfig();

    if (!config.supabaseUrl || !config.supabaseAnonKey) {
      setAuthStatus("Missing Supabase URL or anon key.", true);
      return null;
    }

    return window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  }

  async function checkActiveSession(supabaseClient) {
    const { data, error } = await supabaseClient.auth.getSession();

    if (error) {
      setAuthStatus(error.message, true);
      return;
    }

    if (data.session) {
      window.location.href = "index.html";
    }
  }

  async function signInWithProvider(supabaseClient, provider) {
    setAuthStatus("Opening sign in...");

    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: getRedirectUrl(),
        scopes: provider === "github" ? "read:user user:email" : undefined
      }
    });

    if (error) {
      setAuthStatus(error.message, true);
    }
  }

  function initAuth() {
    const supabaseClient = createSupabaseClient();
    const googleButton = document.getElementById("googleLoginBtn");
    const githubButton = document.getElementById("githubLoginBtn");

    if (!googleButton || !githubButton) {
      setAuthStatus("Login buttons were not found on the page.", true);
      return;
    }

    if (!supabaseClient) {
      googleButton.disabled = true;
      githubButton.disabled = true;
      return;
    }

    googleButton.addEventListener("click", () => signInWithProvider(supabaseClient, "google"));
    githubButton.addEventListener("click", () => signInWithProvider(supabaseClient, "github"));

    checkActiveSession(supabaseClient).catch((error) => {
      setAuthStatus(error.message || "Could not check login session.", true);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAuth);
  } else {
    initAuth();
  }
})();
