// Declaração das dependências e configuração do servidor Express, CORS, Firebase Admin SDK e Body Parser.

const jwt = require('jsonwebtoken');
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

app.get('/apostadores/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const apostador = (await db.collection('apostadores').doc(id).get());

        res.json(apostador.data());
    } catch (error) {
        console.error('Erro ao buscar apostadores:', error);
        res.status(500).json({ error: 'Erro ao buscar apostadores' });
    }
});

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
        const { nome, senha, foto } = req.body;

        const senhaHash = await bcrypt.hash(senha, 10);

        const resp = await db.collection('apostadores').add({
            nome,
            senha: senhaHash,
            foto,
            pontuacao: 0,
            palpites: []
        });

        res.status(201).json({
            id: resp.id,
            nome,
            foto,
            pontuacao: 0,
            palpites: []
        });

    } catch (error) {
        console.error('Erro ao adicionar apostador:', error);
        res.status(500).json({ error: 'Erro ao adicionar apostador' });
    }
});


app.put('/apostadores/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, senha, foto, pontuacao, palpites } = req.body;

        await db.collection('apostadores').doc(id).set({
            nome: nome,
            senha: senha,
            foto: foto,
            pontuacao: pontuacao,
            palpites: palpites
        });

        res.json({ id, nome, senha, foto, pontuacao, palpites });
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
app.get('/jogadores/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const doc = (await db.collection('jogadores').doc(id).get());

        res.json({
            id: doc.id,
            ...doc.data()
        });
    } catch (error) {
        console.error('Erro ao buscar jogadores:', error);
        res.status(500).json({ error: 'Erro ao buscar jogadores' });
    }
});

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
        const { nome, nivel } = req.body;

        const resp = await db.collection(`jogadores`).add({
            nome,
            foto: null,
            vencidos: 0,
            perdidos: 0,
            empates: 0,
            nivel: nivel
        });

        res.json({ id: resp.id, nome, foto: null, vencidos: 0, perdidos: 0, empates: 0, nivel: nivel });
    } catch (error) {
        console.error('Erro ao adicionar jogador:', error);
        res.status(500).json({ error: 'Erro ao adicionar jogador' });
    }
})

app.put('/jogadores/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, nivel } = req.body;

        await db.collection('jogadores').doc(id).update({
            nome: nome,
            nivel: nivel
        });

        res.json({ id, nome, nivel });
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
        const apostas = [];

        for (const doc of apostasSnapshot.docs) {
            const apostaData = doc.data();
            const p1 = await db.collection('jogadores').doc(apostaData.primeiroJogador).get();
            const p2 = await db.collection('jogadores').doc(apostaData.segundoJogador).get();

            apostas.push({
                id: doc.id,
                ...apostaData,
                primeiroJogadorId: apostaData.primeiroJogador,
                segundoJogadorId: apostaData.segundoJogador,
                primeiroJogador: p1.data(),
                segundoJogador: p2.data()
            });
        }
        res.json(apostas);
    } catch (error) {
        console.error('Erro ao buscar apostas:', error);
        res.status(500).json({ error: 'Erro ao buscar apostas' });
    }
});

app.post('/apostas', async (req, res) => {
    try {
        const { primeiroJogador, segundoJogador, validade } = req.body;

        const primeiroJogadorDoc = await db.collection('jogadores').doc(primeiroJogador).get();
        const segundoJogadorDoc = await db.collection('jogadores').doc(segundoJogador).get();

        const tabelaOdds = {
            0: { v1: 3.0, v2: 3.0, emp: 4.0 },
            1: { v1: 4.0, v2: 2.0, emp: 3.0 },
            2: { v1: 5.0, v2: 1.5, emp: 4.0 },
            3: { v1: 5.0, v2: 1.5, emp: 6.0 },
            4: { v1: 6.0, v2: 1.3, emp: 7.0 }
        }

        switch (Math.abs(primeiroJogadorDoc.data().nivel - segundoJogadorDoc.data().nivel)) {
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
            primeiroJogador: primeiroJogador,
            segundoJogador: segundoJogador,
            oddVitoriaPrimeiro: oddVitoriaPrimeiro,
            oddVitoriaSegundo: oddVitoriaSegundo,
            oddEmpate: oddEmpate,
            validade: validade,
            palpites: [],
            resultado: null
        });
        res.json({
            id: resp.id,
            primeiroJogador: primeiroJogador,
            segundoJogador: segundoJogador,
            oddVitoriaPrimeiro: oddVitoriaPrimeiro,
            oddVitoriaSegundo: oddVitoriaSegundo,
            oddEmpate: oddEmpate,
            validade: validade,
            resultado: null
        }
        );
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

// Endpoints de palpites

app.post('/palpites/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { valor } = req.body;

        const apostaRef = db.collection('apostas').doc(id);
        const apostaDoc = await apostaRef.get();

        if (!apostaDoc.exists) {
            return res.status(404).json({ error: 'Aposta não encontrada' });
        }

        await apostaRef.update({
            palpites: admin.firestore.FieldValue.arrayUnion({
                valor,
                apostador: req.user.id
            })
        });

        res.json({ message: "Palpite registrado com sucesso" });

    } catch (error) {
        console.error('Erro ao registrar palpite:', error);
        res.status(500).json({ error: 'Erro ao registrar palpite' });
    }
});

// Area de login

app.post('/login', async (req, res) => {
    try {
        const { nome, senha } = req.body;

        const snapshot = await db.collection('apostadores')
            .where('nome', '==', nome)
            .get();

        if (snapshot.empty) {
            return res.status(400).json({ error: "Usuário não encontrado" });
        }

        const userDoc = snapshot.docs[0];
        const user = userDoc.data();

        const senhaValida = await bcrypt.compare(senha, user.senha);

        if (!senhaValida) {
            return res.status(400).json({ error: "Senha inválida" });
        }

        const token = jwt.sign(
            { id: userDoc.id, nome: user.nome },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token });

    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
});

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: "Token não fornecido" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ error: "Token inválido" });
    }
};



// Início do servidor
app.listen(PORT, () => {
    console.log(`Server inicializado com sucesso na porta ${PORT}`);
});