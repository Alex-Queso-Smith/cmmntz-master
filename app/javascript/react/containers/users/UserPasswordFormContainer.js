import React from 'react';

import Input from '../../components/form/Input';
import Checkbox from '../../components/form/Checkbox'


class UserPasswordFormContainer extends React.Component {
  state = {
    password: '',
    passwordConfirmation: '',
    formInvalid: true,
    passwordErrors: {},
    errors: {}
  }

  handleSubmit = this.handleSubmit.bind(this);
  handleChange = this.handleChange.bind(this);
  validateErrorKeys = this.validateErrorKeys.bind(this);
  setStateWithValidation = this.setStateWithValidation.bind(this);
  savePassword = this.savePassword.bind(this);

  handleSubmit(event){
    event.preventDefault();
    if (this.validateErrorKeys()) {
      var login = new FormData();
      login.append("user[password]", this.state.password);
      login.append("user[password_confirmation]", this.state.passwordConfirmation);

      this.savePassword(login);
    }
  }

  savePassword(payload){
    fetch(`/api/v1/users/${this.props.match.params.id}.json`, {
      method: 'PATCH',
      credentials: 'same-origin',
      body: payload
    })
    .then(response => {
       if(response.ok || response.status == 422){
         return response
       } else {
         let errorMessage = `${response.status} (${response.statusText})`,
             error = new Error(errorMessage)
         throw(error)
       }
     })
     .then(response => response.json())
     .then(body => {
       if (body.errors) {
         this.setState({ passwordErrors: body.errors})
       } else {
         this.props.history.push('/')
       }
     })
     .catch(error => console.error(`Error in fetch: ${error.message}`));
   }

  handleChange(event){
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (
      this.state.password.length != 0 &&
      this.state.passwordConfirmation.length != 0
    ) {
      this.setStateWithValidation(false, name, value)
    } else {
      this.setStateWithValidation(true, name, value)
    }
  }

  setStateWithValidation(valid, name, value){
    this.setState({
      formInvalid: valid,
      [name]: value
    })
  }

  validateErrorKeys(){
    Object.keys(this.state).forEach(key => {
      if (
        key != "errors" &&
        key != "passwordErrors" &&
        key != "formInvalid"
      ) {
        this.validateEntry(key, this.state[key])
      }
    })
    return Object.keys(this.state.errors).length == 0
  }

  validateEntry(name, fieldValue){
    if (fieldValue.trim() === '') {
      var newError = { [name]: `You must enter a ${name}`};
      this.setState({ errors: Object.assign(this.state.errors, newError) });
      return false;
    } else {
      var errorState = this.state.errors;
      delete errorState[name];
      this.setState({ errors: errorState });
      return true;
    }
  }

  render(){
    var passwordClass, passwordError, passwordConfirmationClass, passwordConfirmationError;

    if (this.state.passwordErrors.password) {
      passwordError =
      this.state.passwordErrors.password.map((error) => {
        return(
          <p className="error-text" key={`${error}`}>{`${error}`}</p>
        )
      })
    }

    if (this.state.passwordErrors.password_confirmation) {
      passwordConfirmationError =
      this.state.passwordErrors.password_confirmation.map((error) => {
        return(
          <p className="error-text" key={`${error}`}>{`${error}`}</p>
        )
      })
    }
    return(
      <form className="form" id="password-form" onSubmit={this.handleSubmit}>
        <h1 className="user-title text-center">Edit Password</h1>
        <Input
          name="password"
          label="Password"
          handleChange={this.handleChange}
          content={this.passwordConfirmation}
          type="password"
          addClass={passwordClass}
        />
        {passwordError}
        <Input
          name="passwordConfirmation"
          label="Password Confirmation"
          handleChange={this.handleChange}
          content={this.passwordConfirmation}
          type="password"
          addClass={passwordConfirmationClass}
        />
        {passwordConfirmationError}
        <div className="form-group actions margin-top-10px">
          <button id="login-button" type="submit" className="btn btn-block btn-large btn-dark" value="Submit" disabled={this.state.formInvalid}>
            <span className="text-large">Update Password</span>
          </button>
        </div>
      </form>
    )
  }
}

export default UserPasswordFormContainer;
