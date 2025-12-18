const express = require("express");
const usersRouter = require("./routes/users.js");
const cuidadoresRouter = require("./routes/cuidadores.routes.js");
const cors = require("cors");
const session = require("express-session");

const app = express();
const port = 3000;

app.use(cors());
app.use('/assets', express.static('assets'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: "asdasdasd",
  resave: false,
  saveUninitialized: false
}));

app.use("/", cuidadoresRouter);
app.use("/users", usersRouter);

app.use(express.static("src/public"));

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

/*
GET para mostrar las paginas 
*/ 
app.get("/", (req, res) => {
  res.redirect("/index.html");
});

app.get("/registrar_cuidador", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pagina_registro_cuidador/registro_cuidador.html"));
});


app.get("/login", (req, res) => {
  res.redirect("/login/login.html");
});

app.get("/crud_usuario", (req, res) => {
  res.redirect("/crud_usuarios/crud_usuarios.html");
});

app.get("/perfil_usuario", (req, res) => {
  res.redirect("/perfiles/perfil_usuario.html");
});


app.get("/prueba_crud", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/prueba_crud.html"));
});

//Pagina donde se imprime la informacion del superheroe
app.get("/perfil_cuidador", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/perfiles/perfil_cuidador.html"));
});


app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});

