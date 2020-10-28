const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
//middleware
app.use(cors());
app.use(express.json()); //req.body
app.listen(5002, ()=>{
    console.log("connected on port 5002");
});

/* ROUTES */
app.post("/signup")