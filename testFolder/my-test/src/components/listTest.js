import React, { Fragment, useEffect, useState } from 'react';

//component
import EditTest from "./editTest"; 
const ListTest = () => {
    const [testData, setTestData] = useState([]);
    
    //delete data function
    const deleteData = async (id) => {
        try {
          //get the data to delete
          const dataToBeDeleted = await fetch(`http://localhost:5000/test/${id}`, {
              method: "DELETE"
          });
          console.log(dataToBeDeleted);
          //to immediately change state with deleted data without refreshing page 
          setTestData(testData.filter(data=>data.username !== id)); 
        } catch (error) {
            console.error(error.message);
        }
    }

    const getTestData = async () =>{
        try {
            //fetch is a GET request by default
            const res = await fetch("http://localhost:5000/test");
            //need to await for getting the data
            const jsonData = await res.json();
            //only way to change state
            setTestData(jsonData);
            //test
            // console.log(jsonData);
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        getTestData();
    }, []); //make it do only one request instead of multple ones
    //test
    console.log(testData);
    return(
     <Fragment>
         <h2 className="text-center">Displaying test_table</h2>
         <table class="table">
            <thead>
            <tr>
                <th>username</th>
                <th>edit</th>
                <th>delete</th>
            </tr>
            </thead>
            <tbody>
                {/*            
                <tr>
                <td>John</td>
                <td>Doe</td>
                <td>john@example.com</td>
            </tr>
             */}
             {testData.map(data => (
                 //to uniquely identify the row (primary key)
                 <tr key={data.username}>
                     <td>{data.username}</td>
                     {/* react prop */}
                     <td><EditTest data ={data}/></td>
                     <td>
                         <button className = "btn btn-danger" onClick={()=> deleteData(data.username)}>Delete</button>
                     </td>
                 </tr>
             ))}
            </tbody>
        </table>
    </Fragment>);
}

export default ListTest;