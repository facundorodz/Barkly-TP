//Artchivo donde obtiene el JSON de todos los cuidadores registrados

const express = require("express");
const router = express.Router();
const db = require("../bdd/bdd"); // conexión a PostgreSQL

// ===============================
// OBTENER TODOS LOS CUIDADORES
// ===============================
/*
router.get("/", async (req, res) => {
  try {
    const result = await db.query(`SELECT id, nombre, franquicia, experiencia, poderes, foto_perfil FROM superheroes ORDER BY id ASC
    `);

    res.status(200).json(result.rows);

  } catch (error) {
    console.error("Error al obtener cuidadores:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener cuidadores"
    });
  }
});
*/

// ===============================
// OBTENER UN CUIDADOR POR ID
// (para el botón "Ver más")
// ===============================
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `SELECT * FROM superheroes WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cuidador no encontrado"
      });
    }

    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error("Error al obtener cuidador:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener cuidador"
    });
  }
});

module.exports = router;
