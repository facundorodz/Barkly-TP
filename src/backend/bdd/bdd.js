
const {Pool} = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.connect()
  .then(() => console.log(" Conectado a PostgreSQL"))
  .catch(err => console.error(" Error al conectar a PostgreSQL:", err));

module.exports = pool;


/* como levantar la BD -> 

1- docker compose up -d  -> levanto docker
2- docker exec -it barkly-postgres psql -U postgres -d barkly para usar la bd y hacer querys

*/
