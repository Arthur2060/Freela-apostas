const app = require('./app');

const PORT = process.env.PORT

app.listen(PORT, (req, res) => {
    console.log(`Servidor iniciado na porta ${PORT}`)
})