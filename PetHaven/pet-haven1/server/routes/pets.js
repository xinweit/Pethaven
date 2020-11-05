const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

//insert pet into owner's list of pets
router.post("/", authorization, async (req, res) => {
	try {
		const { pet_name, special_requirements, pet_category, pet_age } = req.body;
		const newPet = await pool.query(
			"INSERT INTO owns_pets(email, pet_name, special_requirements, pet_category, pet_age) VALUES($1, $2, $3, $4, $5) RETURNING *",
			[req.user, pet_name, special_requirements, pet_category, pet_age]
		);

		res.json(newPet.row[0]);
	} catch (err) {
		console.error(err.message);
	}
});

//retrieve pets that belong to pet owner
router.get("/", authorization, async (req, res) => {
	try {
		const allPets = await pool.query(
			"SELECT pet_name, special_requirements, pet_category, pet_age FROM owns_pets WHERE email = $1",
			[req.user]
		);

		res.json(allPets.rows);
	} catch (err) {
		console.error(err.message);
	}
});

//update pet information
router.put("/", authorization, async (req, res) => {
	try {
		const { pet_name, special_requirements, pet_category, pet_age } = req.body;
		const updatePet = await pool.query(
			"UPDATE owns_pets SET pet_name = $1, special_requirements = $2, pet_category = $3, pet_age = $4 WHERE email = $5",
			[pet_name, special_requirements, pet_category, pet_age, req.user]
		);

		res.json("Pet details are updated");
	} catch (err) {
		console.error(err.message);
	}
});

//delete pet info
router.delete("/", authorization, async (req, res) => {
	try {
		const { pet_name } = req.body;
		const deletePet = await pool.query(
			"DELETE FROM owns_pets WHERE email = $1 AND pet_name = $2",
			[req.user, pet_name]
		);

		res.json("Pet details are deleted");
	} catch (err) {
		console.error(err.message);
	}
});

module.exports = router;