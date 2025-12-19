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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({secret: "asdasdasd",resave: false,saveUninitialized: false}));

app.use(express.static(path.join(__dirname, "../public")));

app.use("/assets",express.static(path.join(__dirname, "../public/assets")));


app.use("/users", usersRouter);
app.use("/heros", cuidadoresRouter);
app.use("/", cuidadoresRouter);
app.use(crud_users);


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


app.get("/perfil_cuidador", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/perfiles/perfil_cuidador.html"));
});

app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});

