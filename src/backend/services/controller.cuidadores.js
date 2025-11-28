const pool = require("../bdd/bdd.js");


// Obtener todos
exports.obtenerCuidadores = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM superheroes ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener cuidadores" });
  }
};

// Obtener uno por ID
exports.obtenerCuidadorPorID = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM superheroes WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Cuidador no encontrado" });

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).json({ error: "Error al obtener cuidador por ID" });
  }
};

// Editar cuidador
exports.editarCuidador = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, franquicia, experiencia, poderes } = req.body;

    const result = await pool.query(
      `UPDATE superheroes
       SET nombre = $1, franquicia = $2, experiencia = $3, poderes = $4
       WHERE id = $5 RETURNING *`,
      [nombre, franquicia, experiencia, poderes, id]
    );

    res.json({ mensaje: "Actualizado correctamente", cuidador: result.rows[0] });

  } catch (err) {
    res.status(500).json({ error: "Error al editar cuidador" });
  }
};

// Eliminar cuidador
exports.eliminarCuidador = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM superheroes WHERE id = $1",
      [id]
    );

    res.json({ mensaje: "Cuidador eliminado" });

  } catch (err) {
    res.status(500).json({ error: "Error al eliminar cuidador" });
  }
};
