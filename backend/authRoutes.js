const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { userDb } = require("./db");
require("dotenv").config();

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await userDb.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3)", 
        [name, email, hashedPassword]);
        res.json({ message: "User registered successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await userDb.query("SELECT * FROM users WHERE email = $1", [email]);

    if (user.rowCount === 0) return res.status(400).json({ error: "Invalid credentials" });

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, user: user.rows[0] });
});

module.exports = router;
