const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

/* ROUTES */

//retrieve pet owner details
router.get("/", authorization, async (req, res) => {
    try {
        const getDetails = await pool.query(
            "SELECT name, credit_card FROM pet_owners WHERE email = $1",
            [req.user]
        );

        res.json(getDetails.rows);
    } catch (err) {
        console.error(err.message);
    }
});

//update pet owner name
router.put("/", authorization, async (req, res) => {
    try {
        const { name } = req.body;
        const updateName = await pool.query(
            "UPDATE pet_owners SET name = $1 WHERE email = $2 RETURNING *",
            [name, req.user]
        );

        res.json(updateName.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//update pet owner password
router.put("/", authorization, async (req, res) => {
    try {
        const { password } = req.body;
        const updatePassword = await pool.query(
            "UPDATE pet_owners SET name = $1 WHERE email = $2 RETURNING *",
            [password, req.user]
        );

        res.json(updatePassword.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//update pet owner credit card
router.put("/", authorization, async (req, res) => {
    try {
        const { credit_card } = req.body;
        const updateCreditcard = await pool.query(
            "UPDATE pet_owners SET credit_card = $1 WHERE email = $2 RETURNING *",
            [credit_card, req.user]
        );

        res.json(updateCreditcard.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//delete pet owner account
router.delete("/", authorization, async (req, res) => {
    try {
        const { email } = req.params;
        const deleteAccount = await pool.query(
            "DELETE FROM pet_owners WHERE email = $1 RETURNING *",
            [email]
        );

        res.json(deleteAccount.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

module.exports = router;
