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
//owner's personal details
app.get("/home/pet_owner/:email" ,async(req,res) =>{
    const { email } = req.params;
    // console.log(req.params);
    // console.log(req.body);
    try {
        const ownerDetails = await pool.query("SELECT name, email, age FROM pet_owners WHERE email = $1", [email]);
        res.json(ownerDetails.rows);
    } catch (error) {
        console.error(error);
    }
});

//owner changing credit-card details
app.put("/home/pet_owner/:email/ucc", async(req,res)=>{
    try {
        const { email } = req.params;
        const { credit_card } = req.body;
        const query = "UPDATE pet_owners SET credit_card = $2 WHERE email = $1";
        const creditCardUpdate = await pool.query(query, [email, credit_card]);
        res.json("data updated"); 
    } catch (error) {
        console.error(error.message);
    }
});

//pet owner can see all pets
app.get("/home/pet_owner/:email/allPets", async(req,res) =>{
    try {
        const { email } = req.params;
        const allPets = await pool.query("SELECT * FROM owns_pets WHERE email = $1", [email]);
        res.json(allPets.rows);
    } catch (error) {
        console.error(error.message);
    }
});

//