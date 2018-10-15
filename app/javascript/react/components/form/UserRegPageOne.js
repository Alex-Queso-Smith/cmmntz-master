import React from 'react';

import Input from './Input';

const UserRegPageOne = props => {
  return(
    <div id="reg-required" className="form-group">
      <h3 className="text-center">Sign-Up Required Information </h3>
      <Input
        name="userName"
        label="User Name"
        handleChange={props.handleChange}
        content={props.userName}
        type="text"
      />
      {props.userNameError}
      <Input
        name="email"
        label="Email"
        handleChange={props.handleChange}
        content={props.email}
        type="text"
      />
      {props.emailError}
      <Input
        name="password"
        label="Password"
        handleChange={props.handleChange}
        content={props.password}
        type="password"
      />
      {props.passwordError}
      <Input
        name="passwordConfirmation"
        label="Password Confirmation"
        handleChange={props.handleChange}
        content={props.passwordConfirmation}
        type="password"
      />
      {props.passwordConfirmationError}
      <div className="form-group actions margin-top-10px">
        <button id="user-registration-button-page-one" className="btn btn-block btn-large btn-dark" onClick={props.handleButtonClick} disabled={props.disabled}>
          <span className="text-large">Next Page (Optional)</span>
        </button>
      </div>
    </div>
  )
}

export default UserRegPageOne;
