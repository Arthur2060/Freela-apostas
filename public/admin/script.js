const API = "https://freela-apostas.onrender.com";
const user = localStorage.getItem("user")

if (localStorage.getItem("admin")) {
    console.log(`Entrada não autorizada de ${user}`)
    window.location.href = "/";
}

function showTab(id) {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll("nav button").forEach(b => b.classList.remove("active"));

    document.getElementById(id).classList.add("active");
    event.target.classList.add("active");

    loadJogadores();
    loadApostas();
    loadRanking();
}

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

async function loadApostas() {
    const res = await fetch(`${API}/apostas`);
    const data = await res.json();

    const cards = document.getElementById("apostasCards");
    cards.innerHTML = "";

    data.forEach(async (a) => {

        const aberta = a.resultado === null;

        const respPrimeiro = await fetch(`${API}/jogadores/${a.primeiroJogadorId}`);
        const respSegundo = await fetch(`${API}/jogadores/${a.segundoJogadorId}`);

        const primeiro = await respPrimeiro.json();
        const segundo = await respSegundo.json();

        cards.innerHTML += `
            <div class="card">
                <p>
                    <strong>${primeiro.nome || "Jogador 1"}</strong> 
                    vs 
                    <strong>${segundo.nome || "Jogador 2"}</strong>
                </p>

                <p>
                    Odds: 
                    ${a.oddVitoriaPrimeiro} | 
                    ${a.oddEmpate} | 
                    ${a.oddVitoriaSegundo}
                </p>

                <p>
                    Status: 
                    ${aberta ? "🟢 Aberta" : "🔴 Encerrada"}
                </p>

                ${
                    aberta
                    ? `
                        <select id="resultado-${a.id}">
                            <option value="0">Vitória ${primeiro.nome || "Jogador 1"}</option>
                            <option value="1">Empate</option>
                            <option value="2">Vitória ${segundo.nome || "Jogador 2"}</option>
                        </select>

                        <button class="primary" onclick="encerrarAposta('${a.id}')">
                            Encerrar Aposta
                        </button>
                      `
                    : `
                        <p>Resultado: ${
                            a.resultado == 0 ? a.primeiroJogadorNome :
                            a.resultado == 1 ? "Empate" :
                            a.segundoJogadorNome
                        }</p>
                      `
                }
            </div>
        `;
    });
}

async function encerrarAposta(id) {
    const select = document.getElementById(`resultado-${id}`);
    const resultado = select.value;

    const res = await fetch(`${API}/apostas/encerrar/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            resultado
        })
    });

    
    if (!res.ok) { 
        alert("Erro ao encerrar aposta: " + (await res.json()).error);
        return;
    }
    
    loadApostas();
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

function logout() {
    localStorage.clear();
    window.location.href = "/";
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