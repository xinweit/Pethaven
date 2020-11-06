import React, { Fragment, useState } from "react";

const DeleteBaseDailyPrice = ({ specifies }) => {
	const [thisBaseDailyPrice, setBaseDailyPrice] = useState(specifies);

	const { pet_category, base_daily_price } = thisBaseDailyPrice;

	//edit Pet details function
	const deleteBaseDailyPrice = async (e) => {
		e.preventDefault();
		try {
			const body = { pet_category, base_daily_price };
			const response = await fetch("http://localhost:5002/basedailyprice/", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					token: localStorage.token,
				},
				body: JSON.stringify(body),
			});
			//console.log(response);
			window.location = "/home";
		} catch (err) {
			console.error(err.message);
		}
	};

	return (
		<Fragment>
			<button
				type="button"
				className="btn btn-danger"
				onClick={(e) => deleteBaseDailyPrice(e)}
			>
				Delete
			</button>
		</Fragment>
	);
};

export default DeleteBaseDailyPrice;
