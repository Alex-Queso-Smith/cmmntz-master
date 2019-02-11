import React from 'react';

import { Input, Checkbox } from '../../components/form/FormComponents';
import { CreateErrorElements, ErrorClassValidation, FetchBasic } from '../../util/CoreUtil';

class UserNewRequiredContainer extends React.Component {
  state = {
    privacyPolicyShow: false,
    regErrors: {}
  }

  handlePrivacyPolicyClick = this.handlePrivacyPolicyClick.bind(this);
  handleRequiredValidation = this.handleRequiredValidation.bind(this);

  handlePrivacyPolicyClick(event) {
    event.preventDefault();
    this.setState({ privacyPolicyShow: !this.state.privacyPolicyShow })
  }

  handleRequiredValidation(event){
    event.preventDefault();

    var userValidate = new FormData();

    var { userName, email, password, passwordConfirmation } = this.props;

    userValidate.append("user[user_name]", userName);
    userValidate.append("user[email]", email);
    userValidate.append("user[password]", password);
    userValidate.append("user[password_confirmation]", passwordConfirmation);

    FetchBasic(this, `${this.props.baseUrl}/api/v1/users.json?page=1`, userValidate, 'POST')
    .then(body => {
      if (body.errors) {
        this.setState({ regErrors: body.errors })
      } else {
        this.setState({ regErrors: {} })
        this.props.handleNextClick()
      }
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  render(){
    var userNameClass, emailClass, passwordClass, passwordConfirmationClass, emailError, userNameError, passwordError, passwordConfirmationError, subscribeNewsletter;
    var { regErrors } = this.state;

    userNameClass = ErrorClassValidation(this.state.regErrors.user_name);
    emailClass = ErrorClassValidation(this.state.regErrors.email);
    passwordClass = ErrorClassValidation(this.state.regErrors.password);
    passwordConfirmationClass = ErrorClassValidation(this.state.regErrors.password_confirmation);

    emailError = CreateErrorElements(regErrors.email, "Email");
    userNameError = CreateErrorElements(regErrors.user_name, "User Name");
    passwordError = CreateErrorElements(regErrors.password, "Password");
    passwordConfirmationError = CreateErrorElements(regErrors.password_confirmation, "Password Confirmation");

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

    var updateDisplayComments = (event) => {
      this.props.updateDisplay("", event)
    }

    var updateDisplayLogin = (event) => {
      this.props.updateDisplay("login", event)
    }

    var loginSpanStyle = {
      fontSize: "13px",
      fontWeight: "bold"
    }

    var loginDivStyle = {
      lineHeight: "2"
    }

    return(
      <div id="reg-required" className="form-group">
        <Input
          name="userName"
          placeholder="User Name"
          onChange={this.props.onChange}
          content={this.props.userName}
          type="text"
          addClass={userNameClass}
          focus={true}
        />
        {userNameError}
        <Input
          name="email"
          placeholder="Email"
          onChange={this.props.onChange}
          content={this.props.email}
          type="text"
          addClass={emailClass}
        />
        {emailError}
        <Input
          name="password"
          placeholder="Password"
          onChange={this.props.onChange}
          content={this.props.password}
          type="password"
          addClass={passwordClass}
        />
        {passwordError}
        <Input
          name="passwordConfirmation"
          placeholder="Password Confirmation"
          onChange={this.props.onChange}
          content={this.props.passwordConfirmation}
          type="password"
          addClass={passwordConfirmationClass}
        />
        {passwordConfirmationError}

        <div className="row">
          <div className="col-6 col-sm-5">
            <button onClick={ this.handlePrivacyPolicyClick } className="btn cf-non-fade-button btn-md cf-privacy-policy">Privacy Policy</button>
          </div>

        </div>

        {privacyPolicy}
        <div className="row">
          <div className="col">
            <Checkbox
              name="privacyPolicy"
              onChange={this.props.onChange}
              label="I agree to the privacy policy"
              checked={this.props.privacyPolicy}
              className={"cf-privacy-policy-checkbox"}
              />
          </div>
          <div className="col">
            <Checkbox
              name="subscribeNewsletter"
              onChange={this.props.onChange}
              label="Subscribe to Newsletter"
              checked={this.props.subscribeNewsletter}
              className={"cf-privacy-policy-checkbox"}
              />
          </div>
        </div>
        <hr />

        <div className="actions cf-margin-top-10px">
          {
            // <button className="btn btn-sm cf-dark-button cf-float-left" onClick={ updateDisplayComments }>
            //   Back
            // </button>
          }
          <button className="btn btn-sm cf-dark-button float-left mr-2" onClick={ updateDisplayComments }>
            Close
          </button>
          <button className="btn btn-sm cf-dark-button cf-float-right" onClick={this.handleRequiredValidation} disabled={this.props.disabled}>
            Next Page
          </button>
          <div style={loginDivStyle} className="cf-text-center">
            <span style={loginSpanStyle}>Already Registered?</span>
            <button className="btn btn-sm btn-link cf-margin-right-10px" onClick={ updateDisplayLogin }>
              Login
            </button>
          </div>
      </div>
      </div>
    )
  }
}

export default UserNewRequiredContainer;
