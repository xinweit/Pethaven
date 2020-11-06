import React, { Fragment, useState, useEffect } from "react";
import { Route, Switch, BrowserRouter as Router, Redirect } from "react-router-dom";
import "./App.css";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import UserProfile from "./components/UserProfile";
import Landing from "./components/Landing";
import MenuAppBar from "./components/MenuAppBar";
import Error from "./components/Error";
import CreatePet from "./components/Pet/CreatePet";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import CreateBaseDailyPrice from "./components/HomeViews/CreateBaseDailyPrice";

toast.configure();

function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const setAuth = (boolean) => {
		setIsAuthenticated(boolean);
	};

	async function checkAuthenticated() {
		try {
			let response = fetch("http://localhost:5002/auth/is-verify", {
				method: "GET",
				headers: { token: localStorage.token },
			});

			let result = await response;

			const parseRes = await result.json();

			parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
		} catch (error) {
			console.error(error.message);
		}
	}

	useEffect(() => {
		checkAuthenticated();
	}, []);

	return (
		<Fragment>
			<MenuAppBar setAuth={setAuth} isAuthenticated={isAuthenticated} />
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
						exact
						path="/error"
						render={(props) => <Error {...props} setAuth={setAuth} />}
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
								<Home
									{...props}
									isAuthenticated={isAuthenticated}
									setAuth={setAuth}
								/>
							) : (
								<Redirect to="/" />
							)
						}
					/>
					<Route
						path="/user_profile"
						render={(props) =>
							isAuthenticated ? (
								<UserProfile
									{...props}
									isAuthenticated={isAuthenticated}
									setAuth={setAuth}
								/>
							) : null
						}
					/>
					<Route
						path="/create_pet"
						render={(props) =>
							isAuthenticated ? (
								<CreatePet
									{...props}
									isAuthenticated={isAuthenticated}
									setAuth={setAuth}
								/>
							) : null
						}
					/>
					<Route
						path="/create_basedailyprice"
						render={(props) =>
							isAuthenticated ? (
								<CreateBaseDailyPrice
									{...props}
									isAuthenticated={isAuthenticated}
									setAuth={setAuth}
								/>
							) : null
						}
					/>
					<Redirect from="*" to="/error" />
				</Switch>
			</Router>
		</Fragment>
	);
}

export default App;
