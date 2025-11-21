import pg from "pg";

export const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "2024",
  port: 5432
});

app.post("/registrar", async (req, res) => {
  try {
    const {
      nombre_completo, nombre_perfil, contrasena, cantidad_perros
    } = req.body;

    const query = `
      INSERT INTO usuarios (nombre_completo, nombre_perfil, contrasena, cantidad_perros)
      VALUES ($1, $2, $3, $4)
    `;

    await pool.query(query, [nombre_completo, nombre_perfil, contrasena, cantidad_perros]);

    res.json({ mensaje: "Usuario registrado correctamente" });
  	} 
  catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});

app.listen(3000, () => console.log("API funcionando en puerto 3000"));