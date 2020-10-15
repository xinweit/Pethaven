import React, { Fragment, useState } from 'react';

const EditTest = ({data}) =>{
    const [username, setUserName] = useState(data.username);
    //updateUserName function 
    const updateUserName = async e =>{
        e.preventDefault();
        try {
            const body = { username };
            const res = await fetch(`http://localhost:5000/test/${data.username}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(body)
            });
            // console.log(res);
            //to update data live on the page
            window.location = "/";
        } catch (error) {
            console.error(error.message);
        }
    }
    return (
        <Fragment>
            {/* <h2>Edit test_table</h2> */}
            <button type="button" class="btn btn-warning" data-toggle="modal" 
            data-target={`#id${data.username}`}>
            Edit
            </button>
            {/* { id = id+username} */}
            <div class="modal" id={`id${data.username}`}
            onClick={()=> setUserName(data.username)}>

            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">Edit Data</h4>
                    <button type="button" class="close" data-dismiss="modal" 
                    onClick={()=> setUserName(data.username)}>
                        &times;
                    </button>
                </div>
                <div class="modal-body">
                    <input type="text" className="form-control" value={username} 
                    onChange={e=>setUserName(e.target.value)}/>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-warning" data-dismiss="modal"
                    onClick={e=>updateUserName(e)}>Edit</button>
                    <button type="button" class="btn btn-danger" data-dismiss="modal" onClick={()=> setUserName(data.username)}>Close</button>
                </div>
                </div>
            </div>
            </div>
        </Fragment>
    );
}

export default EditTest;