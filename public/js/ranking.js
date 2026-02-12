import { api } from './api.js';

export async function listarRanking() {
    const data = await api.listarApostadores();

    const listaContainer = document.getElementById('principal-container');
    listaContainer.style.display = 'block';
    listaContainer.innerHTML = '';

    data.sort((a, b) => b.pontuacao - a.pontuacao);

    data.forEach(apostador => {
        const card = gerarCardApostador(apostador);
        listaContainer.appendChild(card);
    });
}

const gerarCardApostador = (apostador) => {
    const div = document.createElement('div');

    div.innerHTML = 
    `
    <div class="card-ranking">
        <h3>${apostador.nome}</h3>
        <p>Pontuação: ${apostador.pontuacao}</p>
    </div>
    `

    return div;
}