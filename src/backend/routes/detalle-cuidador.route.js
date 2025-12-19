router.get("/heros/:id", async (req, res) => {
  const { id } = req.params;

  const result = await db.query(
    "SELECT * FROM superheroes WHERE id = $1",
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Cuidador no encontrado" });
  }

  res.json(result.rows[0]);
});