import React from 'react';

import { Input, Checkbox } from '../../components/form/FormComponents';
import { ErrorClassValidation } from '../../util/CoreUtil';

class UserNewRequiredContainer extends React.Component {
  state = {}

  render(){
    var userNameClass, emailClass, passwordClass, passwordConfirmationClass;

    userNameClass = ErrorClassValidation(this.props.userNameError);
    emailClass = ErrorClassValidation(this.props.emailError);
    passwordClass = ErrorClassValidation(this.props.passwordError);
    passwordConfirmationClass = ErrorClassValidation(this.props.passwordConfirmationError);

    return(
      <div id="reg-required" className="form-group">
        <h6 className="text-center">Sign-Up Required Information</h6>
        <Input
          name="userName"
          label="User Name"
          onChange={this.props.onChange}
          content={this.props.userName}
          type="text"
          addClass={userNameClass}
        />
        {this.props.userNameError}
        <Input
          name="email"
          label="Email"
          onChange={this.props.onChange}
          content={this.props.email}
          type="text"
          addClass={emailClass}
        />
        {this.props.emailError}
        <Input
          name="password"
          label="Password"
          onChange={this.props.onChange}
          content={this.props.password}
          type="password"
          addClass={passwordClass}
        />
        {this.props.passwordError}
        <Input
          name="passwordConfirmation"
          label="Password Confirmation"
          onChange={this.props.onChange}
          content={this.props.passwordConfirmation}
          type="password"
          addClass={passwordConfirmationClass}
        />
        {this.props.passwordConfirmationError}

        <h5 className="privacy-policy">Privacy Policy</h5>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec luctus odio nec magna consequat, et cursus turpis placerat. Sed at tristique nisl, in pharetra urna. Vestibulum nec tortor eget velit eleifend ullamcorper eget at purus. Fusce consequat magna tellus, vitae laoreet tortor aliquam quis. Pellentesque finibus diam lacinia, euismod libero vitae, faucibus risus. Etiam a nunc sed quam semper eleifend vitae et ex. </p>

       <Checkbox
         name="privacyPolicy"
         onChange={this.props.onChange}
         label="I agree to the privacy policy"
       />

        <div className="row actions margin-top-10px text-center">
          <div className="col-12">
            <div className="float-right">
              <button id="user-registration-button-next" className="btn btn-sm btn-dark" onClick={this.props.handleButtonClick} disabled={this.props.disabled}>
                Next Page
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default UserNewRequiredContainer;
