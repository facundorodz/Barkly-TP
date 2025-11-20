
const {Pool} = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "barkly",
  password: "barkly_tp",
  port: 5432, 
});

pool.connect()
  .then(() => console.log("📌 Conectado a PostgreSQL"))
  .catch(err => console.error("❌ Error al conectar a PostgreSQL:", err));

module.exports = pool;
