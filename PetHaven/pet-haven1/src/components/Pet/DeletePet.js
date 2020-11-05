import React, { Fragment, useState } from "react";

const EditPet = ({ pet }) => {
    const [thisPet] = useState(pet);

    const { pet_name, special_requirements, pet_category, pet_age } = thisPet;

    //edit Pet details function
    const deletePet = async (e) => {
        e.preventDefault();
        try {
            const body = { pet_name };
            const response = await fetch(`http://localhost:5002/pets`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    token: localStorage.token
                },
                body: JSON.stringify(body),
            });
            //console.log(response);
            window.location = "/user_profile"
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <Fragment>
            <button
                type="button"
                className="btn btn-danger"
                onClick={e => deletePet(e)}
            >
                Delete
			</button>


        </Fragment>
    );
};

export default EditPet;
