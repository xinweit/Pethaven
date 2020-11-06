const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.get("/", authorization, async (req, res) => {
	try {
		const { email, type } = req.body;
		if (type == "pt_caretaker" || type == "pt_user") {
		} else {
		}
		var query = "";
		const salary = await pool.query(query, []);
	} catch (error) {
		console.error(error.message);
	}
});

module.exports = router;
