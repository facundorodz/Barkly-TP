const express = require("express");
const usersRouter = require("./routes/users.js");
const paquetesRouter = require("./services/paquete.route.js");
const cors = require("cors");
 
const app = express();
const port = 3000;


/*app.use(cors({
  origin: "*",                // <-- IMPORTANTE
  methods: "GET,POST",
  allowedHeaders: "Content-Type"
}));*/
app.use(cors());

app.use(express.urlencoded({ extended: true })); // para poder usar req.body
app.use(express.json()); 
app.use(express.static("src/public")); // acceder a todo lo de la carpeta public desde ese punto en adelante


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

app.get("/pagina_seleccionar", (req, res) => {  // carga la pagina de seleccion al registrarse
    
  /*const tipo = req.query.tipo;
    if (tipo === "usuario") {
        return res.redirect("/pagina_seleccion_registrar/pagina_seleccion_registro.html");
    }
    if (tipo === "cuidador") {
        return res.redirect("/registrar_cuidador");
    }*/
   res.redirect("/pagina_seleccion_registrar/pagina_seleccion_registro.html");
});

app.use("/users", usersRouter);

//Guarda los paquetes en la bdd
app.use("/", paquetesRouter);


app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});

