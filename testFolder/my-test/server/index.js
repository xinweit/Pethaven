const express = require("express");
const app = express();
const cors = require('cors');
const pool = require('./db');
//middleware
app.use(cors());
app.use(express.json()); //req.body
app.listen(5000, ()=>{
    console.log("connected on port 5000");
});

//ROUTES//

//creating entry//
app.post("/test", async(req,res)=>{
    try {
        const { userName } = req.body;
        const newTest = await pool.query("INSERT INTO test_table(userName) VALUES($1)", [userName]);
        res.json(newTest);
    } catch (error) {
        console.error(error.message);
    }
})
//getting all entries//
app.get("/test", async(req,res)=>{
    try {
        const allEntries = await pool.query("SELECT * FROM test_table");
        res.json(allEntries.rows);
    } catch (error) {
        console.error(error);
    }
}); 
//getting an entry//

//update an entry//