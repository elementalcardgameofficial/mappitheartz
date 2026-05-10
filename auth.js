// auth.js — Mappit Heartz
const { supabaseUrl, supabaseAnonKey } = window.MAPPIT_AUTH;
const { createClient } = supabase;
const sb = createClient(supabaseUrl, supabaseAnonKey);

// Wire up GitHub button
document.getElementById("githubLoginBtn")?.addEventListener("click", async () => {
  document.getElementById("authStatus").textContent = "Redirecting to GitHub...";
  const { error } = await sb.auth.signInWithOAuth({
    provider: "github",
    options: { redirectTo: "https://mappithtml.netlify.app/index.html" }
  });
  if (error) {
    document.getElementById("authStatus").textContent = error.message;
    document.getElementById("authStatus").classList.add("error");
  }
});

// Wire up Google button
document.getElementById("googleLoginBtn")?.addEventListener("click", async () => {
  document.getElementById("authStatus").textContent = "Redirecting to Google...";
  const { error } = await sb.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: "https://mappithtml.netlify.app/index.html" }
  });
  if (error) {
    document.getElementById("authStatus").textContent = error.message;
    document.getElementById("authStatus").classList.add("error");
  }
});

// Check session on load
(async () => {
  const { data: { session } } = await sb.auth.getSession();
  if (session) window.location.href = "/index.html";
})();
