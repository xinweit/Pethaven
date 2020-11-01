const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
	user: "postgres",
	host: "localhost",
	port: 5432,
	database: "pethaven",
	password: process.env.PW,
});

module.exports = pool;
