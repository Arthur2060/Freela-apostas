const { db } = require("../config/firebase.js");
const bcrypt = require('bcryptjs');

const ENTITY_NAME = "apostadores"

exports.get = async () => {
    const snapshot = await db.collection(ENTITY_NAME).get();

    const res = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))

    return res
}

exports.getById = async (id) => {
    try {
        const docRef = db.collection(ENTITY_NAME).doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            throw new Error("Entidade não encontrada!");
        }

        return {
            id: id,
            ...doc.data()
        };
    } catch (err) {
        throw new Error(err.message);
    }
}

exports.add = async (entity) => {
    try {
        const { senha, ...rest } = entity;

        const hashSenha = await bcrypt.hash(senha, 10)

        const newEntity = {
            ...rest,
            senha: hashSenha,
            pontuacao: 0,
        }

        const resp = await db.collection(ENTITY_NAME).add(newEntity);

        return {
            id: resp.id,
            ...newEntity
        };
    } catch (err) {
        throw new Error(err.message);
    }
}

exports.update = async (id, entity) => {
    try {
        const docRef = db.collection(ENTITY_NAME).doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            throw new Error("Entidade não encontrada!");
        }

        if (entity.senha) {
            entity.senha = await bcrypt.hash(entity.senha, 10);
        }

        await docRef.update(entity)

        return {
            id,
            ...entity
        };
    } catch (err) {
        throw new Error(err.message);
    }
}

exports.delete = async (id) => {
    try {
        const docRef = db.collection(ENTITY_NAME).doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            throw new Error("Entidade não encontrada!");
        }

        await docRef.delete();
        return { message: "apostador deletado com sucesso!" }
    } catch (err) {
        throw new Error(err.message);
    }
}