const API = "http://localhost:3000";
const user = JSON.parse(localStorage.getItem("apostador"));

if (!user) {
    window.location.href = "login.html";
}

const APOSTADOR_ID = user.id;

// =========================
// Navegação
// =========================
function showTab(id) {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll("nav button").forEach(b => b.classList.remove("active"));

    document.getElementById(id).classList.add("active");
    event.target.classList.add("active");
}

// =========================
// Jogadores (visualização)
// =========================
async function loadJogadores() {
    const res = await fetch(`${API}/jogadores`);
    const data = await res.json();

    const container = document.getElementById("jogadoresCards");
    container.innerHTML = "";

    data.forEach(j => {
        container.innerHTML += `
            <div class="card">
                <h4>${j.nome}</h4>
                <p>Nível: ${j.nivel}</p>
            </div>
        `;
    });
}

// =========================
// Apostas (com botões)
// =========================
async function loadApostas() {
    const res = await fetch(`${API}/apostas`);
    const data = await res.json();

    const abertas = data.filter(a => a.resultado === null);

    const container = document.getElementById("apostasCards");
    container.innerHTML = "";

    abertas.forEach(a => {
        container.innerHTML += `
            <div class="card">
                <p><strong>${a.primeiroJogadorId}</strong> vs <strong>${a.segundoJogadorId}</strong></p>

                <button class="primary" onclick="fazerPalpite('${a.id}', 0)">
                    Vitória Jogador 1 (${a.oddVitoriaPrimeiro})
                </button>

                <button class="secondary" onclick="fazerPalpite('${a.id}', 1)">
                    Empate (${a.oddEmpate})
                </button>

                <button class="primary" onclick="fazerPalpite('${a.id}', 2)">
                    Vitória Jogador 2 (${a.oddVitoriaSegundo})
                </button>
            </div>
        `;
    });
}

// =========================
// Fazer palpite
// =========================
async function fazerPalpite(apostaId, valor) {

    await fetch(`${API}/palpites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            apostaId,
            apostadorId: APOSTADOR_ID,
            valor
        })
    });

    alert("Palpite realizado!");
}

// =========================
// Ranking
// =========================
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