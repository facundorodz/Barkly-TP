const pool = require("../bdd/bdd.js");
// ==============================================
//   REGISTRAR SOLO PAQUETES COMO PEDISTE
// ==============================================

exports.registrarPaquete = async (req, res) => {
  const client = await pool.connect();

  try {
    const { paquetes } = req.body;

    // Validación: debe haber al menos 1 paquete con datos
    const paquetesValidos = paquetes.filter(p => p.nombre?.trim() && p.descripcion?.trim() && p.precio?.toString().trim());

    if (paquetesValidos.length === 0) {
      return res.status(400).json({
        error: "Debe completar al menos un paquete."
      });
    }

    await client.query("BEGIN");

    for (const p of paquetesValidos) {
      await client.query(
        `INSERT INTO paquetes (nombre_paquete, descripcion, precio)
         VALUES ($1, $2, $3) RETURNING *`,
        [p.nombre, p.descripcion, p.precio]
      );
    }

    await client.query("COMMIT");

    res.json({
      mensaje: `Se registraron ${paquetesValidos.length} paquete(s) correctamente`
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error al guardar paquetes:", err);
    res.status(500).json({ error: "Error en servidor al guardar paquetes" });

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
