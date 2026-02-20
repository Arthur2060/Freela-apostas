const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { db, admin } = require("../config/firebase");

const COLLECTION = "apostadores";
const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async ({ nome, senha }) => {
    try {
        if (!nome || !senha) {
            throw new Error("Nome e senha são obrigatórios");
        }

        const snapshot = await db.collection(COLLECTION)
            .where("nome", "=", nome)
            .limit(1)
            .get();

        if (!snapshot.empty) {
            throw new Error("Usuário já cadastrado!")
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const newUser = {
            nome,
            senha: senhaHash,
            pontuacao: 0,
            createdAt: new Date()
        };

        const resp = await db.collection(COLLECTION).add(newUser);

        return {
            id: resp.id,
            nome,
            pontuacao: 0
        };
    } catch (err) {
        throw new Error(err.message);
    }
};

exports.login = async ({ nome, senha }) => {
    try {
        if (!nome || !senha) {
            throw new Error("Nome e senha são obrigatórios");
        }

        const snapshot = await db
            .collection(COLLECTION)
            .where("nome", "==", nome)
            .limit(1)
            .get();

        if (snapshot.empty || !snapshot) {
            throw new Error("Credenciais inválidas");
        }

        const doc = snapshot.docs[0];

        const user = doc.data();

        const senhaValida = await bcrypt.compare(senha, user.senha);

        if (!senhaValida) {
            throw new Error("Credenciais inválidas");
        }

        const token = jwt.sign(
            {
                id: doc.id,
                nome: user.nome
            },
            JWT_SECRET,
            { expiresIn: "2h" }
        );

        const data = 
        {
            token: token,
            user: {
                id: doc.id,
                nome: user.nome,
                admin: user.nome == "admin",
                pontuacao: user.pontuacao
            }
        }

        return data;
    } catch (err) {
        throw new Error(err.message)
    }
};