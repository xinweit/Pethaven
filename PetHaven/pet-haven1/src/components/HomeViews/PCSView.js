import React, { Fragment, useState, useEffect } from "react";
import {
	Container,
	Table,
	TableHead,
	TableRow,
	TableBody,
	TableCell,
	Button,
	Box,
} from "@material-ui/core";
import EditBaseDailyPrice from "./EditBaseDailyPrice";
import DeleteBaseDailyPrice from "./DeleteBaseDailyPrice";

export default function PCSView() {
	const [caretakers, setCaretakers] = useState([]);

	async function getCaretakers() {
		try {
			const response = await fetch("http://localhost:5002/caretakers", {
				method: "GET",
				headers: { token: localStorage.token },
			});

			const parseRes = await response.json();
			setCaretakers(parseRes);
		} catch (error) {
			console.error(error.message);
		}
	}

	const [baseDailyPrices, setBaseDailyPrices] = useState([]);

	async function getBaseDailyPrices() {
		try {
			const response = await fetch("http://localhost:5002/basedailyprice", {
				method: "GET",
				headers: { token: localStorage.token },
			});
			const parseRes = await response.json();
			setBaseDailyPrices(parseRes);
		} catch (error) {
			console.error(error.message);
		}
	}

	useEffect(() => {
		getCaretakers();
		getBaseDailyPrices();
	}, []);

	return (
		<Fragment>
			<h1>Welcome, PCS Admin</h1>
			<Box height={30} />
			<Container>
				<h4>All Caretakers</h4>

				<Table id="table1">
					<TableHead>
						<TableRow>
							<TableCell>Email</TableCell>
							<TableCell>Name</TableCell>
							<TableCell>Type</TableCell>
							<TableCell>Salary($)</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{caretakers.map(function (caretaker) {
							return (
								<TableRow key={`id${caretaker.email}`}>
									<TableCell>{caretaker.email}</TableCell>
									<TableCell>{caretaker.name}</TableCell>
									<TableCell>{caretaker.type}</TableCell>
									<TableCell>
										{Math.round((caretaker.salary + Number.EPSILON) * 100) /
											100}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</Container>
			<Box height={30} />
			<Container>
				<h4>
					Daily Price Per Category
				</h4>
				<Button
						variant="contained"
						color="primary"
						onClick={(e) => (window.location = "/create_basedailyprice")}
					>
						Create
					</Button>
				<Table id="table2">
					<TableHead>
						<TableRow>
							<TableCell>Pet Category</TableCell>
							<TableCell>Base Daily Price</TableCell>
							<TableCell>PCS Admin</TableCell>
							<TableCell>Edit</TableCell>
							<TableCell>Delete</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{baseDailyPrices.map(function (obj) {
							return (
								<TableRow key={`id${obj.pet_category}`}>
									<TableCell>{obj.pet_category}</TableCell>
									<TableCell>{obj.base_daily_price}</TableCell>
									<TableCell>{obj.pcs_email}</TableCell>
									<TableCell>
										<EditBaseDailyPrice specifies={obj} />
									</TableCell>
									<TableCell>
										<DeleteBaseDailyPrice specifies={obj} />
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</Container>
		</Fragment>
	);
}
