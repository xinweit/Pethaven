import React, { Fragment, useState } from "react";

const EditBaseDailyPrice = ({ specifies }) => {
	const [thisBaseDailyPrice, setBaseDailyPrice] = useState(specifies);

	const { pet_category, base_daily_price } = thisBaseDailyPrice;

	//edit Pet details function
	const updateBaseDailyPrice = async (e) => {
		e.preventDefault();
		try {
			const body = { pet_category, base_daily_price };
			const response = await fetch("http://localhost:5002/basedailyprice/", {
				method: "PUT",
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

	const handleChange = (e) => {
		setBaseDailyPrice({ ...thisBaseDailyPrice, [e.target.name]: e.target.value });
	};

	return (
		<Fragment>
			<button
				type="button"
				className="btn btn-warning"
				data-toggle="modal"
				data-target={`#id${pet_category}`}
			>
				Edit
			</button>

			<div className="modal" id={`id${pet_category}`}>
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h4 className="modal-title">Edit Base Daily Price</h4>
							<button type="button" className="close" data-dismiss="modal">
								&times;
							</button>
						</div>

						<div className="modal-body">
							<input
								type="text"
								className="form-control"
								value={pet_category}
								name="pet_category"
								disabled
							/>
						</div>

						<div className="modal-body">
							<input
								type="text"
								className="form-control"
								value={base_daily_price}
								name="base_daily_price"
								onChange={(e) => handleChange(e)}
							/>
						</div>

						<div className="modal-footer">
							<button
								type="button"
								className="btn btn-warning"
								data-dismiss="modal"
								onClick={(e) => updateBaseDailyPrice(e)}
							>
								Edit
							</button>
							<button type="button" className="btn btn-danger" data-dismiss="modal">
								Close
							</button>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default EditBaseDailyPrice;
