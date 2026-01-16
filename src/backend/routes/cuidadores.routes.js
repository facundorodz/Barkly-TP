const express = require("express");
const router = express.Router();
const controlador = require("../services/controller.cuidadores.js");
const paquete = require("../services/controller.paquetes.js");

// CRUD CUIDADORES
router.get("/cuidadores", controlador.obtenerCuidadores);
router.get("/cuidadores/:id", controlador.obtenerCuidadorPorID);
router.put("/cuidadores/:id", controlador.editarCuidador);
router.delete("/cuidadores/session", controlador.eliminarCuidador);



// PAQUETES CRUD 
router.get("/cuidadores/:id/paquetes", paquete.obtenerPaquetesPorCuidador);
router.post("/cuidadores/:id/paquetes", paquete.crearPaquete);
router.put("/cuidadores/:id/paquetes/:paqueteId", paquete.editarPaquete);
router.delete("/cuidadores/:id/paquetes/:paqueteId", paquete.eliminarPaquete);

module.exports = router;


