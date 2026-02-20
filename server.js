const app = require('./app');
const { db, admin } = require("./config/firebase")

const PORT = process.env.PORT

app.get("/teste-firestore", async (req, res) => {
    try {
        const doc = await db.collection("teste").add({
            funcionando: true,
            data: new Date()
        });

        res.json({ id: doc.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, (req, res) => {
    console.log(`Servidor iniciado na porta ${PORT}`)
})