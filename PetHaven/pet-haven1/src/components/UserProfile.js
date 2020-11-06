import { React, Fragment, useState, useEffect } from "react";
import { Grid, Button, TextField } from "@material-ui/core";

export default function UserProfile() {
	const [profile, setProfile] = useState({
		email: "",
		name: "",
		credit_card: "",
		type: "",
	});
	const { email, name, credit_card, type } = profile;

	async function getProfile() {
		try {
			const response = await fetch("http://localhost:5002/home/", {
				method: "GET",
				headers: { token: localStorage.token },
			});

			const parseRes = await response.json();

			setProfile(parseRes);
		} catch (error) {
			console.error(error.message);
		}
	}

	useEffect(() => {
		getProfile();
	}, []);

	const handleChange = (e) => {
		setProfile({ ...profile, [e.target.name]: e.target.value });
	};

	async function onSubmitForm(name) {
		try {
			const body = { name };
			const response = await fetch("http://localhost:5002profile/", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					token: localStorage.token,
				},
				body: JSON.stringify(body),
			});

			//const parseRes = await response.json();
			//console.log(parseRes);

			window.location = "/user_profile";
		} catch (error) {
			console.error(error.message);
		}
	}

	return (
		<Fragment>
			<h1>Profile</h1>
			<Grid container spacing={1}>
				<Grid item xs={1}>
					Email:
				</Grid>
				<Grid item xs={2}>
					<TextField
						variant="outlined"
						value={email || ""}
						disabled
					/>
				</Grid>
			</Grid>
			<Grid container spacing={1}>
				<Grid item xs={1}>
					Name:
				</Grid>
				<Grid item xs={2}>
					<TextField
						variant="outlined"
						value={name || ""}
						name="name"
						onChange={(e) => handleChange(e)}
					/>
				</Grid>
			</Grid>
			<Grid container spacing={1}>
				<Grid item xs={1}>
					Credit Card:
				</Grid>
				<Grid item xs={1}>
					<TextField
						variant="outlined"
						value={credit_card != null ? credit_card || "" : "None"}
						name="credit_card"
						disabled
						onChange={(e) => handleChange(e)}
					/>
				</Grid>
			</Grid>
			<Grid container spacing={2}>
				<Grid item xs={2}>
					<Button
						variant="contained"
						color="primary"
						onClick={() => onSubmitForm(name)}
					>
						Save
					</Button>
				</Grid>
			</Grid>
			{/* <Table style={{ width: 400 }}>
				<TableRow>
					<TableCell style={{ width: 100 }}>Name: </TableCell>
					<TableCell style={{ width: 200 }}>
						{profile.name}
						<Container align="right">
							<Button>Edit</Button>
						</Container>
					</TableCell>
				</TableRow>
				<TableRow>
					<TableCell style={{ width: 100 }}>Email: </TableCell>
					<TableCell style={{ width: 200 }}>
						{profile.email}
					</TableCell>
				</TableRow>
				<TableRow>
					<TableCell style={{ width: 100 }}>Credit Card: </TableCell>
					<TableCell style={{ width: 200 }}>
						{profile.credit_card != null
							? profile.credit_card
							: "None"}
					</TableCell>
				</TableRow>
			</Table> */}
		</Fragment>
	);
}
