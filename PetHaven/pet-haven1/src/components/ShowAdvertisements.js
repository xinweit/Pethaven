import React, { Fragment, useEffect, useState } from "react";
import {
	Button,
	Container,
	Table,
	TableHead,
	TableRow,
	TableBody,
	TableCell,
} from "@material-ui/core";
import DeleteAdvertisements from "./DeleteAdvertisement";

export default function ShowAdvertisements() {
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

	const [advertisements, setAdvertisements] = useState([]);
	async function getAdvertisements() {
		try {
			const response = await fetch("http://localhost:5002/advertisements", {
				method: "GET",
				headers: { token: localStorage.token },
			});

			const parseRes = await response.json();

			setAdvertisements(parseRes);
		} catch (error) {
			console.error(error.message);
		}
	}
	useEffect(() => {
		getAdvertisements();
		getInfo();
	}, []);

	return (
		<Fragment>
			<div>
				<h2 className="text-left">Hi {type}, this is a list of all your ads!</h2>
				<Button
					hidden={type === "pcs_admin" || type === "pet_owner"}
					variant="contained"
					onClick={(e) => (window.location = "/advertisements/post")}
				>
					Create Ad
				</Button>
			</div>
			<Container>
				<Table className="table">
					<TableHead>
						<TableRow>
							{type === "pcs_admin" || type === "pet_owner" ? (
								<TableCell>Caretaker Email</TableCell>
							) : null}
							<TableCell>Pet Category</TableCell>
							<TableCell>Starting Date</TableCell>
							<TableCell>Ending Date</TableCell>
							<TableCell>Daily Price</TableCell>
							{type === "pet_owner" ? null : <TableCell>Delete Ad</TableCell>}
						</TableRow>
					</TableHead>
					<TableBody>
						{advertisements.map((data) => (
							<TableRow key={(data.pet_category, data.start_date, data.end_date)}>
								{type === "pcs_admin" || type === "pet_owner" ? (
									<TableCell>{data.email}</TableCell>
								) : null}
								<TableCell>{data.pet_category}</TableCell>
								<TableCell>
									{new Date(data.start_date).toLocaleDateString("sv-SE", {
										year: "numeric",
										month: "2-digit",
										day: "2-digit",
									})}
								</TableCell>
								<TableCell>
									{new Date(data.end_date).toLocaleDateString("sv-SE", {
										year: "numeric",
										month: "2-digit",
										day: "2-digit",
									})}
								</TableCell>
								<TableCell>{data.daily_price}</TableCell>
								<TableCell>
									<DeleteAdvertisements hidden={type === "pet_owner"} ad={data} />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Container>
		</Fragment>
	);
}
