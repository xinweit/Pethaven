const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

/* ROUTES */
//to get the bids
router.get("/", authorization, async (req,res)  =>{
    try {
        const  { pet_category, }
        const query = `SELECT pet_category FROM bids_for WHERE 
        advertisement_email = $1 AND pet_category = $2 AND start_date = $3`
    } catch (error) {
        console.error(error);
    }
})