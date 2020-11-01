import React, { Fragment } from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import "./App.css";
import SignInSide from "./components/SignIn";
import SignUp from "./components/SignUp";

function App() {
	return (
		<BrowserRouter>
			<Fragment>
				<Switch>
					<Route path="/signin" component={SignInSide} exact={true} />
					<Route path="/signup" component={SignUp} />
				</Switch>
			</Fragment>
		</BrowserRouter>
	);
}

export default App;
