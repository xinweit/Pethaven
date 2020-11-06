import React, { Fragment, useEffect, useState } from 'react';
import {Button} from '@material-ui/core';
import DeleteAdvertisements from "./DeleteAdvertisement";


export default function ShowAdvertisements() {
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
    useEffect(()=>{
        getAdvertisements();
    },[]);
    return(
        <Fragment>
         <div>
            <h2 className="text-left">Hi fulltime caretaker, this is a list of all your ads!</h2>
            <Button variant="contained" onClick={e=>window.location = "/advertisements/post"}>Create Ad</Button>
         </div>
         <table className="table">
            <thead>
            <tr>
                <th>pet category</th>
                <th>starting date</th>
                <th>ending date</th>
                <th>daily price</th>
                <th>delete ad</th>
            </tr>
            </thead>
            <tbody>
                {
                    advertisements.map(data=>(
                        <tr key={data.pet_category, data.start_date, data.end_date}>
                            <td>{data.pet_category}</td>
                            <td>{new Date(data.start_date).toLocaleDateString("sv-SE",{ year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                            <td>{new Date(data.end_date).toLocaleDateString("sv-SE",{ year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                            <td>{data.daily_price}</td>
                            <td>
                            <DeleteAdvertisements ad={data}/>
                            </td>
                        </tr>
                    )
                    )}
            </tbody>
        </table>
    </Fragment>);
}