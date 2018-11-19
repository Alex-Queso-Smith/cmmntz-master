import React from 'react';

import { Input, Checkbox } from '../../components/form/FormComponents';
import { FetchWithPush, CreateErrorElements, CheckInputValidation } from '../../util/CoreUtil';


class SessionLoginContainer extends React.Component {
  state = {
    userName: '',
    password: '',
    rememberMe: false,
    formInvalid: true,
    loginErrors: {}
  }

  handleSubmit = this.handleSubmit.bind(this);
  handleChange = this.handleChange.bind(this);

  componentDidUpdate(prevProps, prevState){
    if (
      prevState.userName != this.state.userName ||
      prevState.password != this.state.password
    ) {
      var { userName, password } = this.state;

      CheckInputValidation(this, [userName, password])
    }
  }

  handleSubmit(event){
    event.preventDefault();
    if (!this.state.formInvalid) {
      var login = new FormData();
      login.append("user_session[user_name]", this.state.userName);
      login.append("user_session[password]", this.state.password);
      login.append("user_session[remember_me]", this.state.rememberMe);

      FetchWithPush(this, '/api/v1/user_sessions.json', '/', 'POST', 'loginErrors', login)
    }
  }

  handleChange(event){
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({ [name]: value })
  }

  render(){
    var userNameClass, passwordClass, userNameError, passwordError;
    var { loginErrors } = this.state

    userNameError = CreateErrorElements(loginErrors.user_name, "User Name")
    passwordError = CreateErrorElements(loginErrors.password, "Password")

    return(
      <div className="login-container">
        <form className="form" id="login-form" onSubmit={this.handleSubmit}>
          <h1 className="user-title text-center">Login</h1>
          <Input
            name="userName"
            label="User Name"
            onChange={this.handleChange}
            content={this.userName}
            type="text"
            addClass={userNameClass}
          />
          {userNameError}
          <Input
            name="password"
            label="Password"
            onChange={this.handleChange}
            content={this.password}
            type="password"
            addClass={passwordClass}
          />
          {passwordError}
          <Checkbox
            name="rememberMe"
            label="Remember Me"
            onChange={this.handleChange}
          />
          <div className="form-group actions margin-top-10px">
            <button id="login-button" type="submit" className="btn btn-block btn-large btn-primary" value="Submit" disabled={this.state.formInvalid}>
              <span className="text-large">Login</span>
            </button>
          </div>
        </form>
      </div>
    )
  }
}

export default SessionLoginContainer;
