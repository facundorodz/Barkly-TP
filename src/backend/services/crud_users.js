const express = require("express");
const router = express.Router();
const db = require("../bdd/bdd.js");
const path = require("path");

router.delete("/delete_user", async (req, res) => {
    console.log("LLEGO AL DELETE");
    if (!req.session.userId) {
        return res.status(401).json({ error: "No estás logueado" });
    }
    try {
        await db.query("DELETE FROM perros WHERE id_usuario = $1", [req.session.userId]);
        await db.query("DELETE FROM usuarios WHERE id = $1", [req.session.userId]);
        console.log("Borré a:", req.session.userId);
        req.session.destroy(err => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error al cerrar sesión" });
        }
        return res.json({ success: true });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al borrar usuario" });
    }
});



router.put("/edit_user", async (req, res) => {
    console.log("LLEGO AL PUT");
    const { profile_name, pass, name } = req.body;
    if (!req.session.userId) {
        return res.status(401).json({ success: false, message: "No estás logueado" });
    }
    if (profile_name) {
        const exists = await db.query("SELECT nombre_perfil FROM usuarios WHERE nombre_perfil = $1 AND id <> $2",[profile_name, req.session.userId]);
        if (exists.rows.length > 0) {
            console.log("Dplicado")
            return res.status(400).json({ error: "Ya existe un Usuario con ese nombre" });
        }
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


router.get("/show_dogs", async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: "No estás logueado" });
    }
    try {
        const result = await db.query(`SELECT p.id, p.nombre AS dog_name, p.edad AS dog_age, r.nombre AS raza FROM perros p JOIN razas r ON p.id_raza = r.id WHERE p.id_usuario = $1`, [req.session.userId]);
        return res.json({ mascotas: result.rows });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al obtener mascotas" });
    }
});

router.delete("/delete_dog/:id", async (req, res) => {
    const dog_id = req.params.id;  // paso el id por url, entonces recibo con params, no entendi bien porque llegan undefined a traves de json
    console.log("Llegue al delete, id del perro", dog_id);
    if (!req.session.userId) {
        return res.status(401).json({ error: "No estás logueado" });
    }
    try {
        await db.query("DELETE FROM perros WHERE id = $1 AND id_usuario = $2", [dog_id,req.session.userId]);
        return res.json({ success: true });
    } catch (error) {
        console.error("Error al borrar perro:", error);
        return res.status(500).json({ error: "Error al borrar perro" });
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