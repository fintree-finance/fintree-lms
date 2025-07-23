// const express = require('express');
// const db = require('../config/db');
// const router = express.Router();

// // Get Courses
// router.get('/', (req, res) => {
//     db.query('SELECT * FROM courses', (err, results) => {
//         if (err) return res.status(500).json({ message: 'Error fetching courses' });
//         res.json(results);
//     });
// });

// // Create Course
// router.post('/', (req, res) => {
//     const { title, description, instructor } = req.body;
//     const query = 'INSERT INTO courses (title, description, instructor) VALUES (?, ?, ?)';
//     db.query(query, [title, description, instructor], (err, result) => {
//         if (err) return res.status(500).json({ message: 'Error creating course' });
//         res.status(200).json({ message: 'Course created successfully' });
//     });
// });

// module.exports = router;


const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", verifyToken, (req, res) => {
    res.json({ message: "Welcome to the courses page", user: req.user });
});

module.exports = router;


