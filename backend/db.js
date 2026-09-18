const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "muni143215",
    database: "muni_chat",
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool;