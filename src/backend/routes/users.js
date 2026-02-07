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
            req.session.userId = response_usuario.rows[0].id; 
            req.session.username = response_usuario.rows[0].nombre_perfil;
            return res.json({ success: true, type: "user" });
        }   catch (error) {
                console.error("Error en login:", error);
                return res.status(500).json({ error: "Error interno en el servidor" });
        }

    } else if (login_type === "hero"){
        try {
            const response_hero = await db.query("SELECT * FROM superheroes WHERE nombre = $1 ",[profile_name]
        );
            if (response_hero.rows.length === 0) {
                return res.status(400).json({ error: "Usuario o contraseña incorrectos" });
            }
            const cuidador = response_hero.rows[0];
            req.session.userId = response_hero.rows[0].id; 
            req.session.username = response_hero.rows[0].nombre_perfil;
            return res.json({success: true, type: "hero", cuidador: {id: cuidador.id,nombre: cuidador.nombre}});
        }   catch (error) {
                console.error("Error en login:", error);
                return res.status(500).json({ error: "Error interno en el servidor" });
        }
    }
});

router.post("/register_user", async (req, res) => {
    const { profile_name, pass, name, profile_photo } = req.body;
    console.log("registro de usuario", req.body);       

      try {
        const exists = await db.query("SELECT nombre_perfil FROM usuarios WHERE nombre_perfil = $1",[req.body.profile_name]);
        if (exists.rows.length > 0) { // acceder con rows.length porque devuelve un objeto la consutl
            return res.status(400).json({ error: "Ya existe un usuario con ese nombre de perfil" });
        } 
        const result = await db.query("INSERT INTO usuarios (nombre_perfil, contraseña, nombre_completo, foto_perfil) VALUES ($1, $2, $3, $4) RETURNING id, nombre_perfil ",[profile_name, pass, name,profile_photo]);
        req.session.userId = result.rows[0].id; 
        req.session.username = result.rows[0].nombre_perfil;
        return res.json({ success: true }); 
    } catch(error){ 
        console.error(error);
        return res.status(500).send("Error al registrar usuario"); 
    }
});  


router.post("/register_hero", async (req, res) => {
    const {profile_name,franchise_name,powers,experience,password, profile_photo} = req.body;
    
    try {
        const exists = await db.query("SELECT nombre FROM superheroes WHERE nombre = $1",[profile_name]);
        if (exists.rows.length > 0) {
            return res.status(400).json({ error: "Ya existe un superhéroe con ese nombre" });
        }

        await db.query(`INSERT INTO superheroes (nombre, franquicia, experiencia, poderes, contrasenia, foto_perfil) VALUES ($1, $2, $3, $4, $5, $6)`,[profile_name, franchise_name, experience, powers, password, profile_photo]);
        return res.json({ success: true });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al registrarse" });
    }
    
});


router.get("/session_info", (req, res) => {
    if (req.session.userId) {
        return res.json({
            logged: true,
            profile_name: req.session.username
        });
    }

    return res.json({ logged: false });
});

router.get("/profile_data", async (req, res) => {
    try {
        const result = await db.query(
            "SELECT nombre_perfil, nombre_completo, contraseña, foto_perfil FROM usuarios WHERE id = $1",
            [req.session.userId]
        ); return res.json(result.rows[0]);
    } catch (error) {
        console.log("Error: ", error)
        return res.statusCode(500)
    }
})

module.exports = router;