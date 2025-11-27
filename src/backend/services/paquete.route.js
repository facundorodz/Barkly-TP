const express = require("express");
const router = express.Router();
const { registrarPaquete, obtenerPaquetes } = require("../services/controller.paquetes.js");

router.post("/register_paquetes", registrarPaquete);

//Muestra la informacion con la estructuta JSON para probar en el navegador
router.get("/paquetes", obtenerPaquetes);

module.exports = router;
