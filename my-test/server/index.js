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
        const newTest = await pool.query("INSERT INTO test_table(username) VALUES($1) RETURNING *", [userName]);
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
app.get("/test/:id", async (req, res) =>{
    try {
        const { id } = req.params;
        const entry = await pool.query("SELECT * FROM test_table WHERE username = $1", [id]);
        res.json(entry.rows[0]); 
    } catch (error) {
        console.error(error.message);
    }
})
//update an entry//
//specify id as we need to know exactly which one to update
app.put("/test/:id", async (req,res)=>{
    try {
        //req.params gives the :id bit of the route
        const { id } = req.params;
        const { username } = req.body;
        const dataToBeUpdated = await pool.query("UPDATE test_table SET username = $1 WHERE username = $2",
        [username, id]);
        res.json("data is updated!")
    } catch (error) {
        console.error(error.message);
    }
})

//delete an entry//
app.delete("/test/:id", async (req,res)=>{
    try {
        const { id } = req.params;
        const dataToBeDeleted = await pool.query("DELETE FROM test_table WHERE username = $1",[id]);
        res.json("data successfully deleted!");
    } catch (error) {
        console.error(error.message);
    }
})