const express = require("express");
const cors = require("cors");
const pool = require("./src/bdd/bdd.js");  // ← Importa la conexión

const app = express();
app.use(cors());
app.use(express.json());

app.post("/registrar_paquete", async (req, res) => {
  try {
    const {
      id_superheroe,
      nombre_paquete,
      descripcion,
      precio,
      cupos_disponibles
    } = req.body;

    const query = `
      INSERT INTO paquetes
      (id_superheroe, nombre_paquete, descripcion, precio, cupos_disponibles)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const values = [
      id_superheroe,
      nombre_paquete,
      descripcion,
      precio,
      cupos_disponibles
    ];

    const result = await pool.query(query, values);

    res.json({
      mensaje: "Paquete registrado correctamente",
      paquete: result.rows[0]
    });

  } catch (error) {
    console.error("❌ Error al registrar paquete:", error);
    res.status(500).json({ error: "Error en el servidor al registrar paquete" });
  }
});

app.listen(3001, () => {
  console.log("Backend de paquetes activo → http://localhost:3001");
});

