const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const router = express.Router();

// ✅ User Registration
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const checkUserQuery = "SELECT * FROM users WHERE username = ?";
        db.query(checkUserQuery, [username], (err, results) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ message: 'Database error' });
            }
            if (results.length > 0) {
                console.log("Username already exists:", username);
                return res.status(400).json({ message: 'Username already taken' });
            }

            const insertQuery = "INSERT INTO users (id, username, email, password) VALUES (1, ?, ?, ?)";
            db.query(insertQuery, [username, email, hashedPassword], (err, result) => {
                if (err) {
                    console.error("Error inserting user:", err);
                    return res.status(500).json({ message: 'Error registering user' });
                }
                console.log("User registered successfully:", username);
                res.status(201).json({ message: 'User registered successfully' });
            });
        });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: 'Error processing request' });
    }
});


// ✅ User Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    console.log("Login Attempt:", username);

    const query = "SELECT * FROM users WHERE username = ?";
    db.query(query, [username], async (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ message: 'Database error' });
        }
        if (results.length === 0) {
            console.log("User not found:", username);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = results[0];
        console.log("User Found:", user);

        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log("Password Match:", passwordMatch);

        if (!passwordMatch) {
            console.log("Incorrect password for:", username);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '8h' });
        console.log("Login successful for:", username);

        res.json({ token, user: { id: user.id, username: user.username } });
    });
});


module.exports = router;
