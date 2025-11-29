const express = require("express");
const usersRouter = require("./routes/users.js");
const cuidadoresRouter = require("./routes/cuidadores.routes.js");
const cors = require("cors");
const path = require("path");


const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true })); // para poder usar req.body
app.use(express.json()); 
app.use(express.static("src/public")); // nos muestra todo lo de la carpeta public desde ese punto en adelante -> sirve para poder cambiar de paginas por ejemplo

app.use("/users", usersRouter); // -> ruta para manejar los usuarios


/*
GET para mostrar las paginas 
*/ 

app.get("/", (req, res) => {
  res.redirect("/index.html");
});

app.get("/registrar_cuidador", (req, res) => {
  res.redirect("/pagina_cuidador/pagina_cuidador.html");
});

app.get("/login", (req, res) => {
  res.redirect("/login/login.html");
});

app.get("/cuidador-form", (req, res) => {
  res.redirect("/pagina_registro_usuario/registro_usuario.html");
});

app.use("/users", usersRouter);

//Carga la informacion del superheroe junto con sus paquetes
app.use("/", cuidadoresRouter);

//Pagina donde se imprime la informacion del superheroe
app.get("/prueba_crud.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/prueba_crud.html"));
});


app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});

