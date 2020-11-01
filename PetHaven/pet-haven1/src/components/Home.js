import { Button } from "@material-ui/core";
import { React, Fragment } from "react";

export default function Home({ setAuth }) {
	return (
		<Fragment>
			<h1>Home</h1>
			<Button onClick={() => setAuth(false)}>Logout</Button>
		</Fragment>
	);
}
