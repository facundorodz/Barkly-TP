
const pool = require("../bdd/bdd");

//FUNCIONES QUE SE ENCARGAN DE COMUNICARSE CON POSTGRES Y ENVIAN DATOS AL FRONT

// Obtener paquetes por cuidador
/*exports.obtenerPaquetesPorCuidador = async (req, res) => {
  const { id } = req.params; // id del cuidador

  try {
    const result = await pool.query(
      `SELECT id, id_superheroe, nombre_paquete, descripcion, precio FROM paquetes
       WHERE id_superheroe = $1
       ORDER BY id ASC`,
      [id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener paquetes:", error);
    res.status(500).json({ error: "Error al obtener paquetes" });
  }
};

// Crear paquete
exports.crearPaquete = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_paquete, descripcion, precio } = req.body;

    if (!nombre_paquete || !descripcion || !precio) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    const result = await pool.query(
      `INSERT INTO paquetes (id_superheroe, nombre_paquete, descripcion, precio)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id, nombre_paquete, descripcion, precio]
    );

    // sumar contador
    await pool.query(`UPDATE superheroes SET paquetes_ofrecidos = paquetes_ofrecidos + 1 WHERE id = $1`,[id]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear paquete:", err);
    res.status(500).json({ error: "Error al crear paquete" });
  }
};
/* ===============================
   POST /cuidadores/:id/paquetes
   Crea un paquete para ese cuidador
================================ 
// Editar paquete
exports.editarPaquete = async (req, res) => {
  try {
    const { id} = req.params;
    const { nombre_paquete, descripcion, precio } = req.body;


   const result = await pool.query(
      `UPDATE paquetes SET nombre_paquete=$1, descripcion=$2, precio=$3
       WHERE id=$1
       RETURNING *`,
      [id, nombre_paquete, descripcion, precio]
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
    const result = await pool.query(
      `DELETE FROM paquetes
       WHERE id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Paquete no encontrado" });
    }

    const id_superheroe = paquete.rows[0].id_superheroe;

    // RESTAR 1 A paquetes_ofrecidos
    await restarPaquete(id_superheroe);

    res.json({ mensaje: "Paquete eliminado" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar paquete" });
  }
};*/

/* =====================================================
   OBTENER TODOS LOS PAQUETES DE UN CUIDADOR
   GET /cuidadores/:id/paquetes
===================================================== */

/*exports.obtenerPaquetesPorCuidador = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT *
       FROM paquetes
       WHERE id_superheroe = $1
       ORDER BY id ASC`,
      [id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener paquetes" });
  }
};


/* =====================================================
   OBTENER UN PAQUETE ESPECÍFICO DE UN CUIDADOR
   GET /cuidadores/:id/paquetes/:paqueteId
===================================================== */

/*exports.obtenerPaquetePorCuidador = async (req, res) => {
  try {
    const { id, paqueteId } = req.params;

    const result = await pool.query(
      `SELECT *
       FROM paquetes
       WHERE id = $1 AND id_superheroe = $2`,
      [paqueteId, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Paquete no encontrado para este cuidador" });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error al obtener el paquete" });
  }
};

/* ===============================
   POST /cuidadores/:id/paquetes
   Crea un paquete para ese cuidador
================================ */
/*exports.crearPaquete = async (req, res) => {
  const { id } = req.params; // id del cuidador
  const { nombre_paquete, descripcion, precio } = req.body;

  if (!nombre_paquete || !descripcion || precio === undefined || precio === null) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  const precioNum = Number(precio);
  if (Number.isNaN(precioNum) || precioNum <= 0) {
    return res.status(400).json({ error: "Precio inválido" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO paquetes (id_superheroe, nombre_paquete, descripcion, precio)
       VALUES ($2, $3, $4, $5)
       RETURNING id, id_superheroe, nombre_paquete, descripcion, precio`,
      [id, nombre_paquete, descripcion, precioNum]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear paquete:", error);
    return res.status(500).json({ error: "Error al crear paquete" });
  }
};

/* =====================================================
   EDITAR PAQUETE (SOLO SI PERTENECE AL CUIDADOR)
   PUT /cuidadores/:id/paquetes/:paqueteId
===================================================== */
/*exports.editarPaquetePorCuidador = async (req, res) => {
  try {
    const { id, paqueteId } = req.params;
    const { nombre_paquete, descripcion, precio } = req.body;

    const result = await pool.query(
      `UPDATE paquetes
       SET nombre_paquete = $3,
           descripcion = $4,
           precio = $5
       WHERE id = $1 AND id_superheroe = $2
       RETURNING *`,
      [paqueteId, id, nombre_paquete, descripcion, precio]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No se pudo editar el paquete" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al editar paquete" });
  }
};*/

/*exports.editarPaquete = async (req, res) => {
  try {
    const { cuidadorId, paqueteId } = req.params;
    const { nombre_paquete, descripcion, precio } = req.body;

    if (!nombre_paquete || !descripcion || precio == null) {
      return res.status(400).json({ error: "Faltan datos para editar el paquete" });
    }

    const result = await pool.query(
      `UPDATE paquetes
       SET nombre_paquete = $3, descripcion = $4, precio = $5
       WHERE id = $1 AND id_superheroe = $2
       RETURNING *`,
      [paqueteId, cuidadorId, nombre_paquete, descripcion, precio]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Paquete no encontrado para este cuidador" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("editarPaquete error:", err);
    res.status(500).json({ error: "Error al editar paquete" });
  }
};
/* ===============================
   DELETE /paquetes/:id
   Elimina un paquete por su id
================================ */
/*exports.eliminarPaquetePorCuidador = async (req, res) => {
  try {
    const { id, paqueteId } = req.params;

    const result = await pool.query(
      `DELETE FROM paquetes
       WHERE id = $1 AND id_superheroe = $2
       RETURNING *`,
      [paqueteId, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Paquete no encontrado o no pertenece al cuidador" });
    }

    res.json({ mensaje: "Paquete eliminado correctamente" });
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

*/

// ===============================
// GET /cuidadores/:id/paquetes
// ===============================
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
      `INSERT INTO paquetes (id_superheroe, nombre_paquete, descripcion, precio)
       VALUES ($1, $2, $3, $4)
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
