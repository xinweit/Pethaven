const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");

// sign up route
router.post("/signup", async (req, res) => {
	try {
		// destructure the req.body(name, email, password)
		const { name, type, email, password } = req.body;

		// check if user exists (if user exists then throw error)
		const user = await pool.query("SELECT check_email_signup($1, $2)", [type, email]);
		if (user.rows[0].check_email_signup == true) {
			return res.status(401).json("User already exists");
		}

		// bcrypt the password
		const saltRound = 10;
		const salt = await bcrypt.genSalt(saltRound);
		const bcryptPassword = await bcrypt.hash(password, salt);

		// insert user into db
		var query = "";
		if (type == "pet_owner") {
			query = "INSERT INTO pet_owners VALUES($1,$2,$3) RETURNING $1";
		} else if (type == "pt_caretaker") {
			query = "SELECT add_pt_caretaker($3,$1,$2)";
		} else if (type == "ft_caretaker") {
			query = "SELECT add_ft_caretaker($3,$1,$2)";
		} else if (type == "pt_user") {
			query = "SELECT add_pt_user($3,$1,$2)";
		} else if (type == "ft_user") {
			query = "SELECT add_ft_user($3,$1,$2)";
		}
		const newUser = await pool.query(query, [email, bcryptPassword, name]);

		// create jwt token
		const token = jwtGenerator(newUser.rows[0].email);
		res.json({ token });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server error");
	}
});

// sign in route
router.post("/signin", async (req, res) => {
	try {
		// destructure the req.body
		const { type, email, password } = req.body;

		// check if user doesnt exists (if not then we throw error)
		const check = await pool.query("SELECT check_email_signin($1, $2)", [type, email]);
		if (check.rows[0].check_email_signin == false) {
			return res.status(401).json("Email/Password is incorrect");
		}

		// check if incoming password is the same as the database password
		const user = await pool.query("SELECT check_password($1, $2)", [type, email]);
		const validPassword = await bcrypt.compare(password, user.rows[0].check_password);
		if (!validPassword) {
			return res.status(401).json("Email/Password is incorrect");
		}

		// give the jwt token
		const token = jwtGenerator(email);
		res.json({ token });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server error");
	}
});

module.exports = router;
