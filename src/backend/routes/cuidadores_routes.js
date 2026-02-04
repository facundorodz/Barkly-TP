const express = require("express");
const router = express.Router();
const controlador = require("../services/controller.cuidadores.js");
const paquete = require("../services/controller.paquetes.js");

// CRUD CUIDADORES
router.get("/", controlador.obtenerCuidadores);
router.get("/cuidadores/:id", controlador.obtenerCuidadorPorID);
router.put("/cuidadores/:id", controlador.editarCuidador);
router.delete("/cuidadores/session", controlador.eliminarCuidador);



// PAQUETES CRUD 
router.get("/cuidadores/:id/paquetes", paquete.obtenerPaquetesPorCuidador);
router.post("/cuidadores/:id/paquetes", paquete.crearPaquete);
router.put("/paquetes/:id", paquete.editarPaquete);
router.delete("/paquetes/:id", paquete.eliminarPaquete);

module.exports = router;


