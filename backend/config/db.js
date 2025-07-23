// const mysql = require('mysql2');

// const db = mysql.createConnection({
//     host: process.env.DB_HOST || 'localhost',
//     user: process.env.DB_USER || 'root',
//     password: process.env.DB_PASS || 'Fintree@2024',
//     database: process.env.DB_NAME || 'fintree_lms'
// });

// db.connect(err => {
//     if (err) {
//         console.error('Database connection failed:', err);
//     } else {
//         console.log('Connected to MySQL database');
//     }
// });

// module.exports = db;

const mysql = require('mysql2');
 
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'Fintree@2024',
    database: process.env.DB_NAME || 'fintree_lms',
    waitForConnections: true,
    connectionLimit: 10, // You can adjust this as needed
    queueLimit: 0
});
 
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Database pool connection failed:', err);
    } else {
        console.log('Connected to MySQL database (pool)');
        connection.release(); // release immediately after test
    }
});
 
module.exports = pool;
 
 