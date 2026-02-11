// Declaração das dependências e configuração do servidor Express, CORS, Firebase Admin SDK e Body Parser.

const express = require('express');
const cors = require('cors');
const firebase = require('firebase-admin');
const bodyParser = require('body-parser');

// Chave do Firebase Admin SDK

const serviceAccount = require('./freela-apostas-firebase-adminsdk-fbsvc-89af620e4c.json');

// Indexação do Firebase Admin SDK e express

const app = express();
const db = firebase.firestore();
const PORT = process.env.PORT || 3000;

// Configuração do middleware para CORS e Body Parser

app.use(cors());
app.use(bodyParser.json());

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

// ------------------------------

// Inicialização do Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
} );
console.log('Firebase Admin SDK inicializado com sucesso!');

// Início do servidor
app.listen(PORT, () => {
    console.log(`Server inicializado com sucesso na porta ${PORT}`);
});