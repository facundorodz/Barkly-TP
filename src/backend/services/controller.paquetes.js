const pool = require("../bdd/bdd.js");

// Obtener paquetes por cuidador
exports.obtenerPaquetesPorCuidador = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM paquetes WHERE id_superheroe= $1 ORDER BY id DESC",
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener paquetes" });
  }
};

// Editar paquete
exports.editarPaquete = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_paquete, descripcion, precio } = req.body;

    const result = await pool.query(
      `UPDATE paquetes SET nombre_paquete=$1, descripcion=$2, precio=$3
       WHERE id=$4 RETURNING *`,
      [nombre_paquete, descripcion, precio, id]
    );

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).json({ error: "Error al editar paquete" });
  }
};

// Eliminar paquete
exports.eliminarPaquete = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM paquetes WHERE id=$1", [id]);
    res.json({ mensaje: "Paquete eliminado" });

  } catch (err) {
    res.status(500).json({ error: "Error al eliminar paquete" });
  }
};
