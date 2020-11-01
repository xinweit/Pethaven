import { Button } from "@material-ui/core";
import { React, Fragment, useState, useEffect } from "react";

export default function Home({ setAuth }) {
	const [name, setName] = useState("");

	async function getName() {
		try {
			const response = await fetch("http://localhost:5002/home/", {
				method: "GET",
				headers: { token: localStorage.token },
			});

			const parseRes = await response.json();

			setName(parseRes.name);
		} catch (error) {
			console.error(error.message);
		}
	}

	const logout = (e) => {
		e.preventDefault();
		localStorage.removeItem("token");
		setAuth(false);
	};

	useEffect(() => {
		getName();
	}, []);

	return (
		<Fragment>
			<h1>Home {name}</h1>
			<Button onClick={(e) => logout(e)}>Logout</Button>
		</Fragment>
	);
}
