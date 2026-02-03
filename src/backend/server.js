require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");

const usersRouter = require("./routes/users.js");
const cuidadoresRouter = require("./routes/cuidadores_routes.js");
const reseniasRoutes = require("./routes/resenias_routes.js");
const crudUsersRouter = require("./services/crud_users.js");

const app = express();
const PORT = process.env.PORT || 8080;


app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});


app.use(session({secret: "asdasdasd",resave: false,saveUninitialized: false,}));

app.use("/api/users", usersRouter);
app.use("/api/cuidadores", cuidadoresRouter);
app.use("/api/resenias", reseniasRoutes);
app.use("/api/crud_users", crudUsersRouter);


app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
  });
});


app.listen(PORT, () => {
  console.log(` Backend API corriendo en http://localhost:${PORT}`);
});
