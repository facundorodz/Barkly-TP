const express = require("express");
const router = express.Router();
const controlador = require("../services/controller.cuidadores.js");
const paquete = require("../services/controller.paquetes.js");

console.log("obtenerPaquetesPorCuidador:", typeof paquete.obtenerPaquetesPorCuidador);
console.log("crearPaquete:", typeof paquete.crearPaquete);
console.log("obtenerPaquetePorCuidador:", typeof paquete.obtenerPaquetePorCuidador);
console.log("editarPaquetePorCuidador:", typeof paquete.editarPaquetePorCuidador);
console.log("eliminarPaquetePorCuidador:", typeof paquete.eliminarPaquetePorCuidador);


// CRUD CUIDADORES
router.get("/cuidadores", controlador.obtenerCuidadores);
router.get("/cuidadores/:id", controlador.obtenerCuidadorPorID);
router.put("/cuidadores/:id", controlador.editarCuidador);
router.delete("/cuidadores/session", controlador.eliminarCuidador);



// PAQUETES CRUD 
/*router.get("/cuidadores/:id/paquetes/", paquete.obtenerPaquetesPorCuidador);
router.post("/cuidadores/:id/paquetes", paquete.crearPaquete);*/

router.get("/cuidadores/:id/paquetes", paquete.obtenerPaquetesPorCuidador);
router.post("/cuidadores/:id/paquetes", paquete.crearPaquete);
router.get("/cuidadores/:id/paquetes/:paqueteId", paquete.obtenerPaquetePorCuidador);
router.put("/cuidadores/:id/paquetes/:paqueteId", paquete.editarPaquetePorCuidador);
//router.put("paquetes/:id", paquete.editarPaquetePorCuidador);
router.delete("/cuidadores/:id/paquetes/:paqueteId", paquete.eliminarPaquetePorCuidador);


module.exports = router;


