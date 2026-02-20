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
    try {
        const doc = await db.collection(ENTITY_NAME).doc(id).get();

        if (!doc.exists) {
            throw new Error("Palpite não encontrado!");
        }

        return {
            id: doc.id,
            ...doc.data()
        };
    } catch (err) {
        throw new Error(err.message)
    }
};

exports.add = async ({ apostaId, apostadorId, valor }) => {
    try {
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
        }
    } catch (err) {
        throw new Error(err.message)
    }
};

exports.update = async (id, entity) => {
    try {
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
    } catch (err) {
        throw new Error(err.message)
    }
};

exports.delete = async (id) => {
    try {
        const docRef = db.collection(ENTITY_NAME).doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            throw new Error("Palpite não encontrado!");
        }

        await docRef.delete();

        return { message: "Palpite deletado com sucesso!" };
    } catch (err) {
        throw new Error(err.message)
    }
};
