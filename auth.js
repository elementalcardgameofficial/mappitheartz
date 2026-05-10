(function () {
  var cfg = window.MAPPIT_AUTH || {};
  var sb = supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);

  document.getElementById("githubLoginBtn")?.addEventListener("click", function () {
    document.getElementById("authStatus").textContent = "Redirecting to GitHub...";
    sb.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: "https://mappithtml.netlify.app/index.html" }
    });
  });

  document.getElementById("googleLoginBtn")?.addEventListener("click", function () {
    document.getElementById("authStatus").textContent = "Redirecting to Google...";
    sb.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: "https://mappithtml.netlify.app/index.html" }
    });
  });

  sb.auth.getSession().then(function (res) {
    if (res.data.session) window.location.href = "/index.html";
  });
})();
