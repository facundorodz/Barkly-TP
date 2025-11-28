const pool = require("../bdd/bdd.js");

// ==========================
//      CREATE (POST)
// ==========================
/*exports.crearCuidador = async (req, res) => {
  const client = await pool.connect();
  try {
    const { nombre, franquicia, experiencia, poderes, paquetes_ofrecidos} = req.body;

    const result = await client.query(
      `INSERT INTO superheroes (nombre, franquicia, experiencia, poderes, paquetes_ofrecidos)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [nombre, franquicia, experiencia, poderes, paquetes_ofrecidos]
    );

    res.json({ mensaje: "Cuidador creado correctamente", cuidador: result.rows[0] });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear cuidador" });
  } finally {
    client.release();
  }
};*/

// ==========================
//      READ (GET)
// ==========================
exports.obtenerCuidadores = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM superheroes");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener cuidadores" });
  }
};

exports.obtenerCuidadorPorID = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM superheroes WHERE id = $1",
      [req.params.id]
    );

    res.json(result.rows[0] || {});
  } catch (error) {
    res.status(500).json({ error: "Error al obtener cuidador" });
  }
};

// ==========================
//      UPDATE (PUT)
// ==========================
exports.editarCuidador = async (req, res) => {
  const { id } = req.params;
  const { nombre, franquicia, experiencia, poderes } = req.body;

  try {
    const result = await pool.query(
      `UPDATE superheroes 
       SET nombre=$1, franquicia=$2, experiencia=$3, poderes=$4, paquetes_ofrecidos=$5
       WHERE id=$5 RETURNING *`,
      [nombre, franquicia, experiencia, poderes, id]
    );

    res.json({ mensaje: "Cuidador actualizado", cuidador: result.rows[0] });

  } catch (error) {
    res.status(500).json({ error: "Error al actualizar cuidador" });
  }
};

// ==========================
//      DELETE (DELETE)
// ==========================
exports.eliminarCuidador = async (req, res) => {
  try {
    await pool.query("DELETE FROM superheroes WHERE id=$1", [
      req.params.id,
    ]);
    res.json({ mensaje: "Cuidador eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar cuidador" });
  }
};

// ==========================================================
//         CRUD PARA PAQUETES DEL CUIDADOR
// ==========================================================

// Create Paquete
exports.registrarPaquete = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;
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
        `INSERT INTO paquetes (id_superheroe, nombre_paquete, descripcion, precio)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [id, p.nombre, p.descripcion, p.precio]
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

// Update Paquete
exports.editarPaquete = async (req, res) => {
  const { id_paquete } = req.params;
  const { nombre_paquete, descripcion, precio } = req.body;

  try {
    const result = await pool.query(
      `UPDATE paquetes 
       SET nombre_paquete=$1, descripcion=$2, precio=$3
       WHERE id=$4 RETURNING *`,
      [nombre_paquete, descripcion, precio, id_paquete]
    );

    res.json({ mensaje: "Paquete actualizado", paquete: result.rows[0] });

  } catch (error) {
    res.status(500).json({ error: "Error al editar paquete" });
  }
};

// Delete Paquete
exports.eliminarPaquete = async (req, res) => {
  try {
    await pool.query("DELETE FROM paquetes WHERE id=$1", [
      req.params.id_paquete,
    ]);

    res.json({ mensaje: "Paquete eliminado" });

  } catch (error) {
    res.status(500).json({ error: "Error al eliminar paquete" });
  }
};

//Obtener Paquete
exports.obtenerPaquetesCuidador = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM paquetes WHERE id_superheroe = $1",
      [id]
    );

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ error: "Error obteniendo paquetes" });
  }
};