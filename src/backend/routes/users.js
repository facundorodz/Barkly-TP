const express = require("express");
const router = express.Router();
const db = require("../bdd/bdd.js");



router.put("/login", async (req, res) => {
  console.log("login", req.body); 
  const { name, pass } = req.body;
  //let response_usuario = await pg.realizarQuery  ("SELECT * FROM usuarios WHERE nombre_perfil = $1 AND contrasenia = $2",[req.body.name, req.body.pass]);
  //let response_superheroe = await pg.realizarQuery  ("SELECT * FROM superheroes WHERE nombre_perfil = $1 AND contrasenia = $2",[req.body.name, req.body.pass]);
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
});



router.put("/register_user", async (req, res) => {
    console.log("registro de usuario", req.body);
    const { name, pass, profile_name  } = req.body; // resto de cosas se toman por defecto en la BD 
      try {
        const exists = await db.realizarQuery("SELECT * FROM usuarios WHERE nombre_perfil = $3",[req.body.profile_name]);
        if (exists.length > 0) {
            return res.status(400).send("Ya existe un usuario con ese nombre de perfil");
        } // si no existe inserto en la tabla
        await db.realizarQuery("INSERT INTO usuarios (nombre_perfil, contrasenia, nombre_completo) VALUES ($3, $2, $1)",[profile_name, pass, name]);
        return res.redirect("/index.html"); // redireccionar a la pagina que quiero
    } catch(error){ 
        console.error(error);
        return res.status(400).send("Error al registrar usuario"); // manejar bien este error
    }
});  

router.put("/register_hero", async (req, res) => {
    console.log("registro de superheroe", req.body);
    const { name, pass } = req.body; // agregar todo lo necesario para cuando se registra para los superheroes
      try {
        const exists = await db.realizarQuery("SELECT * FROM superheroes WHERE name = $1",[req.body.name]);
        if (exists.length > 0) {
            return res.status(400).send("Ya existe un superheroe con ese email");
        } // si no existe inserto en la tabla
        await db.realizarQuery("INSERT INTO superheroes (nombre, contrasenia) VALUES ($1, $2)",[name, pass]); // agregar todo lo necesario al insertar un superheroe
        return res.redirect("/index.html"); // redireccionar a la pagina que quiero
    } catch(error){ 
        console.error(error);
        return res.status(400).send("Error al registrar usuario"); // manejar bien este error
    }
});

/*router.post("/register_paquetes", async (req, res) => {
    console.log("registro de paquetes", req.body);
    const { name, pass } = req.body; // agregar todo lo necesario para cuando se registra para los paquetes
      try {
        const exists = await db.realizarQuery("SELECT * FROM paquetes WHERE name = $1",[req.body.name]);
        await db.realizarQuery("INSERT INTO paquetes (nombre_paquete, descripcion, precio) VALUES ($1, $2, $3)",[name, pass]); // agregar todo lo necesario al insertar un paquete
        return res.redirect("/index.html"); // redireccionar a la pagina que quiero
    } catch(error){ 
        console.error(error);
        return res.status(400).send("Error al registrar los paquetes"); // manejar bien este error
    }
});*/   


module.exports = router;