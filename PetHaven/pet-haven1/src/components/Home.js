import { React, Fragment, useState, useEffect } from "react";
import Link from "@material-ui/core/Link";

export default function Home({ setAuth, isAuthenticated }) {
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

	useEffect(() => {
		getName();
	}, []);

	return (
		<Fragment>
			<h1>Home</h1>
			<Link href="/user_profile">Profile</Link>
		</Fragment>
	);
}
