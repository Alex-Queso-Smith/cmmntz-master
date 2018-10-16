import React from 'react';

import Input from '../Input';
import AgeRange from '../AgeRange';
import GenderButton from '../GenderButton';

class UserEditForm extends React.Component {
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
      <div>
        <div id="reg-required" className="form-group">
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
        </div>
        <div id="reg-optional-1" className="form-group">
          <hr />

          <AgeRange
            name="ageRange"
            label="Age Range"
            handleChange={this.props.handleChange}
            content={this.props.ageRange}
            type="text"
          />
          <hr />
          <GenderButton
            name="gender"
            label="Gender"
            handleChange={this.props.handleChange}
            content={this.props.gender}
            type="text"
          />
          <hr />
          <Input
            name="latitude"
            label="Latitude"
            handleChange={this.props.handleChange}
            content={this.props.latitude}
            type="text"
          />
          <Input
            name="longitude"
            label="Longitude"
            handleChange={this.props.handleChange}
            content={this.props.longitude}
            type="text"
          />
          <div className="custom-control custom-checkbox margin-top-10px">
            <input type="checkbox" className="custom-control-input" id='location-opt-out' autoComplete="off" />
            <label className="custom-control-label text-medium" htmlFor='location-opt-out' >None of Your Business</label>
          </div>
        </div>
        <div id="reg-optional-2" className="form-group ">
          <hr />
          <div className="form-group margin-top-10px">
            <label className="text-large" htmlFor="avatar">Avatar</label>
            <br />
            Coming Soon
          </div>
          <input type="hidden"/>
        </div>
      </div>

    )
  }
}


export default UserEditForm;
