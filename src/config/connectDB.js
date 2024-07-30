const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: 'localhost',
    user: 'bluetc',
    password: 'bluetc',
    database: 'bluetc'
});


export default connection;