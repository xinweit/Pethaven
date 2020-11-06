import React, { Fragment, useState } from "react";
import { Grid, TextField, Button } from "@material-ui/core";

export default function CreateBaseDailyPrice() {
	const [newBaseDailyPrice, setBaseDailyPrice] = useState({
		pet_category: "",
		base_daily_price: "",
	});

	const { pet_category, base_daily_price } = newBaseDailyPrice;

	const handleChange = (e) => {
		setBaseDailyPrice({ ...newBaseDailyPrice, [e.target.name]: e.target.value });
	};

	async function onSubmitForm() {
		try {
			const body = { pet_category, base_daily_price };
			const response = await fetch("http://localhost:5002/basedailyprice", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					token: localStorage.token,
				},
				body: JSON.stringify(body),
			});

			window.location = "/home";
		} catch (error) {
			console.error(error.message);
		}
	}

	return (
		<Fragment>
			<h1>Profile</h1>
			<Grid container spacing={1}>
				<Grid item xs={2}>
					Pet Category:
				</Grid>
				<Grid item xs={3}>
					<TextField
						variant="outlined"
						value={pet_category || ""}
						name="pet_category"
						onChange={(e) => handleChange(e)}
					/>
				</Grid>
			</Grid>
			<Grid container spacing={1}>
				<Grid item xs={2}>
					Base Daily Price:
				</Grid>
				<Grid item xs={3}>
					<TextField
						variant="outlined"
						value={base_daily_price || ""}
						name="base_daily_price"
						onChange={(e) => handleChange(e)}
					/>
				</Grid>
			</Grid>

			<Grid item xs={1}>
				<Button variant="contained" color="primary" onClick={() => onSubmitForm()}>
					Create
				</Button>
			</Grid>
		</Fragment>
	);
}
