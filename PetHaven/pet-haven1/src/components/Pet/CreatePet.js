import React, { Fragment, useState } from 'react';
import { Grid, TextField, Button } from '@material-ui/core';

export default function CreatePet() {
    const [newPet, setPet] = useState({
        pet_name: "",
        special_requirement: "",
        pet_category: "",
        pet_age: "",
    });

    const { pet_name, special_requirement, pet_category, pet_age } = newPet;

    const handleChange = (e) => {
        setPet({ ...newPet, [e.target.name]: e.target.value });
    };

    async function onSubmitForm() {
        try {
            const body = { pet_name, special_requirement, pet_category, pet_age };
            const response = await fetch("http://localhost:5002/pets/", {
                method: "POST",
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

    return <Fragment>
        <h1>Profile</h1>
        <Grid container spacing={1}>
            <Grid item xs={2}>
                Name:
				</Grid>
            <Grid item xs={3}>
                <TextField
                    variant="outlined"
                    value={pet_name || ""}
                    name="pet_name"
                    onChange={(e) => handleChange(e)}
                />
            </Grid>
        </Grid>
        <Grid container spacing={1}>
            <Grid item xs={2}>
                Special Requirement:
				</Grid>
            <Grid item xs={3}>
                <TextField
                    variant="outlined"
                    value={special_requirement || ""}
                    name="special_requirement"
                    onChange={(e) => handleChange(e)}
                />
            </Grid>
        </Grid>
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
                Pet Age:
				</Grid>
            <Grid item xs={3}>
                <TextField
                    variant="outlined"
                    value={pet_age || ""}
                    name="pet_age"
                    onChange={(e) => handleChange(e)}
                />
            </Grid>
        </Grid>
        <Grid item xs={1}>
            <Button
                variant="contained"
                color="primary"
                onClick={() => onSubmitForm()}
            >
                Create
					</Button>
        </Grid>
    </Fragment>
};