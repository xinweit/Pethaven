import { React, Fragment, useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { Link, Grid, Button, TextField, Table, TableRow, TableCell, TableHead, TableBody } from "@material-ui/core";
import "react-datepicker/dist/react-datepicker.css";
import CancelLeave from "./CancelLeave";
import Error from "./Error";

export default function ShowLeaves() {
    const[leaves, SetLeaves] = useState([]);
    const [info, setInfo] = useState({
		name: "",
		email: "",
		type: "",
	});

    const { name, email, type } = info;
    async function getInfo() {
		try {
			const response = await fetch("http://localhost:5002/home/", {
				method: "GET",
				headers: { token: localStorage.token },
			});

			const parseRes = await response.json();
			setInfo(parseRes);
		} catch (error) {
			console.error(error.message);
		}
    }
    const{start_date, end_date} = leaves;
    async function getLeave() {
        try{
            const response = await fetch("http://localhost:5002/leaves", {
                method: "GET",
                headers: { token: localStorage.token },
              });
        
              const parseRes = await response.json();
              SetLeaves(parseRes);
            } catch (error) {
              console.error(error.message);
            }
        }

useEffect(()=>{
    getLeave();
    getInfo();
},[]);
console.log(leaves);
return type === "ft_caretaker" || type === "ft_user" ?(
<Fragment>
<div>
    <h2>These are your leaves </h2>
         </div>
         <table className="table">
            <thead>
            <tr>
                <th>Start date</th>
                <th>end date</th>
                <th>delete </th>
            </tr>
            </thead>
            <tbody>
                {leaves.map(function(data) {
                        return (<tr key={data.start_date, data.end_date}>
                            <td>{new Date(data.start_date).toLocaleDateString("sv-SE",{ year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                            <td>{new Date(data.end_date).toLocaleDateString("sv-SE",{ year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                            <td>
                                <CancelLeave leave={data}/>
                            </td>
                        </tr>);
                    })}
            </tbody>
        </table>
    </Fragment>) : <Error/>
}
