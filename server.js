const app = require('./app');

app.get("/test", (req, res) => {
    res.json({ message: "Servidor rodando na Vercel!" })
})

