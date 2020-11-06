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

// profile
app.use("/profile", require("./routes/profile"));

// pet owners
app.use("/petowners", require("./routes/petowners"));

// pets
app.use("/pets", require("./routes/pets"));

//advertisements
app.use("/advertisements", require("./routes/advertisements"));
//leaves
app.use("/leaves", require("./routes/leaves"));
//Availability

app.use("/availability", require("./routes/availability"));
// caretakers
app.use("/caretakers", require("./routes/caretakers"));

// base daily price
app.use("/basedailyprice", require("./routes/basedailyprice"));

//bids
app.use("/bids",  require("./routes/bids"));
// salary
app.use("/salary", require("./routes/salary"));

app.listen(port, () => {
	console.log(`server is up and listening on port ${port}`);
});
