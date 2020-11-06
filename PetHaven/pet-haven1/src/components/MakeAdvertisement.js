import { React, Fragment, useState, useEffect } from "react";
import { Grid, Button, TextField } from "@material-ui/core";

export default function MakeAdvertisement(){
    const[advertisement, setAdvertisement] = useState({
        pet_category : "",
        start_date : "",
        end_date : "",
        daily_price : ""
    });
    const { pet_category, start_date, end_date, daily_price } = advertisement;
    const onSubmitForm = async () =>{
        // e.preventDefault();
        try {
            const body = {pet_category, start_date, end_date, daily_price};
            const res = await fetch("http://localhost:5002/advertisements", {
                "method": "POST",
                headers : { 
                    "Content-Type": "application/json",
                    token: localStorage.token
                },
                body : JSON.stringify(body)
            });

            window.location = "/advertisements"
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = async(e) => {
        setAdvertisement({...advertisement, [e.target.name]: e.target.value });
    };
    return (
        <Fragment>
        <h1 className = "text-center mt-5">Post an advertisement</h1>
        <Grid container justify = "center" spacing={1}>
            <Grid item xs={1}>
                pet category
            </Grid>
            <Grid item xs={3}>
                <TextField
                    variant="outlined"
                    value={pet_category || ""}
                    name="pet_category"
                    onChange={(e)=> handleChange(e)}
                />
            </Grid>
        </Grid>
        <Grid container justify = "center" spacing={1}>
            <Grid item xs={1}>
                start date (YYYY-MM-DD)
            </Grid>
            <Grid item xs={3}>
                <TextField
                    variant="outlined"
                    value={start_date || ""}
                    name="start_date"
                    onChange={(e) => handleChange(e)}
                />
            </Grid>
        </Grid>
        <Grid container justify = "center" spacing={1}>
            <Grid item xs={1}>
            ending date (YYYY-MM-DD)
            </Grid>
            <Grid item xs={3}>
                <TextField
                    variant="outlined"
                    value={end_date || ""}
                    name="end_date"
                    onChange={(e) => handleChange(e)}
                />
            </Grid>
        </Grid>
        <Grid container justify = "center" spacing={1}>
            <Grid item xs={1}>
                daily price
            </Grid>
            <Grid item xs={3}>
                <TextField
                    variant="outlined"
                    value={daily_price || ""}
                    name="daily_price"
                    onChange={(e) => handleChange(e)}
                />
            </Grid>
        </Grid>
        <Grid container justify = "center" spacing={2}>
            <Grid item xs={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => onSubmitForm()}
                >
                    Post your ad!
                </Button>
            </Grid>
        </Grid>
        </Fragment>
    )
}
