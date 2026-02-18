const express = require('express');

const path = require("path")

require('dotenv').config({ path: path.join(__dirname, '.env') });

const cors = require('cors');

const palpitesRoutes = require("../routes/palpitesRoutes")
const apostadoresRoutes = require("../routes/apostadoresRoutes")
const jogadoresRoutes = require("../routes/jogadoresRoutes")
const apostasRoutes = require("../routes/apostasRoutes")
const authRoutes = require("../routes/authRoutes")

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(process.cwd(), "public")));

app.use("/palpites", palpitesRoutes)
app.use("/apostadores", apostadoresRoutes)
app.use("/jogadores", jogadoresRoutes)
app.use("/apostas", apostasRoutes)
app.use("/auth", authRoutes)

module.exports = app;