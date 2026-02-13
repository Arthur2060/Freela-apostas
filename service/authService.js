const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { db } = require("../config/firebase");

const COLLECTION = "apostadores";
const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async ({ nome, senha }) => {

    if (!nome || !senha) {
        throw new Error("Nome e senha são obrigatórios");
    }

    const snapshot = await db
        .collection(COLLECTION)
        .where("nome", "==", nome)
        .get();

    if (!snapshot.empty) {
        throw new Error("Nome já cadastrado");
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
};

exports.login = async ({ nome, senha }) => {

    if (!nome || !senha) {
        throw new Error("Nome e senha são obrigatórios");
    }

    const snapshot = await db
        .collection(COLLECTION)
        .where("nome", "==", nome)
        .get();

    if (snapshot.empty) {
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

    return {
        token,
        user: {
            id: doc.id,
            nome: user.nome,
            pontuacao: user.pontuacao
        }
    };
};
