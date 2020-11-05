import React, { Fragment, useState, useEffect } from "react";
import { Container, Table, TableHead, TableRow, TableBody, TableCell } from "@material-ui/core";

export default function PCSView() {
	const [caretakers, setCaretakers] = useState([]);

	async function getCaretakers() {
		try {
			const response = await fetch("http://localhost:5002/caretakers/", {
				method: "GET",
				headers: { token: localStorage.token },
			});

			const parseRes = await response.json();
			setCaretakers(parseRes);
		} catch (error) {
			console.error(error.message);
		}
	}

	useEffect(() => {
		getCaretakers();
	}, []);

	return (
		<Fragment>
			<h1>Welcome, PCS Admin</h1>
			<Container>
				<h4>All Caretakers</h4>

				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Email</TableCell>
							<TableCell>Name</TableCell>
							<TableCell>View</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{caretakers.map(function (caretaker) {
							return (
								<TableRow>
									<TableCell>{caretaker.email}</TableCell>
									<TableCell>{caretaker.name}</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</Container>
		</Fragment>
	);
}
