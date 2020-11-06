const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

/* ROUTES */
router.post("/", authorization, async(req, res)=>{
    try {
        const{ transfer_method, bid_price, payment_method, rating_given, is_successful, feedback, start_date, end_date, pet_category, advertisement_email, owner_email, pet_name } = req.body;
        var query = "INSERT INTO bids_for VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)";
        await pool.query(query, [transfer_method, bid_price, payment_method, rating_given, is_successful, feedback, start_date, end_date, pet_category, advertisement_email, owner_email, pet_name]);
        res.json("successfully bidded");
    } catch (error) {
        console.error(error.messages);
    }
});

router.get("/", authorization, async(req, res) => {
    try {
        var query = `SELECT transfer_method, bid_price, payment_method, rating_given, is_successful, feedback, start_date, end_date, pet_category, advertisement_email, pet_name
        FROM bids_for
        WHERE owner_email = $1`;
        var x = await pool.query(query, [req.user]);
        res.json(x.rows);
    } catch (error) {
        console.error(error.message);
    }
});

module.exports = router;