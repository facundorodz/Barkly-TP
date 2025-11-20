const express = require("express");
const router = express.Router();
const db = requiere("../bdd/bdd.js");



router.post("/login", async (req, res) => {
  console.log("login", req.body); 
  const { name, pass } = req.body;
  // let response_usuario = await pg.realizarQuery  ("SELECT * FROM usuarios WHERE nombre = $1 AND contrasenia = $2",[req.body.name, req.body.pass]);
  // let response_superheroe = await pg.realizarQuery  ("SELECT * FROM superheroes WHERE nombre = $1 AND contrasenia = $2",[req.body.name, req.body.pass]);
  try {
      let is_user = false
  if (response_usuario.length > 0 || response_superheroe.length > 0){
    is_user = true
  } 
  
  } catch(error) {
      console.error(error);
      res.status(404).send("not found"); 
  }

  if (response_usuario.length > 0 && is_user == true) {
     // res.redirect("/pagina_para_usuario");  
  }
    if (response_superheroe.length > 0 && is_user == true) {
     // res.redirect("/pagina_para_superheroe"); 
  }
  // terminar pero esta seria la base
});


export default router;