import React from "react";
import { Link } from "react-router-dom";

export default function Error() {
	return (
		<div className="jumbotron mt-5">
			<h1>ERROR</h1>
			<p>Oops looks like an error has occurred</p>
			<Link to="/" className="btn btn-primary">
				Click here to return to the home page
			</Link>
		</div>
	);
}
