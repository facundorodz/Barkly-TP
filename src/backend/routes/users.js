const express = require("express");
const router = express.Router();
const db = require("../bdd/bdd.js");




router.post("/login_user", async (req, res) => {
    console.log("Login intento:", req.body);
    const { profile_name, pass, login_type } = req.body;
    if(login_type === "user"){
        try {
            const response_usuario = await db.query("SELECT * FROM usuarios WHERE nombre_perfil = $1 AND contraseña = $2",[profile_name, pass]
        );
            if (response_usuario.rows.length === 0) {
                return res.status(400).json({ error: "Usuario o contraseña incorrectos" });
            }
            return res.json({ success: true, type: "user" });
        }   catch (error) {
                console.error("Error en login:", error);
                return res.status(500).json({ error: "Error interno en el servidor" });
        }
    } else if (login_type === "hero"){
        try {
            const response_hero = await db.query("SELECT * FROM superheroes WHERE nombre_perfil = $1 ",[profile_name]
        );
            if (response_hero.rows.length === 0) {
                return res.status(400).json({ error: "Usuario o contraseña incorrectos" });
            }
            return res.json({ success: true, type: "hero" });
        }   catch (error) {
                console.error("Error en login:", error);
                return res.status(500).json({ error: "Error interno en el servidor" });
        }
    }
});


router.post("/register_user", async (req, res) => {
    console.log("registro de usuario", req.body);
    const { profile_name, pass, name  } = req.body; 
      try {
        const exists = await db.query("SELECT nombre_perfil FROM usuarios WHERE nombre_perfil = $1",[req.body.profile_name]);
        if (exists.rows.length > 0) { // acceder con rows.length porque devuelve un objeto la consutl
            return res.status(400).json({ error: "Ya existe un usuario con ese nombre de perfil" });
        } 
        await db.query("INSERT INTO usuarios (nombre_perfil, contraseña, nombre_completo) VALUES ($1, $2, $3)",[profile_name, pass, name]);
        return res.redirect("/index.html"); 
    } catch(error){ 
        console.error(error);
        return res.status(500).send("Error al registrar usuario"); 
    }
});  

router.post("/register_hero", async (req, res) => {
    console.log("registro de superheroe", req.body);
    const { profile_name, franchise_name, powers, experience } = req.body; // agregar todo lo necesario para cuando se registra para los superheroes
      try {
        const exists = await db.query("SELECT nombre FROM superheroes WHERE nombre = $1",[req.body.profile_name]);
        if (exists.rows.length > 0) {
            return res.status(400).json("Ya existe un superheroe con ese email");
        } 
        await db.query("INSERT INTO superheroes (nombre, franquicia, experiencia, poderes ) VALUES ($1, $2, $3, $4)",[profile_name, franchise_name, powers, experience]); 
        return res.status(200).json({ success: true }); 
    } catch(error){ 
        console.error(error);
        return res.status(500).send("Error al registrarse"); // manejar bien este error
    }
});


module.exports = router;