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
    const { profile_name, pass, name, profile_photo } = req.body;
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
    if (profile_photo) {
        await db.query("UPDATE usuarios set foto_perfil = $1 WHERE id = $2", [profile_photo, req.session.userId])
    }
    console.log("Edite a: ", req.session.userId);
    return res.json({ success: true });
});


router.post("/add_dog", async (req, res) => {
    console.log("LLEGO AL POST");
    if (!req.session.userId) {
        return res.status(401).json({ error: "No estás logueado" });
    }
    const { dog_name, age, raza } = req.body;
    try {
        await db.query(
            "INSERT INTO perros (id_usuario, nombre, edad, id_raza) VALUES ($1,$2,$3,$4)",[req.session.userId, dog_name, age, raza]
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
        const result = await db.query(`SELECT p.id, p.nombre AS dog_name, p.edad AS dog_age, r.nombre AS raza, r.id AS raza_id FROM perros p JOIN razas r ON p.id_raza = r.id WHERE p.id_usuario = $1`, [req.session.userId]);
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

router.get("/dog/:id", async (req, res) => {
    const dog_id = req.params.id;

    if (!req.session.userId) {
        return res.status(401).json({ error: "No estás logueado" });
    }

    try {
        const result = await db.query(
            "SELECT id, nombre, edad FROM perros WHERE id = $1",
            [dog_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Perro no encontrado" });
        }

        return res.json({
            success: true,
            mascota: {
                id: result.rows[0].id,
                dog_name: result.rows[0].nombre,
                dog_age: result.rows[0].edad
            }
        });

    } catch (error) {
        console.error("Error al obtener perro:", error);
        return res.status(500).json({ error: "Error al obtener perro" });
    }
});

router.get("/view_raza/:id", async (req, res) => {
    const raza_id = req.params.id;

    if (!req.session.userId) {
        return res.status(401).json({ error: "No estás logueado" });
    }

    try {
        const result = await db.query(
            `SELECT id, nombre, tamanio, temperamento, fortaleza, velocidad, color_predominante
             FROM razas
             WHERE id = $1`,
            [raza_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Raza no encontrada" });
        }

        const raza = result.rows[0];

        return res.json({
            success: true,
            raza: {
                id: raza.id,
                nombre: raza.nombre,
                tamanio: raza.tamanio,
                temperamento: raza.temperamento,
                fortaleza: raza.fortaleza,
                velocidad: raza.velocidad,
                color_predominante: raza.color_predominante
            }
        });

    } catch (error) {
        console.error("Error al obtener raza:", error);
        return res.status(500).json({ error: "Error al obtener raza" });
    }
});

router.post("/edit_dog/:id", async (req, res) => {
    const dog_id = req.params.id;
    if (!req.session.userId) {
        return res.status(401).json({ error: "No estás logueado" });
    }

    const { dog_name, age } = req.body;

    try {
        await db.query(
            "UPDATE perros SET nombre = $1, edad = $2 WHERE id = $3",
            [dog_name, age, dog_id]
        );

        return res.json({ success: true });

    } catch (error) {
        console.error("Error al editar perro:", error);
        return res.status(500).json({ error: "Error al editar perro" });
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