
const pool = require("../bdd/bdd");

exports.obtenerPaquetesPorCuidador = async (req, res) => {
  try {
    const cuidadorId = Number(req.params.id);
    if (!cuidadorId) return res.status(400).json({ error: "ID cuidador inválido" });

    const result = await pool.query(
      "SELECT id, id_superheroe, nombre_paquete, descripcion, precio FROM paquetes WHERE id_superheroe = $1 ORDER BY id DESC",
      [cuidadorId]
    );

    return res.json(result.rows);
  } catch (err) {
    console.error("obtenerPaquetesPorCuidador:", err);
    return res.status(500).json({ error: "Error al obtener paquetes" });
  }
};

// ===============================
// GET /cuidadores/:id/paquetes/:paqueteId
// ===============================
exports.obtenerPaquetePorCuidador = async (req, res) => {
  try {
    const cuidadorId = Number(req.params.id);
    const paqueteId = Number(req.params.paqueteId);

    if (!cuidadorId || !paqueteId) {
      return res.status(400).json({ error: "IDs inválidos" });
    }

    const result = await pool.query(
      `SELECT id, id_superheroe, nombre_paquete, descripcion, precio
       FROM paquetes
       WHERE id_superheroe = $1 AND id = $2`,
      [cuidadorId, paqueteId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Paquete no encontrado" });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error("obtenerPaquetePorCuidador:", err);
    return res.status(500).json({ error: "Error al obtener paquete" });
  }
};

// ===============================
// POST /cuidadores/:id/paquetes
// body: { nombre_paquete, descripcion, precio }
// ===============================
exports.crearPaquete = async (req, res) => {
  try {
    const cuidadorId = Number(req.params.id);
    const { nombre_paquete, descripcion, precio } = req.body;

    if (!cuidadorId) return res.status(400).json({ error: "ID cuidador inválido" });
    if (!nombre_paquete || !descripcion || precio == null) {
      return res.status(400).json({ error: "Faltan campos" });
    }

    const precioNum = Number(precio);
    if (!Number.isFinite(precioNum) || precioNum <= 0) {
      return res.status(400).json({ error: "Precio inválido" });
    }

    const result = await pool.query(
      `INSERT INTO paquetes (id_superheroe, nombre_paquete, descripcion, precio, cupos_disponibles)
       VALUES ($1, $2, $3, $4,10)
       RETURNING id, id_superheroe, nombre_paquete, descripcion, precio`,
      [cuidadorId, nombre_paquete, descripcion, precioNum]
    );

    // opcional: mantener contador
    await pool.query(
      `UPDATE superheroes
       SET paquetes_ofrecidos = COALESCE(paquetes_ofrecidos, 0) + 1
       WHERE id = $1`,
      [cuidadorId]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("crearPaquete:", err);
    return res.status(500).json({ error: "Error al crear paquete" });
  }
};

// ===============================
// PUT /cuidadores/:id/paquetes/:paqueteId
// body: { nombre_paquete, descripcion, precio }
// ===============================
exports.editarPaquetePorCuidador = async (req, res) => {
  try {
    const cuidadorId = Number(req.params.id);
    const paqueteId = Number(req.params.paqueteId);
    const { nombre_paquete, descripcion, precio } = req.body;

    if (!cuidadorId || !paqueteId) {
      return res.status(400).json({ error: "IDs inválidos" });
    }

    const precioNum = Number(precio);
    if (!nombre_paquete || !descripcion || !Number.isFinite(precioNum) || precioNum <= 0) {
      return res.status(400).json({ error: "Datos inválidos" });
    }

    const result = await pool.query(
      `UPDATE paquetes
       SET nombre_paquete = $1, descripcion = $2, precio = $3
       WHERE id_superheroe = $4 AND id = $5
       RETURNING id, id_superheroe, nombre_paquete, descripcion, precio`,
      [nombre_paquete, descripcion, precioNum, cuidadorId, paqueteId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Paquete no encontrado o no pertenece al cuidador" });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error("editarPaquetePorCuidador:", err);
    return res.status(500).json({ error: "Error al editar paquete" });
  }
};

// ===============================
// DELETE /cuidadores/:id/paquetes/:paqueteId
// ===============================
exports.eliminarPaquetePorCuidador = async (req, res) => {
  try {
    const cuidadorId = Number(req.params.id);
    const paqueteId = Number(req.params.paqueteId);

    if (!cuidadorId || !paqueteId) {
      return res.status(400).json({ error: "IDs inválidos" });
    }

    const result = await pool.query(
      `DELETE FROM paquetes
       WHERE id_superheroe = $1 AND id = $2
       RETURNING id`,
      [cuidadorId, paqueteId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Paquete no encontrado o no pertenece al cuidador" });
    }

    // opcional: mantener contador
    await pool.query(
      `UPDATE superheroes
       SET paquetes_ofrecidos = GREATEST(COALESCE(paquetes_ofrecidos, 0) - 1, 0)
       WHERE id = $1`,
      [cuidadorId]
    );

    return res.json({ ok: true });
  } catch (err) {
    console.error("eliminarPaquetePorCuidador:", err);
    return res.status(500).json({ error: "Error al eliminar paquete" });
  }
};
