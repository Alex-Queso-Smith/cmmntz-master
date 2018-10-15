import React from 'react';

import Input from './Input';

class UserRegPageOne extends React.Component {
  constructor(props){
    super(props);
    this.state = {}
  }
  render(){
    var userNameClass, emailClass, passwordClass, passwordConfirmationClass;

    if (this.props.userNameError) {
      userNameClass = "is-invalid"
    }

    if (this.props.emailError) {
      emailClass = "is-invalid"
    }

    if (this.props.passwordError) {
      passwordClass = "is-invalid"
    }

    if (this.props.passwordConfirmationError) {
      passwordConfirmationClass = "is-invalid"
    }

    return(
      <div id="reg-required" className="form-group">
        <h3 className="text-center">Sign-Up Required Information </h3>
        <Input
          name="userName"
          label="User Name"
          handleChange={this.props.handleChange}
          content={this.props.userName}
          type="text"
          addClass={userNameClass}
        />
        {this.props.userNameError}
        <Input
          name="email"
          label="Email"
          handleChange={this.props.handleChange}
          content={this.props.email}
          type="text"
          addClass={emailClass}
        />
        {this.props.emailError}
        <Input
          name="password"
          label="Password"
          handleChange={this.props.handleChange}
          content={this.props.password}
          type="password"
          addClass={passwordClass}
        />
        {this.props.passwordError}
        <Input
          name="passwordConfirmation"
          label="Password Confirmation"
          handleChange={this.props.handleChange}
          content={this.props.passwordConfirmation}
          type="password"
          addClass={passwordConfirmationClass}
        />
        {this.props.passwordConfirmationError}
        <div className="form-group actions margin-top-10px">
          <button id="user-registration-button-page-one" className="btn btn-block btn-large btn-dark" onClick={this.props.handleButtonClick} disabled={this.props.disabled}>
            <span className="text-large">Next Page (Optional)</span>
          </button>
        </div>
      </div>
    )
  }
}

export default UserRegPageOne;
