const express = require("express");
const app = express();
const port = 3000;

const pool = require("./bdd/bdd");

app.use(express.json()); 
app.use(express.static("src/public")); // acceder a todo lo de la carpeta public desde ese punto en adelante

/*
GET para mostrar las paginas 
*/ 

app.get("/", (req, res) => {
  res.redirect("/index.html"); // La ruta de inicio
});

app.get("/registrar_cuidador", (req, res) => {
  res.redirect("/pagina_cuidador/pagina_cuidador.html");
});

app.get("/login", (req, res) => {
  res.redirect("/login/login.html");
});

app.post("/login", (req, res) => {
  /*const { email, password } = req.body;
  try {

  } catch() */
  res.redirect("/login/login.html");
});

app.get("/usuarios", async (req, res) => {
  try {
    const resultado = await pool.query("SELECT * FROM usuarios");
    res.json(resultado.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error en la BD");
  }
});


app.listen(port, () => {
  console.log(`🔥 Servidor backend corriendo en http://localhost:${port}`);
});

