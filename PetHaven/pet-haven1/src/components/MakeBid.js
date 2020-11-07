// import React, { Fragment, useState } from "react";

import React, { Fragment, useEffect, useState } from "react";

export default function MakeBid({ advert, hidden, index }) {
	// const [thisadvert, setBid] = useState(advert);
	const [thisBid, setBid] = useState({
		transfer_method: "",
		bid_price: "",
		payment_method: "",
		pet_name: "",
	});

	const { pet_category, start_date, end_date, email } = advert;

	const { transfer_method, bid_price, payment_method, pet_name } = thisBid;
	// const { transfer_method, bid_price, payment_method, rating_given, is_successful, }

	const addBidDetails = async (e) => {
		e.preventDefault();
		try {
			const body = {
				transfer_method,
				bid_price,
				payment_method,
				start_date,
				end_date,
				pet_category,
				email,
				pet_name,
			};
			const res = await fetch("http://localhost:5002/bids", {
				method: "POST",
				headers: {
					"Content-type": "application/json",
					token: localStorage.token,
				},
				body: JSON.stringify(body),
			});
			window.location = "/advertisements";
		} catch (error) {
			console.log(error.message);
		}
	};

	const handleChange = (e) => {
		setBid({ ...thisBid, [e.target.name]: e.target.value });
	};

	return !hidden ? (
		<Fragment>
			<button
				type="button"
				className="btn btn-primary"
				data-toggle="modal"
				data-target={`#id${index}`}
			>
				Make bid
			</button>

			<div className="modal" id={`id${index}`}>
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h4 className="modal-title">Add bit details</h4>
							<button type="button" className="close" data-dismiss="modal">
								&times;
							</button>
						</div>

						<div className="modal-body">
							<label>bid price</label>
							<input
								type="text"
								className="form-control"
								value={bid_price}
								name="bid_price"
								onChange={(e) => handleChange(e)}
							/>
						</div>

						<div className="modal-body">
							<label>transfer method</label>
							<input
								required
								type="text"
								className="form-control"
								value={transfer_method}
								name="transfer_method"
								onChange={(e) => handleChange(e)}
							/>
						</div>

						<div className="modal-body">
							<label>payment method</label>
							<input
								type="text"
								className="form-control"
								value={payment_method}
								name="payment_method"
								onChange={(e) => handleChange(e)}
							/>
						</div>

						<div className="modal-body">
							<label> pet name </label>
							<input
								type="text"
								className="form-control"
								value={pet_name}
								name="pet_name"
								onChange={(e) => handleChange(e)}
							/>
						</div>

						<div className="modal-footer">
							<button
								type="button"
								className="btn btn-warning"
								data-dismiss="modal"
								onClick={(e) => addBidDetails(e)}
							>
								add details
							</button>
							<button type="button" className="btn btn-danger" data-dismiss="modal">
								Close
							</button>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	) : null;
}
