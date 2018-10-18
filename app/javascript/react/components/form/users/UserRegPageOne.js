import React from 'react';

import Input from '../Input';

const UserRegPageOne = props => {

  var userNameClass, emailClass, passwordClass, passwordConfirmationClass;

  if (props.userNameError) {
    userNameClass = "is-invalid"
  }

  if (props.emailError) {
    emailClass = "is-invalid"
  }

  if (props.passwordError) {
    passwordClass = "is-invalid"
  }

  if (props.passwordConfirmationError) {
    passwordConfirmationClass = "is-invalid"
  }

  return(
    <div id="reg-required" className="form-group">
      <h3 className="text-center">Sign-Up Required Information </h3>
      <Input
        name="userName"
        label="User Name"
        onChange={props.onChange}
        content={props.userName}
        type="text"
        addClass={userNameClass}
      />
      {props.userNameError}
      <Input
        name="email"
        label="Email"
        onChange={props.onChange}
        content={props.email}
        type="text"
        addClass={emailClass}
      />
      {props.emailError}
      <Input
        name="password"
        label="Password"
        onChange={props.onChange}
        content={props.password}
        type="password"
        addClass={passwordClass}
      />
      {props.passwordError}
      <Input
        name="passwordConfirmation"
        label="Password Confirmation"
        onChange={props.onChange}
        content={props.passwordConfirmation}
        type="password"
        addClass={passwordConfirmationClass}
      />
      {props.passwordConfirmationError}
      <div className="form-group actions margin-top-10px">
        <button id="user-registration-button-page-one" className="btn btn-block btn-large btn-dark" onClick={props.handleButtonClick} disabled={props.disabled}>
          <span className="text-large">Next Page (Optional)</span>
        </button>
      </div>
    </div>
  );
};

export default UserRegPageOne;
