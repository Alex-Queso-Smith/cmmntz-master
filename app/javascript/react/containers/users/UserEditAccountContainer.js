import React from 'react';

import { CreateErrorElements, ErrorClassValidation } from '../../util/CoreUtil';
import { Input, NukaCarousel as Carousel } from '../../components/form/FormComponents';

class UserEditAccountContainer extends React.Component {
  state = {}

  render(){
    var { userName, email, avatar, saveErrors } = this.props;

    var emailError;
    if (saveErrors.email) { emailError = CreateErrorElements(saveErrors.email, "Email") }
    var emailClass;
    emailClass = ErrorClassValidation(emailError);

    var userNameError;
    if (saveErrors.user_name) { userNameError = CreateErrorElements(saveErrors.user_name, "User Name") }
    var userNameClass;
    userNameClass = ErrorClassValidation(userNameError);

    var selectedAvatar;
    if (avatar) {
      var style = {
        height: '110px',
        width: '110px',
        marginBottom: '10px'
      }

      selectedAvatar =
      <div className="cf-text-center">
        <h5>Selected Avatar</h5>
        <img style={style} src={`${this.props.globalSettings.baseUrl}/images/avatars/${avatar}.png`} />
      </div>
    }

    return(
      <div id="cf-user-edit-account-container">
        <form className="form" id="cf-user-edit-form" onSubmit={this.props.handleSubmit} >
          <Input
            name="userName"
            label="User Name"
            onChange={this.props.handleChange}
            content={userName}
            type="text"
            addClass={userNameClass}
          />
          {userNameError}
          <Input
            name="email"
            label="Email"
            onChange={this.props.handleChange}
            content={email}
            type="text"
            addClass={emailClass}
          />
          {emailError}

          <hr />

          <div className="form-group cf-margin-top-10px">
            <label className="cf-text-medium cf-text-center" htmlFor="avatar">Choose Your Avatar</label>
            <br />
            {selectedAvatar}
            <Carousel
              onChange={this.props.handleAvatarClick}
              baseUrl={this.props.globalSettings.baseUrl}
            />
          </div>

          <hr />

          <div className="form-group actions">
            <button id="user-registration-button" type="submit" className="btn cf-float-right btn-sm btn-dark" value="Submit">
              Update
            </button>
            <button className="btn btn-sm btn-dark float-left" onClick={ this.props.updateDisplay }>
              Close
            </button>
          </div>

        </form>
      </div>
    )
  }
}


export default UserEditAccountContainer;
