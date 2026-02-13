const API = "http://localhost:3000";
const user = JSON.parse(localStorage.getItem("apostador"));

if (!user || user.id == undefined) {
    window.location.href = "/";
}

const APOSTADOR_ID = user.id; // ✅ agora funciona

document.querySelector("#header-nome").innerText = user.nome;

function showTab(id) {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll("nav button").forEach(b => b.classList.remove("active"));

    document.getElementById(id).classList.add("active");
    event.target.classList.add("active");
}

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

function logout() {
    localStorage.clear();
    window.location.href = "/";
}

async function loadApostas() {
    const res = await fetch(`${API}/apostas`);
    const data = await res.json();

    const abertas = data.filter(a => a.resultado === null);

    const container = document.getElementById("apostasCards");
    container.innerHTML = "";

    abertas.forEach(a => {
        
        const jogador1 = fetch(`${API}/jogadores/${a.primeiroJogadorId}`);
        const jogador2 = fetch(`${API}/jogadores/${a.segundoJogadorId}`);


        container.innerHTML += `
            <div class="card">
                <p><strong>${jogador1.nome}</strong> vs <strong>${jogador2.nome}</strong></p>

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

async function fazerPalpite(apostaId, valor) {

    const resp = await fetch(`${API}/palpites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            apostaId,
            apostadorId: APOSTADOR_ID,
            valor
        })
    });

    if (!resp.ok) {
        alert("Erro ao fazer palpite: " + (await resp.json()).error);
    }
}

async function loadRanking() {
    const res = await fetch(`${API}/apostadores`);
    const data = await res.json();

    data.sort((a, b) => (b.pontuacao || 0) - (a.pontuacao || 0));

    const tbody = document.getElementById("rankingBody");
    tbody.innerHTML = "";

    data.forEach((a, index) => {
        tbody.innerHTML += `
            <tr>
                <th>${index + 1}</th>
                <th>${a.nome}</th>
                <th>${a.pontuacao || 0}</th>
            </tr>
        `;
    });
}

loadJogadores();
loadApostas();
loadRanking();