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

      FetchWithPush(this, `${this.props.globalSettings.baseUrl}/api/v1/user_sessions.json`, '', 'POST', 'loginErrors', login)
      .then(body =>{
        if (!body.errors) {
          var element = document.getElementById('cf-comments-app');
          element.setAttribute('data-user-id', body.user_id);
          element.setAttribute('data-user-font', `cf-${body.font}`);
          element.setAttribute('data-user-theme', `cf-${body.theme}`);

          this.props.updateDisplay("", event)
          this.props.handleLogin(body.user_id, body.font, body.color)
        }
      })
      .catch(error => console.error(`Error in fetch: ${error.message}`));
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

    var updateDisplayRegister = (event) => {
      this.props.updateDisplay("register", event)
    }

    var updateDisplayComments = (event) => {
      this.props.updateDisplay("", event)
    }

    var registerSpanStyle = {
      fontSize: "13px",
      fontWeight: "bold"
    }

    var redStyle = {
      color: '#C82023'
    }

    var registerButtonStyle = {
      paddingTop: '0px'
    }

    var imageStyle = {
      height: "30px",
      marginTop: "5px"
    }

    return(
      <div id="cf-user-login-container" className="login-container">
        <form className="form" id="login-form" onSubmit={this.handleSubmit}>
          <h3 className="cf-user-title cf-text-center">Login</h3>
          <Input
            name="userName"
            placeholder="User Name"
            onChange={this.handleChange}
            content={this.userName}
            type="text"
            addClass={userNameClass}
          />
          {userNameError}
          <Input
            name="password"
            placeholder="Password"
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

          <hr />

          <div className="form-group actions cf-margin-top-10px">
            <button type="submit" className="btn btn-sm cf-dark-button cf-float-right" value="Submit" disabled={this.state.formInvalid}>
              Login
            </button>
          </div>
        </form>

        <button className="btn btn-sm cf-dark-button float-left mr-2" onClick={ updateDisplayComments }>
          Close
        </button>

        <div className="cf-text-center">
          <div className="cf-logo-box">
            <span style={registerSpanStyle} className="cf-margin-right-5px">New To <img style={imageStyle} src={`${this.props.globalSettings.baseImageUrl}/images/logo_gray.png`} />  ?</span>
            <button style={registerButtonStyle} className="btn btn-sm btn-link cf-margin-right-10px" onClick={ updateDisplayRegister }>
              Register
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default SessionLoginContainer;
