import { React, Fragment, useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { Link, Grid, Button, TextField, Table, TableRow, TableCell, TableHead, TableBody } from "@material-ui/core";
import "react-datepicker/dist/react-datepicker.css";

export default function CancelLeave({leave}){
    const [thisLeave, SetLeave] = useState(leave);

    const deleteLeave = async(e) =>{
        e.preventDefault();
        try {
            // alert('enter the condition');
            const start_date = new Date(thisLeave.start_date).toLocaleDateString("sv-SE",{year:'numeric', month: '2-digit', day: '2-digit'});
            const end_date = new Date(thisLeave.end_date).toLocaleDateString("sv-SE",{year:'numeric', month: '2-digit', day: '2-digit'});
            console.log(start_date);
            console.log(end_date);
            const body = {start_date, end_date};
            const response = await fetch("http://localhost/5002/", {
                method:"DELETE",
                headers:{token:localStorage.token,
                "Content-Type":"application/json"},
                body: JSON.stringify(body)
            });
            // alert(body);
            // alert(start_date, end_date);
            window.location = "/showleaves"
        } catch (error) {

        }
    };
    return (
        <Fragment>
            <button type="button" className="btn btn-danger" onClick = {(e) =>deleteLeave(e)}>Delete</button>
        </Fragment>
    );
};