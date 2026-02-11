const express = require("express");
const router = express.Router();

const controlador = require("../services/controller.cuidadores.js");
const paquete = require("../services/controller.paquetes.js");

router.get("/", controlador.obtenerCuidadores);
router.get("/:id", controlador.obtenerCuidadorPorID);
router.put("/:id", controlador.editarCuidador);
router.delete("/session", controlador.eliminarCuidador);

router.get("/:id/paquetes", paquete.obtenerPaquetesPorCuidador);
router.post("/:id/paquetes", paquete.crearPaquete);
router.put("/:id/paquetes/:paqueteId", paquete.editarPaquetePorCuidador);
router.delete("/:id/paquetes/:paqueteId", paquete.eliminarPaquetePorCuidador);

module.exports = router;




