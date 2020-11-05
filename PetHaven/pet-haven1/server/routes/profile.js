const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.put("/", authorization, async (req, res) => {
	try {
		const { name } = req.body;

		var query = "";
		if (req.type == "pet_owner") {
			query = "UPDATE pet_owners SET name=$2 WHERE email=$1";
		} else if (req.type == "pt_caretaker") {
			query = "UPDATE pt_caretakers SET name=$2 WHERE email=$1";
		} else if (req.type == "ft_caretaker") {
			query = "UPDATE ft_caretakers SET name=$2 WHERE email=$1";
		} else if (req.type == "pt_user") {
			query = "UPDATE pet_owners SET name=$2 WHERE email=$1";
			query = "UPDATE pt_caretakers SET name=$2 WHERE email=$1";
		} else if (req.type == "ft_user") {
			query = "UPDATE pet_owners SET name=$2 WHERE email=$1";
			query = "UPDATE ft_caretakers SET name=$2 WHERE email=$1";
		} else if (req.type == "pcs_admin") {
			query = "UPDATE pcs_admins SET name=$2 WHERE email=$1";
		}

		const user = await pool.query(query, [req.user, name]);

		res.json(user.rows);
	} catch (error) {
		console.error(error.message);
		res.status(500).json("Server Error");
	}
});

module.exports = router;
