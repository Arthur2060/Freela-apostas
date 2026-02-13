
const API = "http://localhost:3000";

function showTab(id) {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll("nav button").forEach(b => b.classList.remove("active"));

    document.getElementById(id).classList.add("active");
    event.target.classList.add("active");
}

// ==========================
// JOGADORES
// ==========================
async function loadJogadores() {
    const res = await fetch(`${API}/jogadores`);
    const data = await res.json();

    const cards = document.getElementById("jogadoresCards");
    cards.innerHTML = "";

    const select1 = document.getElementById("selectJogador1");
    const select2 = document.getElementById("selectJogador2");

    select1.innerHTML = "";
    select2.innerHTML = "";

    data.forEach(j => {
        cards.innerHTML += `
            <div class="card">
                <h4>${j.nome}</h4>
                <p>Nível: ${j.nivel}</p>
            </div>
        `;

        select1.innerHTML += `<option value="${j.id}">${j.nome}</option>`;
        select2.innerHTML += `<option value="${j.id}">${j.nome}</option>`;
    });
}

async function addJogador() {
    const nome = document.getElementById("nomeJogador").value;
    const nivel = Number(document.getElementById("nivelJogador").value);

    await fetch(`${API}/jogadores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, nivel })
    });

    loadJogadores();
}

// ==========================
// APOSTAS
// ==========================
async function loadApostas() {
    const res = await fetch(`${API}/apostas`);
    const data = await res.json();

    const cards = document.getElementById("apostasCards");
    cards.innerHTML = "";

    const jogador1 = await fetch(`${API}/jogadores/${primeiroJogadorId}`);
    const jogador2 = await fetch(`${API}/jogadores/${segundoJogadorId}`);

    if (!jogador1.ok || !jogador2.ok) {
        cards.innerHTML = "<p>Erro ao carregar apostas.</p>";
        return;
    }

    const jogador1Data = await jogador1.json();
    const jogador2Data = await jogador2.json();

    data.forEach(a => {
        cards.innerHTML += `
            <div class="card">
                <p><strong>${jogador1Data.nome}</strong> vs <strong>${jogador2Data.nome}</strong></p>
                <p>Resultado: ${a.resultado === null ? "Aberta" : a.resultado}</p>
                <p>Odds: ${a.oddVitoriaPrimeiro} | ${a.oddEmpate} | ${a.oddVitoriaSegundo}</p>
            </div>
        `;
    });
}

async function addAposta() {
    const p1 = document.getElementById("selectJogador1").value;
    const p2 = document.getElementById("selectJogador2").value;

    await fetch(`${API}/apostas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            primeiroJogadorId: p1,
            segundoJogadorId: p2
        })
    });

    loadApostas();
}

// ==========================
// RANKING
// ==========================
async function loadRanking() {
    const res = await fetch(`${API}/apostadores`);
    const data = await res.json();

    data.sort((a, b) => (b.pontuacao || 0) - (a.pontuacao || 0));

    const tbody = document.getElementById("rankingBody");
    tbody.innerHTML = "";

    data.forEach((a, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${a.nome}</td>
                <td>${a.pontuacao || 0}</td>
            </tr>
        `;
    });
}

// INIT
loadJogadores();
loadApostas();
loadRanking();