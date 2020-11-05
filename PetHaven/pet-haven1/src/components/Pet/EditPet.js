import React, { Fragment, useState } from "react";

const EditPet = ({ pet }) => {
    const [thisPet, setPet] = useState(pet);

    const { pet_name, special_requirements, pet_category, pet_age } = thisPet;

    //edit Pet details function
    const updatePet = async (e) => {
        e.preventDefault();
        try {
            const body = { pet_name, special_requirements, pet_category, pet_age };
            const response = await fetch(`http://localhost:5002/pets`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    token: localStorage.token
                },
                body: JSON.stringify(body),
            });
            console.log(response);
            window.location = "/user_profile"
        } catch (err) {
            console.error(err.message);
        }
    };

    const handleChange = (e) => {
        setPet({ ...thisPet, [e.target.name]: e.target.value });
    };

    return (
        <Fragment>
            <button
                type="button"
                className="btn btn-warning"
                data-toggle="modal"
                data-target={`#id${pet.pet_name}`}
            >
                Edit
			</button>

            <div className="modal" id={`id${pet.pet_name}`}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Edit pet details</h4>
                            <button type="button" className="close" data-dismiss="modal">
                                &times;
							</button>
                        </div>

                        <div className="modal-body">
                            <input
                                type="text"
                                className="form-control"
                                value={pet_name}
                                name="pet_name"
                                disabled
                                onChange={(e) => handleChange(e)}
                            />
                        </div>

                        <div className="modal-body">
                            <input
                                type="text"
                                className="form-control"
                                value={special_requirements}
                                name="special_requirements"
                                onChange={(e) => handleChange(e)}
                            />
                        </div>

                        <div className="modal-body">
                            <input
                                type="text"
                                className="form-control"
                                value={pet_category}
                                name="pet_category"
                                onChange={(e) => handleChange(e)}
                            />
                        </div>

                        <div className="modal-body">
                            <input
                                type="text"
                                className="form-control"
                                value={pet_age}
                                name="pet_age"
                                onChange={(e) => handleChange(e)}
                            />
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-warning"
                                data-dismiss="modal"
                                onClick={(e) => updatePet(e)}
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

export default EditPet;
