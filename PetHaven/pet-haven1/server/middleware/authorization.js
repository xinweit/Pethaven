const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
	try {
		// destructure token
		const jwtToken = req.header("token");

		// if no token return 403 error
		if (!jwtToken) {
			return res.status(403).json("Not Authorized");
		}

		// verify token
		const payload = jwt.verify(jwtToken, process.env.JWTSECRET);

		req.user = payload.user;
		req.type = payload.type;

		next();
	} catch (error) {
		console.error(error.message);
		return res.status(403).json("Not Authorized");
	}
};
