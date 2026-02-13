const express = require("express");
const controller = require("../controllers/authController.js")

const routes = express.Router();

routes.post("/login", controller.login);
routes.post("/register", controller.register);

module.exports = routes;