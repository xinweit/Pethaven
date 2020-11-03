const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(user_email, user_type) {
	const payload = {
		user: user_email,
		type: user_type,
	};

	return jwt.sign(payload, process.env.JWTSECRET, { expiresIn: "2hr" });
}

module.exports = jwtGenerator;
