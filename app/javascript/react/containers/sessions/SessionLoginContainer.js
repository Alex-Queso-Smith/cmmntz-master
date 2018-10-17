import React from 'react';

import Input from '../../components/form/Input';

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

  handleChange(){
    this.setState({
      [event.target.userNameClassNname]: event.target.value

  }

  render(){
    var userNameClass, passwordClass;
    return(
      <form className="form" id="login-form" onSubmit={this.handleSubmit}>
        <h1 className="user-title text-center">Login</h1>
        <Input
          name="userName"
          label="User Name"
          handleChange={this.props.handleChange}
          content={this.props.userName}
          type="text"
          addClass={userNameClass}
        />
        <Input
          name="password"
          label="Password"
          handleChange={this.props.handleChange}
          content={this.props.password}
          type="password"
          addClass={passwordClass}
        />
        <label>rememberMe</label>
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
