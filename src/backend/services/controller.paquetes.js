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

    // Primero obtener id_cuidador del paquete
    const paquete = await pool.query(
      "SELECT id_superheroe FROM paquetes WHERE id = $1",
      [id]
    );

    if (paquete.rows.length === 0) {
      return res.status(404).json({ error: "Paquete no encontrado" });
    }

    const id_superheroe = paquete.rows[0].id_superheroe;

    // Eliminar el paquete
    await pool.query("DELETE FROM paquetes WHERE id = $1", [id]);

    // 🔥 RESTAR 1 A paquetes_ofrecidos
    await restarPaquete(id_superheroe);

    res.json({ mensaje: "Paquete eliminado" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar paquete" });
  }
};

// ===============================
// SUMAR 1 A paquetes_ofrecidos
// ===============================
async function sumarPaquete(id_superheroe) {
  await pool.query(
    `UPDATE superheroes
     SET paquetes_ofrecidos = paquetes_ofrecidos + 1
     WHERE id = $1`,
    [id_superheroe]
  );
}

// ===============================
// RESTAR 1 A paquetes_ofrecidos
// ===============================
async function restarPaquete(id_superheroe) {
  await pool.query(
    `UPDATE superheroes
     SET paquetes_ofrecidos = paquetes_ofrecidos - 1
     WHERE id = $1`,
    [id_superheroe]
  );
}
