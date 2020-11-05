import { React, Fragment, useState, useEffect } from "react";
import { Grid, Button, TextField, Table, TableRow, TableCell, TableHead, TableBody } from "@material-ui/core";
import EditPet from "./EditPet";

export default function UserProfile() {
	const [profile, setProfile] = useState({
		email: "",
		name: "",
		credit_card: "",
		type: "",
	});

	const { email, name, credit_card, type } = profile;

	const [pets, setPets] = useState([]);

	async function getProfile() {
		try {
			const response = await fetch("http://localhost:5002/home/", {
				method: "GET",
				headers: { token: localStorage.token },
			});

			const parseRes = await response.json();

			setProfile(parseRes);

			//console.log(parseRes.type);

			if (parseRes.type === "pet_owner") {
				try {
					const response1 = await fetch("http://localhost:5002/pets", {
						method: "GET",
						headers: { token: localStorage.token }
					});
					const parseRes1 = await response1.json();

					setPets(parseRes1);

				} catch (error) {
					console.error(error.message);
				}
			}
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
			const response = await fetch("http://localhost:5002/profile/", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					token: localStorage.token,
				},
				body: JSON.stringify(body),
			});

			window.location = "/user_profile";
		} catch (error) {
			console.error(error.message);
		}
	}
	console.log(pets);

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
			<Grid container spacing={1}>
				<Grid item xs={1}>
					Pets:
				</Grid>
				<Grid item xs={12}>
					<Table id='mytable'>
						<TableHead>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>Special Requirement</TableCell>
								<TableCell>Pet Category</TableCell>
								<TableCell>Age</TableCell>
								<TableCell>Edit</TableCell>

							</TableRow>
						</TableHead>
						<TableBody>
							{pets.map(function (pet) {
								return <TableRow key={pet.pet_name}>
									<TableCell>{pet.pet_name}</TableCell>
									<TableCell>{pet.special_requirements}</TableCell>
									<TableCell>{pet.pet_category}</TableCell>
									<TableCell>{pet.pet_age}</TableCell>
									<TableCell><EditPet pet={pet} /></TableCell>
								</TableRow>;
							})}
						</TableBody>
					</Table>

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
		</Fragment>
	);

}
