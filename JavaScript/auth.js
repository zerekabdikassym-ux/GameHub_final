const API = "/api";

function showMsg(text, ok = false) {
  const el = document.getElementById("msg");
  if (!el) return;
  el.textContent = text;
  el.style.color = ok ? "green" : "red";
}

async function login() {
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value;

  if (!email || !password) {
    showMsg("Fill all fields");
    return;
  }

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      showMsg(data.message || "Login error");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    showMsg("Login success", true);

    setTimeout(() => {
      window.location.href = "profile.html";
    }, 500);

  } catch (e) {
    showMsg("Server error");
  }
}


async function signup() {
  const name = document.getElementById("name")?.value.trim();
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value;

  if (!name || !email || !password) {
    showMsg("Fill all fields");
    return;
  }

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: name,
        email,
        password
      })
    });

    const data = await res.json();

    if (!res.ok) {
      showMsg(data.message || "Register error");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    showMsg("Account created", true);

    setTimeout(() => {
      window.location.href = "profile.html";
    }, 500);

  } catch (e) {
    showMsg("Server error");
  }
}


document.addEventListener("DOMContentLoaded", () => {

  const btnLogin = document.getElementById("btnLogin");
  if (btnLogin) {
    btnLogin.addEventListener("click", login);
  }

  const btnSignup = document.getElementById("btnSignup");
  if (btnSignup) {
    btnSignup.addEventListener("click", signup);
  }

});

// Submit score to backend
async function submitScore(game, score) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No token found, score not submitted');
      return false;
    }

    // Use relative API path so it works locally and after deployment
    const response = await fetch(`${API}/users/score/${encodeURIComponent(game)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ score: Number.isFinite(Number(score)) ? Number(score) : 0 })
    });

    if (!response.ok) {
      console.error('Failed to submit score:', response.statusText);
      return false;
    }

    console.log(`✅ Score submitted for ${game}: ${score}`);
    return true;
  } catch (error) {
    console.error('Error submitting score:', error);
    return false;
  }
}
