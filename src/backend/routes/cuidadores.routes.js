const express = require("express");
const router = express.Router();
const controlador = require("../services/controller.cuidadores.js");

// CRUD CUIDADORES
router.post("/cuidadores", controlador.crearCuidador);
router.get("/cuidadores", controlador.obtenerCuidadores);
router.get("/cuidadores/:id", controlador.obtenerCuidadorPorID);
router.put("/cuidadores/:id", controlador.editarCuidador);
router.delete("/cuidadores/:id", controlador.eliminarCuidador);

// CRUD PAQUETES
router.post("/cuidadores/:id/paquetes", controlador.registrarPaquete);
router.put("/paquetes/:id_paquete", controlador.editarPaquete);
router.delete("/paquetes/:id_paquete", controlador.eliminarPaquete);

module.exports = router;
