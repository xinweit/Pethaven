require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

//middleware
const port = process.env.PORT || 3001;
app.use(cors());
app.use(express.json()); //req.body
app.listen(port, () => {
	console.log(`server is up and listening on port ${port}`);
});

/* ROUTES */
app.post("/signup");

// sign in
app.use("/auth", require("./routes/auth"));

// sign up
