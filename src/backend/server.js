import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("src/public")); // base de donde esta todo lo del front y back, entonces uso solo la ruta desde ahi en adelante

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

app.listen(PORT, () => {
  console.log(`🔥 Servidor backend corriendo en http://localhost:${PORT}`);
});
