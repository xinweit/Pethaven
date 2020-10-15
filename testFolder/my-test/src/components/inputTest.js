import React, { Fragment, useState } from 'react';
//usestate == uses hooks

const InputTest = () => {
    //change name & only way to change name is setName
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
            <h1>Input into test_table</h1>
            <form onSubmit={onSubmitForm}>
                <input type="text" value={userName} 
                onChange={e=> setName(e.target.value)} 
                />
                <button>Add</button>
            </form>
         </Fragment>
    );
};


export default InputTest;