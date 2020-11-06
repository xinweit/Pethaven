const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.get("/", authorization, async (req, res) => { //create
	try {
        const {email, start, end} = req.body
        var query = `INSERT INTO specifies_available_days(email, start_date, end_date) 
        VALUES($1, date($2), date($3))`;
		const profile = await pool.query(query, [email,start,end]);
		res.json(profile.rows);
	} catch (error) {
		console.error(error.message);
		res.status(500).json("Server Error");
	}
});


router.get("/", authorization, async (req, res) => { //read
	try {
		var query = `SELECT email, start_date, end_date
                     FROM  specifies_available_days 
                     WHERE email=$1`;
		const user = await pool.query(query, [req.user]);
		res.json(user.rows[0]);
	} catch (error) {
		console.error(error.message);
		res.status(500).json("Server Error");
	}
});


router.get("/", authorization, async (req, res) => { //update
	try {
        const {new_start,new_end,email, old_start, old_end} = req.body
		var query = `UPDATE specifies_available_days 
                    SET start_date = date($1), end_date = date($2)
                    WHERE 
                    email = $3
                    and
                    start_date = date($4)
                    and
                    end_date = date($5);`;
		const user = await pool.query(query, [new_start, new_end, new_start,email, old_start, old_end]);
		res.json(user.rows[0]);
	} catch (error) {
		console.error(error.message);
		res.status(500).json("Server Error");
	}
});


router.get("/", authorization, async (req, res) => { //delete 
	try {
        const {email, start, end} = req.body
		var query = `DELETE FROM specifies_available_days
                     WHERE 
                     email = $1 
                     and 
                     start_date = $2
                     and 
                     end_date = $3`;
		const user = await pool.query(query, [email,start,end]);
		res.json(user.rows[0]);
	} catch (error) {
		console.error(error.message);
		res.status(500).json("Server Error");
	}
});


module.exports = router;
