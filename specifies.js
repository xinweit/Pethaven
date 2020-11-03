const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

/* ROUTES */

//create new specification 
router.post("/", authorization, async (req, res) => {
    try {
        const { pet_category, base_daily_price, ft_email, pcs_email } = req.body;
        var query = "INSERT INTO specifies(pet_category, base_daily_price, ft_email, pcs_email) VALUES($1, $2, $3, $4) RETURNING *";
        const newSpecification = await pool.query(query, [req.body]);
        res.json(newSpecification.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Server Error");
    }
});

//get all specifications
router.get("/", authorization, async (req, res) => {
    try {
        const { ft_email, pcs_email } = req.body; 
        var query = "SELECT pet_category, base_daily_price, ft_email, pcs_email FROM specifies WHERE ft_email = $1, pcs_email = $2";
        const getSpecification = await pool.query(query, [req.body]);
        res.json(getSpecification.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Server Error");
    }
});

//update specifications information
router.put("/", authorization, async (req, res) => {
    try {
        const { pet_category, base_daily_price, ft_email, pcs_email } = req.body;
        var query = "UPDATE specifies SET pet_category = $1, base_daily_price = $2 WHERE ft_email = $3, pcs_email = $4";
        const updatedSpecification = await pool.query(query, [req.body]);
        res.json(updatedSpecification.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Server Error");
    }
});

//delete pet info
router.delete("/", authorization, async (req, res) => {
    try {
        const { ft_email, pcs_email } = req.body;
        var query = "DELETE FROM specifies WHERE ft_email = $1 AND pcs_email = $2";
        const deleteAdvertisement = await pool.query(query, [req.body]);
        res.json(deleteAdvertisement);
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Server Error");
    }
});

module.exports = router;