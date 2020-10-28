const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
//middleware
app.use(cors());
app.use(express.json()); //req.body
app.listen(5001, ()=>{
    console.log("connected on port 5001");
});

/* ROUTES */
app.post("/signup")