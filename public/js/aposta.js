import { api } from "./api.js";

export async function listarApostas() {
    try {
        const data = await api.listarApostas();

        const listaContainer = document.getElementById('principal-container');
        listaContainer.style.display = 'grid';
        listaContainer.innerHTML = '';

        for (const aposta of data) {
            const card = await gerarCardAposta(aposta);
            listaContainer.appendChild(card);
        }

    } catch (error) {
        console.error('Erro ao listar apostas:', error);
    }
}

const gerarCardAposta = async (aposta) => {
    const div = document.createElement('div');
    div.className = "card-aposta";

    try {
        const [p1, p2] = await Promise.all([
            api.buscarJogador(aposta.primeiroJogador),
            api.buscarJogador(aposta.segundoJogador)
        ]);

        console.log("P1:", p1);
        console.log("P2:", p2);

        div.innerHTML = `
    <h2>${p1.nome} vs ${p2.nome}</h2>
    <h3>Odd de ${p1.nome}: ${aposta.oddVitoriaPrimeiro}</h3>
    <h3>Odd de ${p2.nome}: ${aposta.oddVitoriaSegundo}</h3>
    <h3>Odd Empate: ${aposta.oddEmpate}</h3>
    <h5>Validade: ${aposta.validade}</h5>
    <div class="botoes-aposta">
        <button class="vitoria-primeiro">${p1.nome}</button>
        <button class="empate">Empate</button>
        <button class="vitoria-segundo">${p2.nome}</button>
    </div>
`;

        const btnPrimeiro = div.querySelector('.vitoria-primeiro');
        const btnEmpate = div.querySelector('.empate');
        const btnSegundo = div.querySelector('.vitoria-segundo');

        btnPrimeiro.addEventListener('click', () => {
            definirResultado(aposta.id, { ...aposta, resultado: 1 });
        });

        btnEmpate.addEventListener('click', () => {
            definirResultado(aposta.id, { ...aposta, resultado: 2 });
        });

        btnSegundo.addEventListener('click', () => {
            definirResultado(aposta.id, { ...aposta, resultado: 3 });
        });

        if (aposta.resultado) {
            btnPrimeiro.disabled = true;
            btnEmpate.disabled = true;
            btnSegundo.disabled = true;
        }

        const addForm = document.createElement('add-container');
        addForm.innerHTML =
            `
            <form>
                <label for="primeiroJogador">Primeiro jogador:</label>
                <select type="text" name="primeiroJogador" id="add-primeiro-jogador">
                </select>
                <label for="segundoJogador">Segundo jogador:</label>
                <select type="text" name="segundoJogador" id="add-segundo-jogador">
                </select>
                <input type="date" id="add-validade">
                <input type="button" id="add-aposta-button" value="Adicionar">
            </form>
        `

        addForm.querySelector(`#add-primeiro-jogador`).value = api.listarJogadores().then(jogadores => {
            jogadores.forEach(jogador => {
                const option = document.createElement('option');
                option.textContent = jogador.nome;
                option.value = jogador.id;
                addForm.querySelector('#add-primeiro-jogador').appendChild(option);
            });
        });

        addForm.querySelector(`#add-segundo-jogador`).value = api.listarJogadores().then(jogadores => {
            jogadores.forEach(jogador => {
                const option = document.createElement('option');
                option.textContent = jogador.nome;
                option.value = jogador.id;
                addForm.querySelector('#add-segundo-jogador').appendChild(option);
            });
        });

        addForm.querySelector('#add-aposta-button').addEventListener('click', () => {
            const novoAposta = {
                primeiroJogador: addForm.querySelector('#add-primeiro-jogador').value,
                segundoJogador: addForm.querySelector('#add-segundo-jogador').value,
                validade: addForm.querySelector('#add-validade').value,
            };
            api.cadastrarAposta(novoAposta).then(() => {
                listarApostas();
            });
        });

    } catch (error) {
        console.error("Erro ao buscar jogadores:", error);
    }

    return div;
};


const definirResultado = async (id, aposta) => {
    try {
        await api.atualizarApostas(id, aposta);

        aposta.palpites.forEach(palpite => {
            if (palpite.resultado === aposta.resultado) {
                api.buscarJogador(palpite.jogadorId).then(jogador => {
                    const pontos = () => {
                        switch (aposta.resultado) {
                            case 1:
                                return aposta.oddVitoriaPrimeiro;
                                break;
                            case 2:
                                return aposta.oddEmpate;
                                break;
                            default:
                                return aposta.oddVitoriaSegundo;
                                break;
                        }
                    };
                    const novaPontuacao = jogador.pontuacao + pontos;
                    api.atualizarApostas(jogador.id, novaPontuacao);
                });
            }
        });
    } catch (error) {
        console.error('Erro ao definir resultado da aposta:', error);
    }
}