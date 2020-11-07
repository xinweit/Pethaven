import React, { useState, useEffect } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";

export default function MenuAppBar({ setAuth, isAuthenticated }) {
	const [name, setName] = useState("");
	const [type, setType] = useState("");

	async function getName() {
		try {
			const response = await fetch("http://localhost:5002/home/", {
				method: "GET",
				headers: { token: localStorage.token },
			});

			const parseRes = await response.json();

			setName(parseRes.name);
			setType(parseRes.type);
		} catch (error) {
			console.error(error.message);
		}
	}

	useEffect(() => {
		getName();
	}, []);

	console.log(type);

	const logout = (e) => {
		e.preventDefault();
		try {
			localStorage.removeItem("token");
			setAuth(false);
			window.location = "/";
			toast.success("Logout Successful");
		} catch (error) {
			console.error(error.message);
		}
	};

	return isAuthenticated ? (
		<Navbar bg="primary" variant="dark">
			<Navbar.Brand href="/home">PetHaven</Navbar.Brand>
			<Nav className="mr-auto">
				<Nav.Link href="/home">Home</Nav.Link>
				<Nav.Link href="/advertisements">Advertisements</Nav.Link>
				<Nav.Link href="/showleaves" hidden={type === "pet_owner" || type === "pcs_admin"}>
					Leaves
				</Nav.Link>
			</Nav>
			<Nav bg="primary" className="justify-content-end">
				<NavDropdown title={name} id="basic-nav-dropdown">
					<NavDropdown.Item href="/user_profile">Profile</NavDropdown.Item>
					<NavDropdown.Item onClick={(e) => logout(e)}>
						{/* <Button onClick={(e) => logout(e)}>Sign out</Button> */}
						Logout
					</NavDropdown.Item>
				</NavDropdown>
				{/* <Navbar.Text>Signed in as: {name}</Navbar.Text> */}
			</Nav>
		</Navbar>
	) : (
		<Navbar bg="primary" variant="dark">
			<Navbar.Brand href="/">PetHaven</Navbar.Brand>
			<Nav className="mr-auto" />
			<Nav bg="primary" className="justify-content-end">
				{/* <Nav.Link href="/">Home</Nav.Link> */}
				<Nav.Link href="/">Sign In</Nav.Link>
				<Nav.Link href="/signup">Sign Up</Nav.Link>
			</Nav>
		</Navbar>
	);
}
