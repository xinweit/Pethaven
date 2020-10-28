const { Pool } = require('pg');

const petHavenPool = require('pg').Pool;

const pool = new Pool({
    "user":"postgres",
    "host": "localhost",
    "port": 5432,
    "database": "pethaven"
});

module.exports = pool;