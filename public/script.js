
const API = "https://freela-apostas.onrender.com";

// Alternar telas
function showRegister() {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("registerBox").style.display = "block";
    document.getElementById("error").innerText = "";
}

function showLogin() {
    document.getElementById("registerBox").style.display = "none";
    document.getElementById("loginBox").style.display = "block";
    document.getElementById("error").innerText = "";
}

// Login
async function login() {

    const nome = document.getElementById("loginNome").value;
    const senha = document.getElementById("loginSenha").value;

    const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, senha })
    });

    if (!res.ok || res.text() != "") {
        document.getElementById("error").innerText = "Login inválido!";
        return;
    }

    const data = await res.json();

    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);

    if (data.user.admin) {
        window.location.href = "/admin/admin.html";
    } else {
        window.location.href = "/apostador/apostador.html";
    }
}

// Cadastro
async function register() {

    const nome = document.getElementById("registerNome").value;
    const senha = document.getElementById("registerSenha").value;

    const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nome,
            senha,
            pontuacao: 0
        })
    });

    if (!res.ok) {
        document.getElementById("error").innerText = "Erro ao criar conta!";
        return;
    }

    alert("Conta criada com sucesso!");

    showLogin();
}