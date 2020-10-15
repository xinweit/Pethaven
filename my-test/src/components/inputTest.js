import React, { Fragment, useState } from 'react';
//usestate == uses hooks

const InputTest = () => {
    //change name & only way to change name is setName
    //using react webhooks
    const [userName, setName] = useState("");

    const onSubmitForm = async(e) => {
        e.preventDefault();
        try {
            //packing it up in a const
           const body = {userName};
           //fetch by default makes a get request 
           const res2 = await fetch("http://localhost:5000/test", {
               "method" : "POST",
               "headers" : { "Content-Type": "application/json" },
               "body": JSON.stringify(body)
           }); 

           //test
           console.log(res2);
           window.location = "/";
        } catch (error) {
            console.error(error);
        }
    };
    return (
         <Fragment>
            <h1 className="text-center mt-5">Input into test_table</h1>
            <div>
                 <form className ="d-flex mt-5" onSubmit={onSubmitForm}>
                <input type="text" className="form-control" value={userName} 
                onChange={e=> setName(e.target.value)} 
                />
                <button className="btn btn-success">Add</button>
            </form>
            </div>
         </Fragment>
    );
};


export default InputTest;