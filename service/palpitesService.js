const { db } = require("../config/firebase.js");

const ENTITY_NAME = "palpites";

exports.get = async () => {
    const snapshot = await db.collection(ENTITY_NAME).get();

    const res = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    return res
};

exports.getById = async (id) => {
    const doc = await db.collection(ENTITY_NAME).doc(id).get();

    if (!doc.exists) {
        throw new Error("Palpite não encontrado!");
    }

    return {
        id: doc.id,
        ...doc.data()
    };
};

exports.add = async ({ apostaId, apostadorId, valor }) => {

    const apostaRef = db.collection("apostas").doc(apostaId);
    const apostadorRef = db.collection("apostadores").doc(apostadorId);

    const [aposta, apostador] = await Promise.all([
        apostaRef.get(),
        apostadorRef.get()
    ]);

    if (!aposta.exists) {
        throw new Error("Aposta não encontrada!");
    }

    if (!apostador.exists) {
        throw new Error("Apostador não encontrado!");
    }

    if (aposta.data().resultado !== null) {
        throw new Error("Aposta já encerrada!");
    }

    const newEntity = {
        apostaId,
        apostadorId,
        valor,
        createdAt: new Date()
    };

    const resp = await db.collection(ENTITY_NAME).add(newEntity);

    return {
        id: resp.id,
        ...newEntity
    };
};

exports.update = async (id, entity) => {
    const docRef = db.collection(ENTITY_NAME).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
        throw new Error("Palpite não encontrado!");
    }

    await docRef.update(entity);

    return {
        id,
        ...entity
    };
};

exports.delete = async (id) => {
    const docRef = db.collection(ENTITY_NAME).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
        throw new Error("Palpite não encontrado!");
    }

    await docRef.delete();

    return { message: "Palpite deletado com sucesso!" };
};
