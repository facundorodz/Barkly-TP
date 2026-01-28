const express = require("express");
const router = express.Router();
const { crearResenia } = require("../controllers/resenias.controller");

// POST /api/resenias
router.post("/", crearResenia);

module.exports = router;