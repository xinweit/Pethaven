const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.post("/", authorization, async (req, res) => {
	try {
        const {start_date, end_date} = req.body
        var query = `INSERT INTO takes_leaves(email, start_date, end_date) 
        VALUES($1, $2, $3)`;
		const profile = await pool.query(query, [req.user,start_date, end_date]);
		res.json("successful");
	} catch (error) {
		console.error(error.message);
		res.status(500).json("Server Error");
	}
});

router.get("/", authorization, async (req, res) => {
	try {
		const {start_date, end_date} = req.body
		var query = `SELECT start_date, end_date
                    FROM takes_leaves 
                    WHERE email=$1`;
		const user = await pool.query(query, [req.user]);
		res.json(user.rows);
	} catch (error) {
		console.error(error.message);
		res.status(500).json("Server Error");
	}
});


router.put("/", authorization, async (req, res) => {
	try {
        const {new_start,new_end,email, old_start, old_end} = req.body
		var query = `UPDATE takes_leaves 
                    SET start_date = date($1), end_date = date($2)
                    WHERE 
                    email = $3
                    and
                    start_date = date($4)
                    and
                    end_date = date($5);`;
		const user = await pool.query(query, [new_start, new_end, email, old_start, old_end]);
		res.json(user.rows[0]);
	} catch (error) {
		console.error(error.message);
		res.status(500).json("Server Error");
	}
});


router.delete("/", authorization, async (req, res) => {
	try {
        const {start, end} = req.body
		var query = `DELETE FROM takes_leaves
                     WHERE 
                     email = $1 
                     and 
                     start_date = $2
                     and 
                     end_date = $3`;
		const user = await pool.query(query, [email,start, end]);
		res.json(user.rows[0]);
	} catch (error) {
		console.error(error.message);
		res.status(500).json("Server Error");
	}
});


module.exports = router;
