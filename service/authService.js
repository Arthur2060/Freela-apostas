const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { db } = require("../config/firebase");

const COLLECTION = "apostadores";
const JWT_SECRET = "SUA_CHAVE_SUPER_SECRETA"; // depois mova para .env

// ============================
// REGISTRAR NOVO APOSTADOR
// ============================
exports.register = async ({ nome, senha }) => {

    if (!nome || !senha) {
        throw new Error("Nome e senha são obrigatórios");
    }

    // Verifica se já existe
    const snapshot = await db
        .collection(COLLECTION)
        .where("nome", "==", nome)
        .get();

    if (!snapshot.empty) {
        throw new Error("Nome já cadastrado");
    }

    // Hash da senha
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

// ============================
// LOGIN
// ============================
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

    // Comparar senha
    const senhaValida = await bcrypt.compare(senha, user.senha);

    if (!senhaValida) {
        throw new Error("Credenciais inválidas");
    }

    // Gerar token
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
