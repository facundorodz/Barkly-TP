const pool = require("../bdd/bdd.js");
const express = require("express");
const router = express.Router();

// Obtener todos
exports.obtenerCuidadores = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM superheroes ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener cuidadores" });
  }
};

// Obtener uno por ID
exports.obtenerCuidadorPorID = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM superheroes WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Cuidador no encontrado" });

    res.json(result.rows[0]);
    foto_perfil: result.rows[0].foto_perfil

  } catch (err) {
    res.status(500).json({ error: "Error al obtener cuidador por ID" });
  }
};

// Editar cuidador
exports.editarCuidador = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, franquicia, experiencia, poderes } = req.body;

    const result = await pool.query(
      `UPDATE superheroes
       SET nombre = $1, franquicia = $2, experiencia = $3, poderes = $4, contrasenia = $5, foto_perfil = $6
       WHERE id = $7 RETURNING *`,
      [nombre, franquicia, experiencia, poderes, contrasenia, foto_perfil, id]
    );

    res.json({ mensaje: "Actualizado correctamente", cuidador: result.rows[0] });

  } catch (err) {
    res.status(500).json({ error: "Error al editar cuidador" });
  }
};

// Eliminar cuidador
exports.eliminarCuidador = async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: "No estás logueado" });
    }
    try {
        await pool.query("DELETE FROM paquetes WHERE id_superheroe = $1", [req.session.userId]); 
    await pool.query( "DELETE FROM superheroes WHERE id = $1", [req.session.userId]);
        console.log("Borré a:", req.session.userId);
        req.session.destroy(err => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error al cerrar sesión" });
        }
        return res.json({ success: true });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al borrar usuario" });
    }
};

