const express = require("express");
const router = express.Router();
const controlador = require("../services/controller.cuidadores.js");
const paquete = require("../services/controller.paquetes.js");

// CRUD CUIDADORES
router.get("/registro_superheroe", controlador.obtenerCuidadores);
router.get("/registro_superheroe/:id", controlador.obtenerCuidadorPorID);
router.put("/registro_superheroe/:id", controlador.editarCuidador);
router.delete("/registro_superheroe/:id", controlador.eliminarCuidador);


// PAQUETES CRUD 
router.get("/registro_superheroe/:id/paquetes", paquete.obtenerPaquetesPorCuidador);
router.put("/paquetes/:id", paquete.editarPaquete);
router.delete("/paquetes/:id", paquete.eliminarPaquete);

module.exports = router;
