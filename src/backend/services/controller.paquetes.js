const pool = require("../bdd/bdd.js");  // Ajustá la ruta según tu estructura

// ==============================================
//   REGISTRAR SOLO PAQUETES COMO PEDISTE
// ==============================================
exports.registrarPaquete = async (req, res) => {
  const client = await pool.connect();

  try {
    const { paquetes } = req.body;

    if (!Array.isArray(paquetes)) {
      return res.status(400).json({ error: "Debe enviar una lista de paquetes" });
    }

    await client.query("BEGIN");

    for (const p of paquetes) {
      await client.query(
        `INSERT INTO paquetes (nombre_paquete, descripcion, precio)
         VALUES ($1, $2, $3) RETURNING *;`,
        [p.nombre, p.descripcion, p.precio]
      );
    }

    await client.query("COMMIT");

    res.json({ mensaje: "Paquetes registrados correctamente" });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error:", err);
    res.status(500).json({ error: "Error al registrar los paquetes" });

  } finally {
    client.release();
  }
};


exports.obtenerPaquetes = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM paquetes ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener paquetes:", err);
    res.status(500).json({ error: "Error al obtener paquetes" });
  }
};
