const express = require("express");
const router = express.Router();
const controlador = require("../services/controller.cuidadores.js");

// CRUD CUIDADORES
router.get("/cuidadores", controlador.obtenerCuidadores);
router.get("/cuidadores/:id", controlador.obtenerCuidadorPorID);
router.put("/cuidadores/:id", controlador.editarCuidador);
router.delete("/cuidadores/:id", controlador.eliminarCuidador);


module.exports = router;
