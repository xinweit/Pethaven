const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

/* ROUTES */

//create new advertisement
router.post("/", authorization, async (req, res) => {
    try {
        const { pet_category, start_date, end_date, daily_price, email } = req.body;
        var query = "INSERT INTO advertisements(pet_category, start_date, end_date, daily_price, email) VALUES($1, $2, $3, $4, $5) RETURNING *";
        const newAdvertisement = await pool.query(query, [req.body]);
        res.json(newAdvertisement.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Server Error");
    }
});

//get all advertisement details for this caretaker
router.get("/", authorization, async (req, res) => {
    try {
        var query = "SELECT pet_category, start_date, end_date, daily_price FROM advertisements WHERE email = $1";
        const getAdvertisement = await pool.query(query, [req.user]);
        res.json(getAdvertisement.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Server Error");
    }
});

//update advertisement information
router.put("/", authorization, async (req, res) => {
    try {
        const { pet_category, start_date, end_date, daily_price, email } = req.body;
        var query = "UPDATE advertisements SET pet_category = $1, start_date = $2, end_date = $3, daily_price = $4 WHERE email = $5";
        const updateAdvertisement = await pool.query(query, [req.body]);
        res.json(updateAdvertisement.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Server Error");
    }
});

//delete pet info
router.delete("/", authorization, async (req, res) => {
    try {
        const { email } = req.body;
        var query = "DELETE FROM advertisements WHERE email = $1" ;
        const deleteAdvertisement = await pool.query(query, [req.body]);
        res.json(deleteAdvertisement.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Server Error");
    }
});

module.exports = router;