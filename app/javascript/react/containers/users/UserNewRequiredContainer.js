import React from 'react';

import { Input, Checkbox } from '../../components/form/FormComponents';
import { ErrorClassValidation } from '../../util/CoreUtil';

class UserNewRequiredContainer extends React.Component {
  state = {
    privacyPolicyShow: false
  }

  render(){
    var userNameClass, emailClass, passwordClass, passwordConfirmationClass;

    userNameClass = ErrorClassValidation(this.props.userNameError);
    emailClass = ErrorClassValidation(this.props.emailError);
    passwordClass = ErrorClassValidation(this.props.passwordError);
    passwordConfirmationClass = ErrorClassValidation(this.props.passwordConfirmationError);

    var privacyPolicy;
    if (this.state.privacyPolicyShow) {
      privacyPolicy =
      <div className="cf-margin-top-10px">
        <ol>
          <li>
            As is evident in our account creation process, Classibridge does not collect any Personally Identifiable Information (PII), nor do we track your usage of our systems besides the bare amount necessary to ensure our posting and voting processes operate as intended, and any data you upload is owned by you but perpetually licensed without royalties to Classibridge as stated in our Terms of Service (TOS).
          </li>
          <li>
            We will not sell any information that we might have on any of our users to any third party and any advertising that is shown on our platform is targeted only to the content of the articles, but never to characteristics or demographics of your user account.
          </li>
          <li>
            Our systems might automatically gather extra information, such as your IP address and browser type,  in order for the system to work properly but any such information that is unique to you will be deleted from our systems after it is no longer required to provide you with services.
          </li>
          <li>
            We do use cookies to ensure you can stay logged in and able to connect, but the information is not used to track you individually and does not capture what you do when you are not on the website that hosts our widget.
          </li>
          <li>
            Information you posted will be shared only with your express permission, such as when you choose to share something you posted to social media, when there is a danger of imminent and serious harm to a person, or to comply with the law (in which case, we will provide only the information we have available and, if the law provides it, we will attempt to notify you that your information was provided to legal authorities).
          </li>
          <li>
            You can modify or delete your account at any time but please be aware that deleting your account will set the author of content you posted to anonymous unless you go into the comment thread directly and delete any comment you do not want posted.
          </li>
          <li>
            Our servers and data reside in the United States but all users worldwide have the right to contact us via our Contact Us page to request that their personal data is modified or deleted, although, as stated earlier, our systems are configured to not store any PII.
          </li>
        </ol>
      </div>
    }

    var updateDisplayComments = () => {
      this.props.updateDisplay("")
    }

    var updateDisplayLogin = () => {
      this.props.updateDisplay("login")
    }

    return(
      <div id="reg-required" className="form-group">
        <h6 className="cf-text-center">Sign-Up Required Information</h6>
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

        <button onClick={ () => { this.setState({ privacyPolicyShow: !this.state.privacyPolicyShow }) } } className="btn btn-dark btn-md cf-privacy-policy">Privacy Policy</button>
        {privacyPolicy}
        <Checkbox
          name="privacyPolicy"
          onChange={this.props.onChange}
          label="I agree to the privacy policy"
          checked={this.props.privacyPolicy}
        />

        <div className="actions cf-margin-top-10px">
          <button className="btn btn-sm btn-dark cf-float-left" onClick={ updateDisplayComments }>
            Back
          </button>
          <button className="btn btn-sm btn-dark cf-float-right" onClick={this.props.handleButtonClick} disabled={this.props.disabled}>
            Next Page
          </button>
          <button className="btn btn-sm btn-dark cf-float-right cf-margin-right-10px" onClick={ updateDisplayLogin }>
            Login
          </button>
      </div>
      </div>
    )
  }
}

export default UserNewRequiredContainer;
