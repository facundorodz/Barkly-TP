const express = require("express");
const usersRouter = require("./routes/users.js");
const cuidadoresRouter = require("./routes/cuidadores.routes.js");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const crud_users = require("./services/crud_users.js");



const app = express();
const port = 3000;


app.use(cors());
app.use('/assets', express.static('assets')); // para que el back cargue las imagenes
app.use(express.urlencoded({ extended: true })); // para poder usar req.body
app.use(express.json()); 
app.use(express.static("src/public")); // nos muestra todo lo de la carpeta public desde ese punto en adelante -> sirve para poder cambiar de paginas por ejemplo
app.use(session({secret: "asdasdasd",resave: false,saveUninitialized: false}));

app.use("/users", usersRouter); // -> ruta para manejar los usuarios
app.use(express.static(path.join(__dirname, "../public")));
app.use("/heros", cuidadoresRouter); // -> ruta para manejar cuidadores
app.use(crud_users);

/*
GET para mostrar las paginas 
*/ 
app.get("/", (req, res) => {
  res.redirect("/index.html");
});


app.use(express.static(path.join(__dirname, "../public")));

app.get("/registrar_cuidador", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pagina_registro_cuidador/registro_cuidador.html"));
});


app.get("/login", (req, res) => {
  res.redirect("/login/login.html");
});

app.get("/crud_usuario", (req, res) => {
  res.redirect("/crud_usuarios/crud_usuarios.html");
});


//Carga la informacion del superheroe junto con sus paquetes
app.use("/", cuidadoresRouter);

app.get("/perfil_usuario", (req, res) => {
  res.redirect("/perfiles/perfil_usuario.html");
});

app.use("/users", usersRouter);

//Pagina donde se imprime la informacion del superheroe
app.get("/perfil_cuidador", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/perfiles/perfil_cuidador.html"));
});


app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});

