const { db } = require("../config/firebase.js");
const { calculate } = require("../utils/oddCalculator.js")

const ENTITY_NAME = "apostas"

exports.get = async () => {

    const snapshot = await db.collection("apostas").get();

    const res = [];

    for (const doc of snapshot.docs) {

        const data = doc.data();

        const p1 = await db.collection("jogadores")
            .doc(data.primeiroJogadorId)
            .get();

        const p2 = await db.collection("jogadores")
            .doc(data.segundoJogadorId)
            .get();

        res.push({
            id: doc.id,
            ...data,
            primeiroJogadorNome: p1.exists ? p1.data().nome : "Desconhecido",
            segundoJogadorNome: p2.exists ? p2.data().nome : "Desconhecido"
        });
    }

    return res;
};


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
        const { primeiroJogadorId, segundoJogadorId, ...rest } = entity;

        if (!primeiroJogadorId || !segundoJogadorId) {
            throw new Error("Jogadores são obrigatórios");
        }

        if (primeiroJogadorId === segundoJogadorId) {
            throw new Error("Jogadores não podem ser iguais");
        }

        const [p1, p2] = await Promise.all([
            db.collection("jogador").doc(primeiroJogadorId).get(),
            db.collection("jogador").doc(segundoJogadorId).get()
        ]);

        if (!p1.exists || !p2.exists) {
            throw new Error("Jogadores não encontrados!");
        }

        const odds = calculate(Number(p1.data().nivel), Number(p2.data().nivel));

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
    } catch (err) {
        throw new Error(err.message);
    }
};

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

exports.encerrar = async (id, resultado) => {
    try {
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

            switch (Number(resultado)) {
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

                if (palpite.valor === Number(resultado)) {

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
    } catch (err) {
        throw new Error(err.message);
    }
};

exports.delete = async (id) => {
    try {
        const docRef = db.collection(ENTITY_NAME).doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            throw new Error("Entidade não encontrada!");
        }

        await docRef.delete();
        return { message: "Aposta deletada com sucesso!" }
    } catch (err) {
        throw new Error(err.message);
    }
}