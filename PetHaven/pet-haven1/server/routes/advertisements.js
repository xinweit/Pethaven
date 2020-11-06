const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

/* ROUTES */

//create new advertisement
router.post("/", authorization, async (req, res) => {
	try {
		const { pet_category, start_date, end_date, daily_price, email } = req.body;
		var query =
			"INSERT INTO advertisements(pet_category, start_date, end_date, daily_price, email) VALUES($1, $2, $3, $4, $5);";
		const newAdvertisement = await pool.query(query, [
			pet_category,
			start_date,
			end_date,
			daily_price,
			req.user,
		]);
		res.json("successfully posted advertisement");
	} catch (error) {
		console.error(error.message);
		res.status(500).json("Server Error");
	}
});

//get all advertisement details for this caretaker (works in the backendd)
router.get("/", authorization, async (req, res) => {
	try {
		var query = "";
		if (req.type == "pcs_admin" || req.type == "pet_owner") {
			query =
				"SELECT email, pet_category, start_date, end_date, daily_price FROM advertisements ORDER BY email";
			const getAdvertisement = await pool.query(query);
			res.json(getAdvertisement.rows);
		} else {
			query =
				"SELECT pet_category, start_date, end_date, daily_price FROM advertisements WHERE email = $1";
			const getAdvertisement = await pool.query(query, [req.user]);
			res.json(getAdvertisement.rows);
		}
	} catch (error) {
		console.error(error.message);
		res.status(500).json("Server Error");
	}
});

//delete pet info
router.delete("/", authorization, async (req, res) => {
	try {
		const { advertisement_email, pet_category, start_date, end_date } = req.body;
		console.log(req.body);
		var query =
			"DELETE FROM advertisements WHERE pet_category = $1 AND start_date = $2 AND end_date = $3 AND email = $4";
		const pew = await pool.query(query, [
			pet_category,
			start_date,
			end_date,
			advertisement_email,
		]);
		res.json(pew.rows);
	} catch (error) {
		console.error(error.message);
		res.status(500).json("Server Error");
	}
});

module.exports = router;
