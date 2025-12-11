const express = require("express");
const router = express.Router();
const db = require("../bdd/bdd.js");


router.delete("/delete_user", async (req, res) => {
    console.log("LLEGO AL DELETE");
    if (!req.session.userId) {
        return res.status(401).send("No estás logueado");
    }
    await db.query("DELETE FROM usuarios WHERE id = $1", [req.session.userId]);
    console.log("Borre a: ", req.session.userId);
    req.session.destroy();
    return res.redirect("/login.html"); 
});


router.put("/edit_user", async (req, res) => {
    console.log("LLEGO AL PUT");
    const { profile_name, pass, name } = req.body;
    if (!req.session.userId) {
        return res.status(401).json({ success: false, message: "No estás logueado" });
    }

    if (profile_name){
        await db.query("UPDATE usuarios set nombre_perfil = $1 WHERE id = $2 ", [profile_name, req.session.userId]);
    }
    if (name){
        await db.query("UPDATE usuarios set nombre_completo = $1 WHERE id = $2 ", [name, req.session.userId]);
    }
    if (pass){
        await db.query("UPDATE usuarios set contraseña = $1 WHERE id = $2 ", [pass, req.session.userId]);
    }
    console.log("Edite a: ", req.session.userId);
    return res.json({ success: true });
});



router.post("/add_dog", async (req, res) => {
    console.log("LLEGO AL POST");
    if (!req.session.userId) {
        return res.status(401).json({ error: "No estás logueado" });
    }
    const { dog_name, age } = req.body;
    try {
        await db.query(
            "INSERT INTO perros (id_usuario, nombre, edad, id_raza) VALUES ($1,$2,$3,1)",[req.session.userId, dog_name, age]
        );
        console.log("Agregué un perro a:", req.session.userId);
        return res.json({ success: true });

    } catch (err) {
        console.log("Error SQL:", err);
        return res.status(500).json({ error: "Error al guardar el perro" });
    }
});

router.get("/user_info", (req, res) => {
    if (!req.session.userId) {
        return res.json({ response: false });
    }
    res.json({
        response: true,
        username: req.session.username
    });
});


module.exports = router;