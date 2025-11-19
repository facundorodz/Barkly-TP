const express = require("express");
const app = express();
const port = 3000;

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
  //const { email, password } = req.body;
  res.redirect("/login/login.html");
});

app.listen(port, () => {
  console.log(`🔥 Servidor backend corriendo en http://localhost:${port}`);
});

