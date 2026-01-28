const pool = require("../bdd");

/* =========================
   CREAR RESEÑA
========================= */
exports.crearResenia = async (req, res) => {
  const { id_superheroe, id_usuario, calificacion, comentario } = req.body;

  if (!id_superheroe || !calificacion || !comentario) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO resenias (id_usuario, id_superheroe, id_perro, calificacion, comentario)
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
};
