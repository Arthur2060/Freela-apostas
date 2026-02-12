import { api } from './api.js';

const addButton = document.getElementById('add-jogador-button');
const closeButton = document.getElementById('close-button');

closeButton.addEventListener('click', () => {
    document.getElementById('edit-form').style.display = 'none';
});

addButton.addEventListener('click', async () => {
    const nome = document.getElementById('add-nome').value;
    const nivel = document.getElementById('add-nivel').value;

    try {
        await api.cadastrarJogador({ nome, nivel });
        listarJogadores();
    } catch (error) {
        console.error(error);
    }
});

export async function listarJogadores() {
    try {
        const jogadores = await api.listarJogadores();

        const container = document.getElementById('principal-container');
        container.style.display = `grid`;
        container.innerHTML = '';

        jogadores.forEach(jogador => {
            container.appendChild(criarCardJogador(jogador));
        });

    } catch (error) {
        console.error(error);
    }
}

const exibirFormularioEdicao = (id) => {
    const editForm = document.getElementById('edit-form');
    editForm.style.display = 'flex';

    const botao = document.getElementById('edit-button');

    botao.onclick = () => {
        const nome = document.getElementById('edit-nome').value;
        const nivel = document.getElementById('edit-nivel').value;

        editarJogador(id, nome, nivel);
    };
};

const editarJogador = async (id, nome, nivel) => {
    try {
        await api.atualizarJogador(id, { nome, nivel });
        listarJogadores();
    } catch (error) {
        console.error(error);
    }
};

const criarCardJogador = (jogador) => {
    const div = document.createElement('div');
    div.className = "card-jogador";

    div.innerHTML = `
        <h2>${jogador.nome}</h2>
        <h3>Nível: ${jogador.nivel}</h3>
        <h3>Vencidos: ${jogador.vencidos}</h3>
        <h3>Empates: ${jogador.empates}</h3>
        <h3>Derrotas: ${jogador.perdidos}</h3>
        <button class="edit-button">Editar</button>
        <button class="delete-button">Deletar</button>
    `;

    div.querySelector('.delete-button')
        .addEventListener('click', () => deletarJogador(jogador.id));

    div.querySelector('.edit-button')
        .addEventListener('click', () => exibirFormularioEdicao(jogador.id));

    return div;
};

const deletarJogador = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar este jogador?')) return;

    try {
        await api.deletarJogador(id);
        listarJogadores();
    } catch (error) {
        console.error(error);
    }
};
