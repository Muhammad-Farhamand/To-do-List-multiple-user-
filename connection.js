const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

// User Table
const userTable = `
    CREATE TABLE IF NOT EXISTS users (
        id integer PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(225) NOT NULL,
        pass TEXT NOT NULL,
        created TIMESTAMP NOT NULL DEFAULT NOW()
    );
`;

// Todo Table
const todoTable = `
    CREATE TABLE IF NOT EXISTS todos (
        id integer PRIMARY KEY AUTO_INCREMENT,
        user_id integer NOT NULL,
        task TEXT NOT NULL,
        completed boolean,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
`;

pool.query(userTable)
    .then(() => {
        console.log('Users table connected successfully');
    })
    .catch(err => {
        console.error('Error creating users table:', err);
    });

pool.query(todoTable)
    .then(() => {
        console.log('Todos table connected successfully');
    })
    .catch(err => {
        console.error('Error creating todos table:', err);
    });

module.exports = pool;