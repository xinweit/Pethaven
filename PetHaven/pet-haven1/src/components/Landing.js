import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
	return (
		<div className="jumbotron mt-5">
			<h1>Welcome to the Todo List App</h1>
			<p>Sign In and start building your todo list</p>
			<Link to="/signin" className="btn btn-primary">
				Sign In
			</Link>
			<Link to="/signup" className="btn btn-primary ml-3">
				Sign Up
			</Link>
		</div>
	);
};

export default Landing;
