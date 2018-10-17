import React from 'react';

import Input from '../../components/form/Input';
import Checkbox from '../../components/form/Checkbox'

class SessionLoginContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      userName: '',
      password: '',
      rememberMe: false,
      formInvalid: true,
      loginErrors: {},
      errors: {}
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.validateErrorKeys = this.validateErrorKeys.bind(this);
    this.setStateWithValidation = this.setStateWithValidation.bind(this);

  }

  handleSubmit(event){
    event.preventDefault();
    if (this.validateErrorKeys()) {
      alert("valid");
    } else {
      alert("invalid");
    }

  }

  handleChange(event){
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (
      this.state.userName.length != 0 &&
      this.state.password.length != 0
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
        key != "loginErrors" &&
        key != "rememberMe"
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
    var userNameClass, passwordClass, userNameError, passwordError;

    if (this.state.loginErrors.user_name) {
      userNameError =
      this.state.loginErrors.user_name.map((error) => {
        return(
          <p className="error-text" key={`${error}`}>{`${error}`}</p>
        )
      })
    }

    if (this.state.loginErrors.password) {
      passwordError =
      this.state.loginErrors.password.map((error) => {
        return(
          <p className="error-text" key={`${error}`}>{`${error}`}</p>
        )
      })
    }
    return(
      <form className="form" id="login-form" onSubmit={this.handleSubmit}>
        <h1 className="user-title text-center">Login</h1>
        <Input
          name="userName"
          label="User Name"
          handleChange={this.handleChange}
          content={this.userName}
          type="text"
          addClass={userNameClass}
        />
        {userNameError}
        <Input
          name="password"
          label="Password"
          handleChange={this.handleChange}
          content={this.password}
          type="password"
          addClass={passwordClass}
        />
        {passwordError}
        <Checkbox
          name="rememberMe"
          label="Remember Me"
          handleChange={this.handleChange}
        />
        <div className="form-group actions margin-top-10px">
          <button id="login-button" type="submit" className="btn btn-block btn-large btn-dark" value="Submit" disabled={this.state.formInvalid}>
            <span className="text-large">Login</span>
          </button>
        </div>
      </form>
    )
  }
}
export default SessionLoginContainer;
