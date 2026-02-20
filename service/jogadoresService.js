const { db } = require("../config/firebase.js");

const ENTITY_NAME = "jogador"

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
        const newEntity = {
            ...entity,
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
        return { message: "jogador deletado com sucesso!" }
    } catch (err) {
        throw new Error(err.message);
    }
}