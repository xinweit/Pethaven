import React, { Fragment, useState } from "react";
import { Route, Switch, BrowserRouter as Router, Redirect } from "react-router-dom";
import "./App.css";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Home from "./components/Home";

function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const setAuth = (boolean) => {
		setIsAuthenticated(boolean);
	};

	return (
		<Fragment>
			<Router>
				<Switch>
					<Route
						exact
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
						exact
						path="/signup"
						render={(props) =>
							!isAuthenticated ? (
								<SignUp {...props} setAuth={setAuth} />
							) : (
								<Redirect to="/signin" />
							)
						}
					/>
					<Route
						exact
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
