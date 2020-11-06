const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

/* ROUTES */

//create new bid
router.post("/", authorization, async (req, res) => {
    try {
        const { bid_start_date,
            transfer_method,
            bid_price,
            timestamp,
            payment_method,
            rating_given } = req.body;
        var query = "INSERT INTO bids_for (bid_start_date, transfer_method, bid_price, timestamp, payment_method, rating_given, advertisement_email, pet_category, start_date, end_date, owner_email, pet_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)";
        const createBid = await pool.query(query, [
            bid_start_date,
            transfer_method,
            bid_price,
            timestamp,
            payment_method,
            rating_given,
            req.user
        ]);
        res.json(createBid.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Server Error");
    }
});


//retrieve bid details
router.get("/", authorization, async (req, res) => {
    try {
        /*const { bid_start_date,
            bid_end_date,
            transfer_method,
            bid_price,
            timestamp,
            payment_method,
            rating_given,
            is_successful,
            feedback } = req.body;
        var query = "SELECT bid_start_date, bid_end_date, transfer_method, bid_price, timestamp, payment_method, rating_given, is_successful, feedback FROM bids_for WHERE ";*/

        var query = "SELECT * FROM bids_for WHERE advertisement_email = $1, pet_category = $2, start_date = $3, end_date = $4, owner_email = $5, pet_name = $6";
        const getDetails = await pool.query(query, [req.user]);
        res.json(getDetails.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Server Error");
    }
});

//delete bid
router.delete("/", authorization, async (req, res) => {
    try {
        var query = "DELETE FROM bids_for WHERE advertisement_email = $1, pet_category = $2, start_date = $3, end_date = $4, owner_email = $5, pet_name = $6";
        const deleteBid = await pool.query(query, [req.user]);
        res.json(deleteBid.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Server Error");
    }
});

module.exports = router;