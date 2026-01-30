const pool = require("../bdd/bdd.js");
const express = require("express");
const router = express.Router();


/* =========================
   CREAR RESEÑA
========================= */
/*exports.crearResenia = async (req, res) => {
  const { id_usuario, id_superheroe, calificacion, comentario } = req.body;

  if (!id_superheroe || !calificacion || !comentario) {
    return res.status(400).json({ error: "Datos incompletos" });
  }


  const cal = Number(calificacion);
  if (!Number.isInteger(cal) || cal < 1 || cal > 5) {
    return res.status(400).json({ error: "calificacion debe ser un entero entre 1 y 5" });
  }

  const com = String(comentario).trim();
  if (com.length < 5) {
    return res.status(400).json({ error: "comentario muy corto (mínimo 5 caracteres)" });
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO resenias (id_usuario, id_superheroe, calificacion, comentario)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [id_usuario || null, id_superheroe , id_perro || null, calificacion, comentario]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error("ERROR CREAR RESEÑA:", err);
    res.status(500).json({ error: "Error al guardar la reseña" });
  }
};*/


// POST /api/resenias
exports.crearResenia = async (req, res) => {
  try {
    const { id_usuario, id_superheroe, calificacion, comentario } = req.body;

    if (!id_superheroe || !calificacion || !comentario) {
      return res.status(400).json({ error: "Faltan datos: id_superheroe, calificacion, comentario" });
    }

    const cal = Number(calificacion);
    if (!Number.isInteger(cal) || cal < 1 || cal > 5) {
      return res.status(400).json({ error: "calificacion debe ser un entero entre 1 y 5" });
    }

    const com = String(comentario).trim();
    if (com.length < 5) {
      return res.status(400).json({ error: "comentario muy corto (mínimo 5 caracteres)" });
    }

    // Guardar reseña
    const ins = await pool.query(
      `
      INSERT INTO resenas (id_superheroe, id_usuario, calificacion, comentario)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [Number(id_superheroe), id_usuario ? Number(id_usuario) : null, cal, com]
    );

    // Calcular promedio actualizado (para devolverlo al front)
    const avg = await pool.query(
      `
      SELECT
        ROUND(AVG(calificacion)::numeric, 2) AS promedio,
        COUNT(*)::int AS total
      FROM resenas
      WHERE id_superheroe = $1
      `,
      [Number(id_superheroe)]
    );

    return res.status(201).json({
      resenia: ins.rows[0],
      calificacion: avg.rows[0] // { promedio, total }
    });
  } catch (err) {
    console.error("ERROR crearResenia:", err);
    return res.status(500).json({ error: "Error al guardar la reseña" });
  }
};

// GET /api/resenas/promedio/:id_superheroe
exports.obtenerPromedio = async (req, res) => {
  try {
    const { id_superheroe } = req.params;

    const r = await pool.query(
      `
      SELECT
        ROUND(AVG(calificacion)::numeric, 2) AS promedio,
        COUNT(*)::int AS total
      FROM resenas
      WHERE id_superheroe = $1
      `,
      [Number(id_superheroe)]
    );

    return res.json(r.rows[0]); // { promedio, total }
  } catch (err) {
    console.error("ERROR obtenerPromedio:", err);
    return res.status(500).json({ error: "Error al obtener promedio" });
  }
};



