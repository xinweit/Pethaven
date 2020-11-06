import { React, Fragment, useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { Link, Grid, Button, TextField, Table, TableRow, TableCell, TableHead, TableBody } from "@material-ui/core";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";

export default function Calendar() {
  const [profile, setProfile] = useState({
		start_date: "",
		end_date: "",
	});
  //const [startDate, setStartDate] = useState(new Date());
  const { start_date, end_date } = profile;
  
  // async function getLeaves() { //get all the current and past leaaves 
	// 	try {
	// 		const response = await fetch("http://localhost:5002/leaves/", {
	// 			method: "GET",
	// 			headers: { token: localStorage.token },
  //     });
  //     const parseRes = await response.json();

  //     setProfile(parseRes);
  //   } catch (error) {
	// 		console.error(error.message);
  //   }
  // }
  // const handleChange = (e) => {
	// 	setProfile({ ...profile, [e.target.name]: e.target.value });
	// };
  
    async function onSubmitForm(e) {
        //e.preventDefault();
        try {
          const body = { start_date, end_date };
          console.log(body);
          const response = await fetch("http://localhost:5002/leaves/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              token: localStorage.token,
            },
            body: JSON.stringify(body),
          });
    
          toast.success("Logged in Successfully");
          window.location = "/leaves";
        } catch (error) {
          console.error(error.message);
          toast.error(error.message);
        }
      }

      const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
      };
  return (
    <Fragment>
      <h1>Leaves</h1>
		<Grid container spacing={1}>
			<Grid item xs={2}>
				start date:
        (YYYY-MM-DD)
			</Grid>
			<Grid item xs={3}>
				<TextField
					variant="outlined"
					value={start_date || ""}
					name="start_date"
					onChange={(e) => handleChange(e)}
				/></Grid>
      <Grid item xs={2}>
				ending date:
        (YYYY-MM-DD)
			</Grid>
        <Grid item xs={3}>
				<TextField
					variant="outlined"
					value={end_date || ""}
					name="end_date"
					onChange={(e) => handleChange(e)}
				/></Grid>
			<Grid item xs={1}>
				<Button
					variant="contained"
          color="primary"
					onClick={(e) => onSubmitForm(e)}
				>
					Save
				</Button>
			</Grid>
		</Grid>
	

    </Fragment>)
}
