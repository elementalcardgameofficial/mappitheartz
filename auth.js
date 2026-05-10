(function () {
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
      setAuthStatus("Supabase library did not load.", true);
      return null;
    }

    const config = window.MAPPIT_AUTH || {};

    return window.supabase.createClient(
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

    if (!supabaseClient) return;

    document
      .getElementById("googleLoginBtn")
      .addEventListener("click", () => signInWithProvider(supabaseClient, "google"));

    document
      .getElementById("githubLoginBtn")
      .addEventListener("click", () => signInWithProvider(supabaseClient, "github"));

    checkActiveSession(supabaseClient);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAuth);
  } else {
    initAuth();
  }
})();
