const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.get("/", authorization, async (req, res) => {
	try {
		//const user = await pool.query("SELECT getUser($1)", [req.user]);
		var query = "SELECT * FROM specifies";

		const user = await pool.query(query);

		//user.rows[0].type = req.type;
		//console.log(user.rows[0]);
		res.json(user.rows);
	} catch (error) {
		console.error(error.message);
		res.status(500).json("Server Error");
	}
});

router.post("/", authorization, async (req, res) => {
	try {
		const { pet_category, base_daily_price } = req.body;
		//const user = await pool.query("SELECT getUser($1)", [req.user]);
		var query = "INSERT INTO specifies VALUES($1,$2,$3)";

		const newBaseDailyPrice = await pool.query(query, [
			pet_category,
			base_daily_price,
			req.user,
		]);

		res.json(newBaseDailyPrice.rows[0]);
		//user.rows[0].type = req.type;
		//console.log(user.rows[0]);
		//res.json(user.rows);
	} catch (error) {
		console.error(error.message);
		res.status(500).json("Server Error");
	}
});

//update pet information
router.put("/", authorization, async (req, res) => {
	try {
		const { pet_category, base_daily_price } = req.body;
		const updateBaseDailyPrice = await pool.query(
			"UPDATE specifies SET pet_category = $1, base_daily_price = $2, pcs_email = $3 WHERE pet_category = $1 RETURNING *",
			[pet_category, base_daily_price, req.user]
		);

		res.json(updateBaseDailyPrice.rows[0]);
	} catch (err) {
		console.error(err.message);
	}
});

//delete specifies
router.delete("/", authorization, async (req, res) => {
	try {
		const { pet_category, base_daily_price } = req.body;
		const deleteBaseDailyPrice = await pool.query(
			"DELETE FROM specifies WHERE pet_category = $1 RETURNING *",
			[pet_category]
		);

		res.json(deleteBaseDailyPrice.rows[0]);
	} catch (err) {
		console.error(err.message);
	}
});

module.exports = router;
