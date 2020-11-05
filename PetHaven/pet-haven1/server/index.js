require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

//middleware
const port = process.env.PORT || 3001;
app.use(cors());
app.use(express.json()); //req.body

/* ROUTES */
app.post("/signup");

// signin & signup
app.use("/auth", require("./routes/auth"));

// home
app.use("/home", require("./routes/home"));

// pet owners
app.use("/petowners", require("./routes/petowners"));

// pets
app.use("/pets", require("./routes/pets"));

// profile
app.use("/profile", require("./routes/profile"));

app.listen(port, () => {
	console.log(`server is up and listening on port ${port}`);
});
