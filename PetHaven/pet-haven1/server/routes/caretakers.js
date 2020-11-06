const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.get("/", authorization, async (req, res) => {
	try {
		//const user = await pool.query("SELECT getUser($1)", [req.user]);
		var query =
			"SELECT email, name, 'Full Time' AS type FROM ft_caretakers UNION SELECT email, name, 'Part Time' AS type FROM pt_caretakers";

		const user = await pool.query(query);

		//user.rows[0].type = req.type;
		//console.log(user.rows[0]);
		res.json(user.rows);
	} catch (error) {
		console.error(error.message);
		res.status(500).json("Server Error");
	}
});

module.exports = router;
