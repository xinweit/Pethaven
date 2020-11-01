import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

function Copyright() {
	return (
		<Typography variant="body2" color="textSecondary" align="center">
			{"Copyright © "}
			<Link color="inherit" href="https://material-ui.com/">
				Your Website
			</Link>{" "}
			{new Date().getFullYear()}
			{"."}
		</Typography>
	);
}

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(3),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

export default function SignUp() {
	const classes = useStyles();

	const [gender, setGender] = React.useState("");
	const handleChange = (event) => {
		setGender(event.target.value);
	};

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<div className={classes.paper}>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign up
				</Typography>
				<form className={classes.form} noValidate>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<TextField
								autoComplete="fname"
								name="firstName"
								variant="outlined"
								required
								fullWidth
								id="firstName"
								label="First Name"
								autoFocus
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								variant="outlined"
								required
								fullWidth
								id="lastName"
								label="Last Name"
								name="lastName"
								autoComplete="lname"
							/>
						</Grid>
						{/* <Grid item xs={12} sm={8}>
							<FormControl
								fullWidth
								variant="outlined"
								className={classes.formControl}
							>
								<InputLabel required htmlFor="outlined-age-native-simple">
									Gender
								</InputLabel>
								<Select
									native
									value={gender}
									onChange={handleChange}
									label="Gender"
									id="gender"
									inputProps={{
										name: "gender",
										id: "outlined-age-native-simple",
									}}
								>
									<option aria-label="None" value="" />
									<option value={"male"}>Male</option>
									<option value={"female"}>Female</option>
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								variant="outlined"
								required
								fullWidth
								name="age"
								label="Age"
								type="number"
								InputProps={{ inputProps: { min: 16, max: 100 } }}
								id="age"
							/>
						</Grid> */}
						<Grid item xs={12}>
							<FormControl
								fullWidth
								variant="outlined"
								className={classes.formControl}
							>
								<InputLabel required htmlFor="outlined-age-native-simple">
									Type
								</InputLabel>
								<Select
									native
									value={gender}
									onChange={handleChange}
									label="Type"
									id="type"
									inputProps={{
										name: "type",
										id: "outlined-age-native-simple",
									}}
								>
									<option aria-label="None" value="" />
									<option value={"pet_owner"}>Pet Owner</option>
									<option value={"pt_caretaker"}>Part Time Caretaker</option>
									<option value={"ft_caretaker"}>Full Time Caretaker</option>
									<option value={"pt_user"}>Part Time User</option>
									<option value={"ft_user"}>Full Time User</option>
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								fullWidth
								id="email"
								label="Email Address"
								name="email"
								autoComplete="email"
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								fullWidth
								name="password"
								label="Password"
								type="password"
								id="password"
								autoComplete="current-password"
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								fullWidth
								name="confirmPassword"
								label="Confirm Password"
								type="password"
								id="confirmPassword"
								autoComplete="confirm-password"
							/>
						</Grid>
					</Grid>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
					>
						Welcome to Pet Haven! Sign up below!
					</Button>
					<Grid container justify="flex-end">
						<Grid item>
							<Link href="/signin" variant="body2">
								Already have an account? Sign in
							</Link>
						</Grid>
					</Grid>
				</form>
			</div>
			<Box mt={5}>
				<Copyright />
			</Box>
		</Container>
	);
}
