const express = require("express");
const router = express.Router();
const { crearResenia, obtenerPromedio } = require("../services/controller.resenias.js");

// guardar reseña
router.post("/", crearResenia);

// obtener promedio de un cuidador
router.get("/promedio/:id_superheroe", obtenerPromedio);

module.exports = router;
