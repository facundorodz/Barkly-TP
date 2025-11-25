const express = require("express");
const router = express.Router();
const { registrarPaquete, obtenerPaquetes } = require("../services/controller.paquetes.js");

router.post("/register_paquetes", registrarPaquete);


router.get("/register_paquetes", (req, res) => {
  res.send("Ruta funcionando. Solo POST guarda paquetes.");
});

router.get("/paquetes", obtenerPaquetes);

module.exports = router;
