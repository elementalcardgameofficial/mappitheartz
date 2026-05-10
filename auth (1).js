(function () {
  var cfg = window.MAPPIT_AUTH || {};
  var sb = supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);

  // GitHub login button
  document.getElementById("githubLoginBtn")?.addEventListener("click", function () {
    document.getElementById("authStatus").textContent = "Redirecting to GitHub...";
    sb.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: "https://mappithtml.netlify.app/index.html" }
    });
  });

  // Google login button
  document.getElementById("googleLoginBtn")?.addEventListener("click", function () {
    document.getElementById("authStatus").textContent = "Redirecting to Google...";
    sb.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: "https://mappithtml.netlify.app/index.html" }
    });
  });

  // If already logged in, skip login page
  sb.auth.getSession().then(function (res) {
    if (res.data.session) window.location.href = "/index.html";
  });
})();

// GitHub Login
async function loginWithGitHub() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: "https://mappithtml.netlify.app/index.html"
    }
  });
  if (error) console.error("Login error:", error.message);
}

// Logout
async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) console.error("Logout error:", error.message);
  window.location.href = "/login.html";
}

// Check session on page load
async function checkSession() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    // User is logged in
    const user = session.user;
    const avatar = document.getElementById("user-avatar");
    const username = document.getElementById("user-name");
    const logoutBtn = document.getElementById("logout-btn");
    const loginBtn = document.getElementById("login-btn");

    if (avatar) avatar.src = user.user_metadata.avatar_url || "";
    if (username) username.textContent = user.user_metadata.user_name || user.email;
    if (logoutBtn) logoutBtn.style.display = "block";
    if (loginBtn) loginBtn.style.display = "none";

    // If on login page and already logged in → go to app
    if (window.location.pathname.includes("login")) {
      window.location.href = "/index.html";
    }
  } else {
    // Not logged in — if on index, send to login
    if (!window.location.pathname.includes("login")) {
      window.location.href = "/login.html";
    }
  }
}

// Expose functions globally
window.loginWithGitHub = loginWithGitHub;
window.logout = logout;

// Run on load
checkSession();
