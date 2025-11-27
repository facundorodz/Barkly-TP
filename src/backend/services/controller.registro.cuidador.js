const pool = require("../bdd/bdd.js");
// ==========================
//      CREATE (POST)
// ==========================
exports.crearCuidador = async (req, res) => {
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
};