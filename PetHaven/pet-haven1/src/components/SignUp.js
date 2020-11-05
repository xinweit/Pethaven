import { React, useState } from "react";
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
import { toast } from "react-toastify";

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

export default function SignUp({ setAuth }) {
	const classes = useStyles();

	// const [type, setType] = useState("");
	// const handleChange = (event) => {
	// 	setType(event.target.value);
	// };

	const [inputs, setInputs] = useState({
		email: "",
		password: "",
		confirmPassword: "",
		name: "",
		type: "",
	});

	const { email, password, confirmPassword, name, type } = inputs;

	const handleChange = (e) => {
		setInputs({ ...inputs, [e.target.name]: e.target.value });
	};

	const onSubmitForm = async (e) => {
		e.preventDefault();
		try {
			const body = { name, type, email, password };
			const response = await fetch("http://localhost:5002/auth/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			const parseRes = await response.json();

			if (parseRes.token) {
				localStorage.setItem("token", parseRes.token);
				setAuth(true);
				toast.success("Logged in Successfully");
			} else {
				setAuth(false);
				toast.error(parseRes);
			}
		} catch (error) {
			console.error(error.message);
		}
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
				<form className={classes.form} onSubmit={onSubmitForm}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<FormControl
								fullWidth
								variant="outlined"
								className={classes.formControl}
							>
								<InputLabel
									required
									htmlFor="outlined-age-native-simple"
								>
									Type
								</InputLabel>
								<Select
									native
									value={type}
									onChange={(e) => handleChange(e)}
									label="Type"
									id="type"
									inputProps={{
										name: "type",
										id: "outlined-age-native-simple",
									}}
								>
									<option aria-label="None" value="" />
									<option value={"pet_owner"}>
										Pet Owner
									</option>
									<option value={"pt_caretaker"}>
										Part Time Caretaker
									</option>
									<option value={"ft_caretaker"}>
										Full Time Caretaker
									</option>
									<option value={"pt_user"}>
										Part Time User
									</option>
									<option value={"ft_user"}>
										Full Time User
									</option>
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12}>
							<TextField
								name="name"
								variant="outlined"
								required
								fullWidth
								id="name"
								label="Name"
								autoFocus
								value={name}
								onChange={(e) => handleChange(e)}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								fullWidth
								id="email"
								label="Email Address"
								name="email"
								value={email}
								onChange={(e) => handleChange(e)}
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
								value={password}
								onChange={(e) => handleChange(e)}
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
								value={confirmPassword}
								onChange={(e) => handleChange(e)}
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
