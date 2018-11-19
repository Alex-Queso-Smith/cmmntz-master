import React from 'react';

import { Input, Checkbox } from '../../components/form/FormComponents';
import { FetchWithPush, CreateErrorElements, CheckInputValidation } from '../../util/CoreUtil';

class UserPasswordFormContainer extends React.Component {
  state = {
    password: '',
    passwordConfirmation: '',
    formInvalid: true,
    passwordErrors: {}
  }

  handleSubmit = this.handleSubmit.bind(this);
  handleChange = this.handleChange.bind(this);

  componentDidUpdate(prevProps, prevState){
    if (
      prevState.password != this.state.password ||
      prevState.passwordConfirmation != this.state.passwordConfirmation
    ) {
      var { password, passwordConfirmation } = this.state;

      CheckInputValidation(this, [password, passwordConfirmation])
    }
  }

  handleSubmit(event){
    event.preventDefault();
    if (!this.state.formInvalid) {
      var user = new FormData();
      user.append("user[password]", this.state.password);
      user.append("user[password_confirmation]", this.state.passwordConfirmation);

      FetchWithPush(this, `/api/v1/users/${this.props.match.params.id}.json`, '/', 'PATCH', 'passwordErrors', user)
    }
  }

  handleChange(event){
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({ [name]: value })
  }

  render(){
    var passwordClass, passwordError, passwordConfirmationClass, passwordConfirmationError;
    var { passwordErrors } = this.state

    passwordError = CreateErrorElements(passwordErrors.password, "Password")
    passwordConfirmationError = CreateErrorElements(passwordErrors.password_confirmation, "Password Confirmation")

    return(
      <div className="login-container">
        <form className="form" id="password-form" onSubmit={this.handleSubmit}>
          <h1 className="user-title text-center">Edit Password</h1>
          <Input
            name="password"
            label="Password"
            onChange={this.handleChange}
            content={this.passwordConfirmation}
            type="password"
            addClass={passwordClass}
          />
          {passwordError}
          <Input
            name="passwordConfirmation"
            label="Password Confirmation"
            onChange={this.handleChange}
            content={this.passwordConfirmation}
            type="password"
            addClass={passwordConfirmationClass}
          />
          {passwordConfirmationError}
          <div className="form-group actions margin-top-10px">
            <button id="login-button" type="submit" className="btn btn-block btn-medium btn-primary" value="Submit" disabled={this.state.formInvalid}>
              <span className="text-medium">Update Password</span>
            </button>
          </div>
        </form>
      </div>
    )
  }
}

export default UserPasswordFormContainer;
