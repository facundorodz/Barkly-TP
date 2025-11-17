import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// Necesario para __dirname cuando usamos modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ejemplo de ruta principal
app.get("/", (req, res) => {
  res.json({ message: "Backend Barkly-TP funcionando 🚀" });
});

// Puerto (usar env si existe)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🔥 Servidor backend corriendo en http://localhost:${PORT}`);
});
