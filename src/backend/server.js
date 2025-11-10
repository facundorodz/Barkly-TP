const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const routes = require('./index');
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
