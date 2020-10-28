import React, { Fragment } from 'react';
// import logo from './logo.svg';
import './App.css';

//components 
import InputTest from "./components/inputTest.js";
import ListTest from "./components/listTest";
import EditTest from "./components/editTest";
function App() {
  return (
    <Fragment>
      <InputTest/>
      <ListTest/>
      {/* <EditTest/> */}
    </Fragment>
  );
}

export default App;
