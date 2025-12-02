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





module.exports = router;