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
    const docRef = db.collection(ENTITY_NAME).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
        throw new Error("Entidade não encontrada!");
    }

    return {
        id: id,
        ...doc.data()
    };
}

exports.add = async (entity) => {

    const newEntity = {
        ...entity,
    }

    const resp = await db.collection(ENTITY_NAME).add(newEntity);

    return {
        id: resp.id,
        ...newEntity
    };
}

exports.update = async (id, entity) => {
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
}

exports.delete = async (id) => {
    const docRef = db.collection(ENTITY_NAME).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
        throw new Error("Entidade não encontrada!");
    }

    await docRef.delete();
    return { message: "jogador deletado com sucesso!" }
}