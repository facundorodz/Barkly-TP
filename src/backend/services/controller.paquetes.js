
const pool = require("../bdd/bdd");

//FUNCIONES QUE SE ENCARGAN DE COMUNICARSE CON POSTGRES Y ENVIAN DATOS AL FRONT

// Obtener paquetes por cuidador
exports.obtenerPaquetesPorCuidador = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM paquetes WHERE id_superheroe = $1 ORDER BY id DESC",
      [id]
    );

    res.json(result.rows);
  } catch (error) {
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
    await pool.query(
      `UPDATE superheroes
       SET paquetes_ofrecidos = paquetes_ofrecidos + 1
       WHERE id = $1`,
      [id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("ERROR SQL:", err);
    res.status(500).json({ error: "Error al crear paquete" });
  }
};

// Eliminar paquete
exports.eliminarPaquete = async (req, res) => {
  try {
    const { id } = req.params;

    const paquete = await pool.query(
      "SELECT id_superheroe FROM paquetes WHERE id = $1",
      [id]
    );

    if (paquete.rows.length === 0) {
      return res.status(404).json({ error: "Paquete no encontrado" });
    }

    await pool.query("DELETE FROM paquetes WHERE id = $1", [id]);

    await pool.query(
      `UPDATE superheroes
       SET paquetes_ofrecidos = paquetes_ofrecidos - 1
       WHERE id = $1`,
      [paquete.rows[0].id_superheroe]
    );

    res.json({ mensaje: "Paquete eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar paquete" });
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

/*<<<<<<< HEAD
=======*/
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

    // RESTAR 1 A paquetes_ofrecidos
    await restarPaquete(id_superheroe);

    res.json({ mensaje: "Paquete eliminado" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar paquete" });
  }
};

/*>>>>>>> main*/
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
