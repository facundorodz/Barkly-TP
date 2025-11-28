const express = require("express");
const router = express.Router();
const controlador = require("../services/controller.cuidadores.js");

// CRUD CUIDADORES
//router.post("/cuidadores", controlador.crearCuidador);
router.get("/cuidadores", controlador.obtenerCuidadores);
router.get("/cuidadores/:id", controlador.obtenerCuidadorPorID);
router.put("/cuidadores/:id", controlador.editarCuidador);
router.delete("/cuidadores/:id", controlador.eliminarCuidador);

// CRUD PAQUETES
/*router.post("/cuidadores/:id/paquetes", controlador.registrarPaquete);
router.put("/paquetes/:id_paquete", controlador.editarPaquete);
router.delete("/paquetes/:id_paquete", controlador.eliminarPaquete);*/

//Verifica que el cuidador este registrado en la bdd
//Devuelve true si existe la id, false en caso contrario
/*router.get("/verificar/:id", async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    const result = await client.query(
      "SELECT * FROM superheroes WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.json({ existe: false });
    }

    res.json({
      existe: true,
      cuidador: result.rows[0]
    });

  } catch (err) {
    console.error("Error verificando cuidador:", err);
    res.status(500).json({ error: "Error interno al verificar cuidador" });
  } finally {
    client.release();
  }
});*/


module.exports = router;
