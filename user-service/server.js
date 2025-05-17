const express = require('express');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(require('cors')());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'userdb',
    password: '678678',  // Use a secure password
    port: 5432,
});

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// 🟢 SIGNUP - Register a New User (No Hashing)
app.post('/users', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if email already exists
        const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: "Email already registered" });
        }

        // Insert new user (storing password as plain text)
        const result = await pool.query(
            "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id, name, email, password_hash",
            [name, email, password]
        );

        res.status(201).json({ message: "User registered successfully", user: result.rows[0] });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 🟢 LOGIN - Authenticate User (No Hashing)
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const user = userResult.rows[0];

        // Compare password directly (⚠️ This is insecure)
        if (password !== user.password_hash) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Generate JWT Token
        const token = jwt.sign({ user_id: user.user_id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

        // ✅ Return user_id along with token
        res.json({ message: "Login successful", token, user_id: user.user_id });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 🔵 GET USER - Fetch User Details
app.get('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Received request for user ID:", id); // Debugging

        // Fetch user details from database
        const userResult = await pool.query("SELECT user_id, name, email FROM users WHERE user_id = $1", [id]);

        console.log("Query result:", userResult.rows); // Debugging

        // Check if user exists
        if (userResult.rows.length === 0) {
            console.log("User not found for ID:", id);
            return res.status(404).json({ error: "User not found" });
        }

        res.json(userResult.rows[0]);
    } catch (error) {
        console.error("Get User Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Server listening on port 3001
app.listen(3001, () => console.log('User Service running on port 3001'));
