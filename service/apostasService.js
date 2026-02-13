const { db } = require("../config/firebase.js");
const { calculate } = require("../utils/oddCalculator.js")

const ENTITY_NAME = "apostas"

exports.get = async () => {
    const snapshot = await db.collection(ENTITY_NAME).get();

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
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
    const { primeiroJogadorId, segundoJogadorId, ...rest } = entity;

    const [p1, p2] = await Promise.all(
        db.collection("jogadores").doc(primeiroJogadorId).get(),
        db.collection("jogadores").doc(segundoJogadorId).get()
    )

    if (!p1.exists || !p2.exists) {
        throw new Error("Jogadores não encontrados no sistema!");
    }

    const player1 = p1.data();
    const player2 = p2.data();

    const odds = calculate(player1.nivel, player2.nivel);

    const newEntity = {
        ...rest,
        primeiroJogadorId,
        segundoJogadorId,
        resultado: null,
        oddVitoriaPrimeiro: odds.v1,
        oddVitoriaSegundo: odds.v2,
        oddEmpate: odds.emp
    };


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

exports.encerrar = async (id, resultado) => {

    const apostaRef = db.collection("apostas").doc(id);

    await db.runTransaction(async (transaction) => {

        const apostaDoc = await transaction.get(apostaRef);

        if (!apostaDoc.exists) {
            throw new Error("Aposta não encontrada!");
        }

        if (apostaDoc.data().resultado !== null) {
            throw new Error("Aposta já encerrada!");
        }

        const apostaData = apostaDoc.data();

        let odd;

        switch (resultado) {
            case 0:
                odd = apostaData.oddVitoriaPrimeiro;
                break;
            case 1:
                odd = apostaData.oddEmpate;
                break;
            case 2:
                odd = apostaData.oddVitoriaSegundo;
                break;
            default:
                throw new Error("Resultado inválido");
        }

        const palpitesSnapshot = await db.collection("palpites")
            .where("apostaId", "==", id)
            .get();

        for (const palpiteDoc of palpitesSnapshot.docs) {

            const palpite = palpiteDoc.data();

            if (palpite.valor === resultado) {

                const apostadorRef = db.collection("apostadores")
                    .doc(palpite.apostadorId);

                const apostadorDoc = await transaction.get(apostadorRef);

                if (!apostadorDoc.exists) continue;

                const novaPontuacao =
                    (apostadorDoc.data().pontuacao || 0) + odd;

                transaction.update(apostadorRef, {
                    pontuacao: novaPontuacao
                });
            }
        }

        transaction.update(apostaRef, {
            resultado: resultado
        });

    });

    return { message: "Aposta encerrada com sucesso!" };
};

exports.delete = async (id) => {
    const docRef = db.collection(ENTITY_NAME).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
        throw new Error("Entidade não encontrada!");
    }

    await docRef.delete();
    return { message: "Aposta deletada com sucesso!" }
}