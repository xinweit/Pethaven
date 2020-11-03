import React, { Fragment, useState, useEffect } from "react";
import { Route, Switch, BrowserRouter as Router, Redirect } from "react-router-dom";
import "./App.css";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import UserProfile from "./components/UserProfile";
import Landing from "./components/Landing";

function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const setAuth = (boolean) => {
		setIsAuthenticated(boolean);
	};

	const checkAuthenticated = async () => {
		try {
			const response = await fetch("http://localhost:5002/auth/is-verify", {
				method: "GET",
				headers: { token: localStorage.token },
			});

			const parseRes = await response.json();

			parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
		} catch (error) {
			console.error(error.message);
		}
	};

	useEffect(async () => {
		checkAuthenticated();
	}, []);

	return (
		<Fragment>
			<Router>
				<Switch>
					<Route
						exact
						path="/"
						render={(props) =>
							!isAuthenticated ? (
								<Landing {...props} setAuth={setAuth} />
							) : (
								<Redirect to="/home" />
							)
						}
					/>
					<Route
						path="/signin"
						render={(props) =>
							!isAuthenticated ? (
								<SignIn {...props} setAuth={setAuth} />
							) : (
								<Redirect to="/home" />
							)
						}
					/>
					<Route
						path="/signup"
						render={(props) =>
							!isAuthenticated ? (
								<SignUp {...props} setAuth={setAuth} />
							) : (
								<Redirect to="/home" />
							)
						}
					/>
					<Route
						path="/home"
						render={(props) =>
							isAuthenticated ? (
								<Home {...props} setAuth={setAuth} />
							) : (
								<Redirect to="/signin" />
							)
						}
					/>
				</Switch>
			</Router>
		</Fragment>
	);
}

export default App;
