const API_BASE_URL = 'http://localhost:3000';

export const api = {

    login: async (username, password) => {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            alert('Erro ao fazer login: ' + response.statusText);
        }

        localStorage.setItem(`token`, (await response.json()).token);
    },

    listarJogadores: async () => {
        const response = await fetch(`${API_BASE_URL}/jogadores`);
        if (!response.ok) {
            alert('Erro ao listar jogadores: ' + response.statusText);
        } else {
            return await response.json();
        }
    },

    buscarJogador: async (id) => {
        const response = await fetch(`${API_BASE_URL}/jogadores/${id}`);

        if (!response.ok) {
            alert('Erro ao buscar jogador: ' + response.statusText);
        }
        
        return await response.json();
    },

    cadastrarJogador: async (jogador) => {
        const response = await fetch(`${API_BASE_URL}/jogadores`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jogador)
        });
        if (!response.ok) {
            alert('Erro ao cadastrar jogador: ' + response.statusText);
        } else {
            return await response.json();
        }
    },

    atualizarJogador: async (id, jogador) => {
        const response = await fetch(`${API_BASE_URL}/jogadores/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jogador)
        });
        if (!response.ok) {
            alert('Erro ao atualizar jogador: ' + response.statusText);
        } else {
            return await response.json();
        }
    },

    deletarJogador: async (id) => {
        const response = await fetch(`${API_BASE_URL}/jogadores/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            alert('Erro ao deletar jogador: ' + response.statusText);
        }
    },

    listarApostas: async () => {
        const response = await fetch(`${API_BASE_URL}/apostas`);
        if (!response.ok) {
            alert('Erro ao listar apostas: ' + response.statusText);
        } else {
            return await response.json();
        }
    },

    cadastrarApostas: async (aposta) => {
        const response = await fetch(`${API_BASE_URL}/apostas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(aposta)
        });
        if (!response.ok) {
            alert('Erro ao cadastrar aposta: ' + response.statusText);
        } else {
            return await response.json();
        }
    },

    atualizarApostas: async (id, aposta) => {
        const response = await fetch(`${API_BASE_URL}/apostas/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(aposta)
        });
        if (!response.ok) {
            alert('Erro ao atualizar aposta: ' + response.statusText);
        } else {
            return await response.json();
        }
    },

    listarApostadores: async () => {
        const response = await fetch(`${API_BASE_URL}/apostadores`);

        if (!response.ok) {
            alert('Erro ao listar apostadores: ' + response.statusText);
        }

        return await response.json();
    }
}