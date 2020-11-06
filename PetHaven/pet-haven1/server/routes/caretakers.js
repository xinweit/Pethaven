const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.get("/", authorization, async (req, res) => {
	try {
		//const user = await pool.query("SELECT getUser($1)", [req.user]);
		var query = `
                SELECT email, name, 'Full Time' AS type, check_ft_salary('ft_caretaker', email) as salary FROM ft_caretakers
                UNION 
                SELECT email, name, 'Part Time' AS type, check_pt_salary('pt_caretaker', email) as salary FROM pt_caretakers
            `;

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
