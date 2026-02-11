// Declaração das dependências e configuração do servidor Express, CORS, Firebase Admin SDK e Body Parser.

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

// Chave do Firebase Admin SDK
const serviceAccount = require('./freela-apostas-firebase-adminsdk-fbsvc-89af620e4c.json');

// Inicialização do Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

console.log('Firebase Admin SDK inicializado com sucesso!');

// Indexação do Firebase Admin SDK e express

const app = express();
const db = admin.firestore();
const PORT = process.env.PORT || 3000;

// Configuração do middleware para CORS e Body Parser

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Endpoints para apostadores

app.get('/apostadores', async (req, res) => {
    try {
        const apostadoresSnapshot = await db.collection('apostadores').get();
        const apostadores = apostadoresSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(apostadores);
    } catch (error) {
        console.error('Erro ao buscar apostadores:', error);
        res.status(500).json({ error: 'Erro ao buscar apostadores' });
    }
});

app.post('/apostadores', async (req, res) => {
    try {
        const { nome, foto } = req.body;

        const resp = await db.collection(`apostadores`).add({
            nome,
            foto,
            pontuacao: 0,
            apostas: []
        });

        res.json({ id: resp.id, nome, foto, pontuacao: 0, apostas: [] });
    } catch (error) {
        console.error('Erro ao adicionar apostador:', error);
        res.status(500).json({ error: 'Erro ao adicionar apostador' });
    }
})

app.put('/apostadores/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, foto, pontuacao, apostas } = req.body;

        await db.collection('apostadores').doc(id).set({
            nome: nome,
            foto: foto,
            pontuacao: pontuacao,
            apostas: apostas
        });

        res.json({ id, nome, foto, pontuacao, apostas });
    } catch (error) {
        console.error('Erro ao atualizar apostador:', error);
        res.status(500).json({ error: 'Erro ao atualizar apostador' });
    }
});

app.delete('/apostadores/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection('apostadores').doc(id).delete();
        res.json({ message: 'Apostador deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar apostador:', error);
        res.status(500).json({ error: 'Erro ao deletar apostador' });
    }
});

// Endpoints para jogadores

app.get('/jogadores', async (req, res) => {
    try {
        const jogadoresSnapshot = await db.collection('jogadores').get();
        const jogadores = jogadoresSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(jogadores);
    } catch (error) {
        console.error('Erro ao buscar jogadores:', error);
        res.status(500).json({ error: 'Erro ao buscar jogadores' });
    }
});

app.post('/jogadores', async (req, res) => {
    try {
        const { nome, foto } = req.body;

        const resp = await db.collection(`jogadores`).add({
            nome,
            foto,
            vencidos: 0,
            perdidos: 0,
            empates: 0,
            nivel: 1
        });

        res.json({ id: resp.id, nome, foto, vencidos: 0, perdidos: 0, empates: 0, nivel: 1 });
    } catch (error) {
        console.error('Erro ao adicionar jogador:', error);
        res.status(500).json({ error: 'Erro ao adicionar jogador' });
    }
})

app.put('/jogadores/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, foto, vencidos, perdidos, empates, nivel } = req.body;

        await db.collection('jogadores').doc(id).set({
            nome: nome,
            foto: foto,
            vencidos: vencidos,
            perdidos: perdidos,
            empates: empates,
            nivel: nivel
        });

        res.json({ id, nome, foto, vencidos, perdidos, empates, nivel });
    } catch (error) {
        console.error('Erro ao atualizar jogador:', error);
        res.status(500).json({ error: 'Erro ao atualizar jogador' });
    }
});

app.delete('/jogadores/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection('jogadores').doc(id).delete();
        res.json({ message: 'Jogador deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar jogador:', error);
        res.status(500).json({ error: 'Erro ao deletar jogador' });
    }
});

// Endpoints para apostas

app.get('/apostas', async (req, res) => {
    try {
        const apostasSnapshot = await db.collection('apostas').get();
        const apostas = apostasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(apostas);
    } catch (error) {
        console.error('Erro ao buscar apostas:', error);
        res.status(500).json({ error: 'Erro ao buscar apostas' });
    }
});

app.post('/apostas', async (req, res) => {
    try {
        const { primeiroJogador, segundoJogador, validade } = req.body;

        const tabelaOdds = {
            0:  { v1: 3.0, v2: 3.0, emp: 4.0 },
            1:  { v1: 4.0, v2: 2.0, emp: 3.0 },
            2:  { v1: 5.0, v2: 1.5, emp: 4.0 },
            3:  { v1: 5.0, v2: 1.5, emp: 6.0 },
            4:  { v1: 6.0, v2: 1.3, emp: 7.0 }
        }

        switch (Math.abs(primeiroJogador.nivel - segundoJogador.nivel)) {
            case 0:
                oddVitoriaPrimeiro = tabelaOdds[0].v1;
                oddVitoriaSegundo = tabelaOdds[0].v2;
                oddEmpate = tabelaOdds[0].emp;
                break;
            case 1:
                oddVitoriaPrimeiro = tabelaOdds[1].v1;
                oddVitoriaSegundo = tabelaOdds[1].v2;
                oddEmpate = tabelaOdds[1].emp;
                break;
            case 2:
                oddVitoriaPrimeiro = tabelaOdds[2].v1;
                oddVitoriaSegundo = tabelaOdds[2].v2;
                oddEmpate = tabelaOdds[2].emp;
                break;
            case 3:
                oddVitoriaPrimeiro = tabelaOdds[3].v1;
                oddVitoriaSegundo = tabelaOdds[3].v2;
                oddEmpate = tabelaOdds[3].emp;
                break;
            case 4:
                oddVitoriaPrimeiro = tabelaOdds[4].v1;
                oddVitoriaSegundo = tabelaOdds[4].v2;
                oddEmpate = tabelaOdds[4].emp;
        }

        const resp = await db.collection(`apostas`).add({
            primeiroJogador,
            segundoJogador,
            oddVitoriaPrimeiro,
            oddVitoriaSegundo,
            oddEmpate,
            validade,
            resultado: null
        });
        res.json({ id: resp.id, primeiroJogador, segundoJogador, oddVitoriaPrimeiro, oddVitoriaSegundo, oddEmpate, validade, resultado: null });
    } catch (error) {
        console.error('Erro ao adicionar aposta:', error);
        res.status(500).json({ error: 'Erro ao adicionar aposta' });
    }
})

app.put('/apostas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { primeiroJogador, segundoJogador, oddVitoriaPrimeiro, oddVitoriaSegundo, oddEmpate, validade, resultado } = req.body;

        await db.collection('apostas').doc(id).set({
            primeiroJogador: primeiroJogador,
            segundoJogador: segundoJogador,
            oddVitoriaPrimeiro: oddVitoriaPrimeiro,
            oddVitoriaSegundo: oddVitoriaSegundo,
            oddEmpate: oddEmpate,
            validade: validade,
            resultado: resultado
        });

        res.json({ id, primeiroJogador, segundoJogador, oddVitoriaPrimeiro, oddVitoriaSegundo, oddEmpate, validade, resultado });
    } catch (error) {
        console.error('Erro ao atualizar aposta:', error);
        res.status(500).json({ error: 'Erro ao atualizar aposta' });
    }
});

app.delete('/apostas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection('apostas').doc(id).delete();
        res.json({ message: 'Aposta deletada com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar aposta:', error);
        res.status(500).json({ error: 'Erro ao deletar aposta' });
    }
});

// ------------------------------

// Início do servidor
app.listen(PORT, () => {
    console.log(`Server inicializado com sucesso na porta ${PORT}`);
});