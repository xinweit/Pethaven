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

//create new advertisement
app.post("/:email/advertisements", async (req, res) => {
    try {
        const { email } = req.params;
        const { pet_category, start_date, end_date, daily_price } = req.body;
        const newAdvertisement = await pool.query(
            "INSERT INTO advertisements(pet_category, start_date, end_date, daily_price, email) VALUES($1, $2, $3, $4, $5) RETURNING *", 
        [pet_category, start_date, end_date, daily_price, email]
        );
        res.json(newAdvertisement);
    } catch (err) {
        console.error(err.message);
    }
});

//get all advertisement details for this caretaker
app.get("/:email/advertisements", async (req, res) => {
    try {
        const { email } = req.params;
        const details = await pool.query(
            "SELECT pet_category, start_date, end_date, daily_price FROM advertisements WHERE email = $1",
            [email]
        );
        res.json(details);
    } catch (err) {
        console.error(err.message);
    }
}); 

//update advertisement information
app.put("/:email/advertisements", async (req, res) => {
    try {
        const { email } = req.params;
        const { pet_category, start_date, end_date, daily_price } = req.body;
        const updateAdvertisement = await pool.query(
            "UPDATE advertisements SET pet_category = $1, start_date = $2, end_date = $3, daily_price = $4 WHERE email = $5",
            [pet_category, start_date, end_date, daily_price, email]
        );
        res.json(updateAdvertisement);
    } catch (err) {
        console.error(err.message);
    }
});

pet_category, start_date, end_date, daily_price

//delete pet info
app.delete("/:email/advertisements", async (req, res) => {
    try {
        const { email } = req.params;
        const { pet_category, start_date, end_date } = req.body;
        const deleteAdvertisement = await pool.query(
            "DELETE FROM advertisements WHERE email = $1 AND pet_category = $2 AND start_date = $3 AND end_date = $4",
            [email, pet_category, start_date, end_date]
        );
        res.json(deleteAdvertisement);
    } catch (err) {
        console.error(err.message);
    }
});


