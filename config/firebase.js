const admin = require('firebase-admin');
const serviceAccount = require('../freela-apostas-firebase-adminsdk-fbsvc-89af620e4c.json');

// Inicialização do Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = { admin, db };