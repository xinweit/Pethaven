const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.get("/", authorization, async (req, res) => {
	try {
		//const user = await pool.query("SELECT getUser($1)", [req.user]);
		var query = "";
		if (req.type == "pet_owner") {
			query =
				"SELECT email, name, credit_card FROM pet_owners WHERE email=$1";
		} else if (req.type == "pt_caretaker") {
			query = "SELECT email, name FROM pt_caretakers WHERE email=$1";
		} else if (req.type == "ft_caretaker") {
			query =
				"SELECT email, name, pet_day FROM ft_caretakers WHERE email=$1";
		} else if (req.type == "pt_user") {
			query = "SELECT email, name FROM pt_caretakers WHERE email=$1";
		} else if (req.type == "ft_user") {
			query =
				"SELECT email, name, pet_day FROM ft_caretakers WHERE email=$1";
		} else if (req.type == "pcs_admin") {
			query = "SELECT email, name FROM pcs_admins WHERE email=$1";
		}

		const user = await pool.query(query, [req.user]);

		user.rows[0].type = req.type;
		//console.log(user.rows[0]);
		res.json(user.rows[0]);
	} catch (error) {
		console.error(error.message);
		res.status(500).json("Server Error");
	}
});

router.get("/profile", authorization, async (req, res) => {
	try {
		var query = "";

		if (req.type == "pet_owner") {
			query =
				"SELECT email, name, credit_card FROM pet_owners WHERE email = $1";
		} else if (req.type == "pt_caretaker") {
			query = "SELECT email, name FROM pt_caretakers WHERE email = $1";
		} else if (req.type == "ft_caretaker") {
			query =
				"SELECT email, name, pet_day FROM ft_caretakers WHERE email = $1";
		} else if (req.type == "pt_users") {
			query = "SELECT email, name FROM pt_caretakers WHERE email = $1";
		} else if (req.type == "ft_users") {
			query =
				"SELECT email, name, pet_day FROM ft_caretakers WHERE email = $1";
		} else if (req.type == "pcs_admin") {
			query = "SELECT email, name FROM pcs_admins WHERE email = $1";
		}

		const profile = await pool.query(query, [req.user]);

		res.json(profile.rows);
	} catch (error) {
		console.error(error.message);
		res.status(500).json("Server Error");
	}
});

module.exports = router;
