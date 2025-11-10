const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ mensaje: 'Backend de Barkly-TP funcionando 🚀' });
});

module.exports = router;

// puedo correr con npm run dev
