const { initializeApp } = require('firebase-admin');

const firebase_cert = require("/etc/secrets/firebase-admin.json") // Lembrar de adicionar json ao voltar para casa

initializeApp({
    credential: admin.credential.cert(firebase_cert),
});

const db = admin.firestore();

module.exports = { db, admin };