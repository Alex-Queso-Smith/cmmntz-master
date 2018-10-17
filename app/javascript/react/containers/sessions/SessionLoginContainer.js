import React from 'react';

import Input from '../../components/form/Input';
import Checkbox from '../../components/form/Checkbox'

class SessionLoginContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      userName: '',
      password: '',
      rememberMe: 0,
      loginErrors: {},
      errors: {}
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

  }

  handleSubmit(){

  }

  handleChange(event){
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({ [name]: value })
  }

  render(){
    var userNameClass, passwordClass;
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
        <Input
          name="password"
          label="Password"
          handleChange={this.handleChange}
          content={this.password}
          type="password"
          addClass={passwordClass}
        />
        <Checkbox
          name="rememberMe"
          label="Remember Me"
          handleChange={this.handleChange}
        />
        <div className="form-group actions margin-top-10px">
          <button id="login-button" type="submit" className="btn btn-block btn-large btn-dark" value="Submit">
            <span className="text-large">Login</span>
          </button>
        </div>
      </form>
    )
  }
}
export default SessionLoginContainer;
