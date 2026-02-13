const express = require("express");
const controller = require("../controllers/jogadoresController.js")

const routes = express.Router();

routes.get("/", controller.get);
routes.get("/:id", controller.getById);
routes.post("/", controller.add);
routes.put("/:id", controller.update);
routes.delete("/:id", controller.delete);

module.exports = routes;