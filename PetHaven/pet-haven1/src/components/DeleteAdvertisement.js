import React, { Fragment, useEffect, useState } from "react";

export default function DeleteAdvertisements({ ad, hidden }) {
	const [thisad, setAdvertisements] = useState(ad);

	const { pet_category } = thisad;

	const deleteAd = async (e) => {
		e.preventDefault();
		try {
			const start_date = new Date(thisad.start_date).toLocaleDateString("sv-SE", {
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
			});
			const end_date = new Date(thisad.end_date).toLocaleDateString("sv-SE", {
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
			});
			const body = { pet_category, start_date, end_date };
			console.log(body);
			const res = await fetch("http://localhost:5002/advertisements", {
				method: "DELETE",
				headers: { token: localStorage.token, "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			window.location = "/advertisements";
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Fragment>
			<button
				hidden={hidden}
				type="button"
				className="btn btn-danger"
				onClick={(e) => deleteAd(e)}
			>
				Delete
			</button>
		</Fragment>
	);
}
