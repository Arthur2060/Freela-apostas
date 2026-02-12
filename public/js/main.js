import { listarJogadores } from './jogadores.js';
import { listarApostas } from './aposta.js';
import { listarRanking } from './ranking.js';

const jogadoresButton = document.getElementById('jogadores');
const apostasButton = document.getElementById('apostas');
const rankingButton = document.getElementById('ranking');

jogadoresButton.addEventListener('click', () => {
    listarJogadores();
});

apostasButton.addEventListener('click', () => {
    listarApostas();
});

rankingButton.addEventListener('click', () => {
    listarRanking();
});