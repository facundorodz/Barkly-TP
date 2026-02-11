const pool = require("../bdd/bdd.js");

const obtenerCuidadores = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM superheroes ORDER BY id ASC"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener cuidadores" });
  }
};


const obtenerCuidadorPorID = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM superheroes WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Cuidador no encontrado" });
    }

    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener cuidador por ID" });
  }
};

const editarCuidador = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      franquicia,
      experiencia,
      poderes,
      contrasenia,
      foto_perfil
    } = req.body;

    const result = await pool.query(
      `UPDATE superheroes
       SET nombre = $1,
           franquicia = $2,
           experiencia = $3,
           poderes = $4,
           contrasenia = $5,
           foto_perfil = $6
       WHERE id = $7
       RETURNING *`,
      [
        nombre,
        franquicia,
        experiencia,
        poderes,
        contrasenia,
        foto_perfil,
        id
      ]
    );

    res.status(200).json({
      mensaje: "Actualizado correctamente",
      cuidador: result.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al editar cuidador" });
  }
};


const eliminarCuidador = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "No estás logueado" });
  }

  try {
    const userId = req.session.userId;

    await pool.query(
      "DELETE FROM paquetes WHERE id_superheroe = $1",
      [userId]
    );

    await pool.query(
      "DELETE FROM superheroes WHERE id = $1",
      [userId]
    );

    req.session.destroy(err => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error al cerrar sesión" });
      }
      res.status(200).json({ success: true });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al borrar cuidador" });
  }
};

module.exports = {
  obtenerCuidadores,
  obtenerCuidadorPorID,
  editarCuidador,
  eliminarCuidador
};
