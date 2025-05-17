const express = require("express");
const { bookingDb } = require("./db");
const router = express.Router();

router.get("/services", async (req, res) => {
    const result = await bookingDb.query("SELECT * FROM services");
    res.json(result.rows);
});

module.exports = router;
