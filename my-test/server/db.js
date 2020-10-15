const { Pool } = require('pg');

const Pooltest = require('pg').Pool;

const pool = new Pool({
    "user":"postgres",
    "host": "localhost",
    "port": 5432,
    "database": "test_database"
});

module.exports = pool;