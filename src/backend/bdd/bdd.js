
const {Pool} = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "barkly",
  password: "barkly_tp",
  port: 5432, 
});

pool.connect()
  .then(() => console.log(" Conectado a PostgreSQL"))
  .catch(err => console.error(" Error al conectar a PostgreSQL:", err));

module.exports = pool;


/* como levantar la BD -> 

1- docker compose up -d  -> levanto docker
2- docker exec -it barkly-postgres psql -U postgres -d barkly para usar la bd y hacer query

*/
