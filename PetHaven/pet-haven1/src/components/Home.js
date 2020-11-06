import { React, Fragment, useState, useEffect } from "react";
import PCSView from "./HomeViews/PCSView";

export default function Home() {
	const [info, setInfo] = useState({
		name: "",
		email: "",
		type: "",
	});

	const { name, email, type } = info;

	async function getInfo() {
		try {
			const response = await fetch("http://localhost:5002/home/", {
				method: "GET",
				headers: { token: localStorage.token },
			});

			const parseRes = await response.json();
			setInfo(parseRes);
		} catch (error) {
			console.error(error.message);
		}
	}

	useEffect(() => {
		getInfo();
	}, []);

	return type === "pet_owner" ? (
		<Fragment>
			<h1>Welcome, Pet Owner</h1>
		</Fragment>
	) : type === "ft_caretaker" ? (
		<Fragment>
			<h1>Welcome, Full Time Caretaker</h1>
		</Fragment>
	) : type === "pt_caretaker" ? (
		<Fragment>
			<h1>Welcome, Part Time Caretaker</h1>
		</Fragment>
	) : type === "ft_user" ? (
		<Fragment>
			<h1>Welcome, Full Time User</h1>
		</Fragment>
	) : type === "pt_user" ? (
		<Fragment>
			<h1>Welcome, Part Time User</h1>
		</Fragment>
	) : type === "pcs_admin" ? (
		<PCSView />
	) : (
		<Fragment>
			<h1>Loading...</h1>
		</Fragment>
	);
}
