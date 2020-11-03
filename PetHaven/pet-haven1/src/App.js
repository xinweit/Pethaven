import React, { Fragment } from 'react';
import './App.css';
import SignInSide from './components/SignIn';
import SignUp from './components/SignUp';
import MenuAppBar from './components/TopBar';
import ControlledOpenSelect from './components/DropDownType';

function App() {
  return (
    <Fragment>
      {/* <MenuAppBar /> */}
      <SignUp />
      {/* <SignInSide/> */}
    </Fragment>
  );
}

export default App;
