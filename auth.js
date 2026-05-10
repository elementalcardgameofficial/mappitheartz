// auth.js — Mappit Heartz GitHub OAuth via Supabase
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const { supabaseUrl, supabaseAnonKey } = window.MAPPIT_AUTH;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function loginWithGitHub() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: "https://mappithtml.netlify.app/index.html"
    }
  });
  if (error) console.error("Login error:", error.message);
}

async function logout() {
  await supabase.auth.signOut();
  window.location.href = "/login.html";
}

async function checkSession() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    const user = session.user;
    const avatar = document.getElementById("user-avatar");
    const username = document.getElementById("user-name");
    const logoutBtn = document.getElementById("logout-btn");
    const loginBtn = document.getElementById("login-btn");
    if (avatar) avatar.src = user.user_metadata.avatar_url || "";
    if (username) username.textContent = user.user_metadata.user_name || user.email;
    if (logoutBtn) logoutBtn.style.display = "block";
    if (loginBtn) loginBtn.style.display = "none";
    if (window.location.pathname.includes("login")) {
      window.location.href = "/index.html";
    }
  } else {
    if (!window.location.pathname.includes("login")) {
      window.location.href = "/login.html";
    }
  }
}

window.loginWithGitHub = loginWithGitHub;
window.logout = logout;
checkSession();
