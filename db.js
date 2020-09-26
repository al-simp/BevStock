const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    password: '2256',
    host: 'localhost',
    database: 'bevstock',
    port: 5432
});

module.exports = pool;