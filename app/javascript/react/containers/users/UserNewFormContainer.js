import React from 'react';

import Input from '../../components/form/Input';
import GenderSelector from '../../components/form/GenderSelector';
import AgeRangeSelector from '../../components/form/AgeRangeSelector';
import UserRegPageOne from '../../components/form/users/UserRegPageOne';
import UserRegPageTwo from '../../components/form/users/UserRegPageTwo';
import UserRegPageThree from '../../components/form/users/UserRegPageThree';
import { FetchWithPush, CreateErrorElements, SetStateWithValidation } from '../../util/CoreUtil';

class UserNewFormContainer extends React.Component {
  state = {
    userName: '',
    password: '',
    passwordConfirmation: '',
    email: '',
    ageRange: '',
    latitude: '',
    longitude: '',
    gender: '',
    currentPage: 1,
    formInvalid: true,
    registrationErrors: {}
  }

  handleChange = this.handleChange.bind(this);
  handleSubmit = this.handleSubmit.bind(this);
  handleNextClick = this.handleNextClick.bind(this);
  handleBackClick = this.handleBackClick.bind(this);

  handleChange(event){
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (
      this.state.userName.length != 0 &&
      this.state.email.length != 0 &&
      this.state.password.length != 0 &&
      this.state.passwordConfirmation.length != 0
    ) {
      SetStateWithValidation(this, false, name, value)
    } else {
      SetStateWithValidation(this, true, name, value)
    }
  }

  handleSubmit(event){
    event.preventDefault();
    if (!this.state.formInvalid){
      var newUser = new FormData();
      newUser.append("user[user_name]", this.state.userName);
      newUser.append("user[password]", this.state.password);
      newUser.append("user[password_confirmation]", this.state.passwordConfirmation);
      newUser.append("user[age_range]", this.state.ageRange);
      newUser.append("user[latitude]", this.state.latitude);
      newUser.append("user[longitude]", this.state.longitude);
      newUser.append("user[email]", this.state.email);
      newUser.append("user[gender]", this.state.gender);

      FetchWithPush(this, '/api/v1/users.json', '/', 'POST', 'registrationErrors', newUser)
    }
  }

  handleNextClick(){
    var current = this.state.currentPage
    current++
    this.setState({ currentPage: current })
  }

  handleBackClick(){
    var reverse = this.state.currentPage
    reverse--
    this.setState({ currentPage: reverse })
  }

  render(){
    var errorDiv, page, emailError, userNameError, passwordError, passwordConfirmationError;
    var { registrationErrors } = this.state

    emailError = CreateErrorElements(registrationErrors.email, "Email")
    userNameError = CreateErrorElements(registrationErrors.user_name, "User Name")
    passwordError = CreateErrorElements(registrationErrors.password, "Password")
    passwordConfirmationError = CreateErrorElements(registrationErrors.password_confirmation, "Password Confirmation")

    switch (this.state.currentPage) {
      case 1:
        page =
        <UserRegPageOne
          handleChange={this.handleChange}
          userName={this.state.userName}
          password={this.state.password}
          passwordConfirmation={this.state.passwordConfirmation}
          email={this.state.email}
          handleButtonClick={this.handleNextClick}
          handleBackClick={this.handleBackClick}
          disabled={this.state.formInvalid}
          emailError={emailError}
          userNameError={userNameError}
          passwordError={passwordError}
          passwordConfirmationError={passwordConfirmationError}
        />
        break;
      case 2:
        page =
        <UserRegPageTwo
          handleChange={this.handleChange}
          ageRange={this.state.ageRange}
          gender={this.state.gender}
          latitude={this.state.latitude}
          longitude={this.state.longitude}
          handleButtonClick={this.handleNextClick}
          handleBackClick={this.handleBackClick}
        />
        break;
      case 3:
        page =
        <UserRegPageThree
          handleBackClick={this.handleBackClick}
        />
      break;
    }

    return(
      <form className="form" id="user-registration-form" onSubmit={this.handleSubmit} >
        <h1 className="user-title text-center">User Registration</h1>

        {page}

        <div className="form-group actions margin-top-10px">
          <button id="user-registration-button" type="submit" className="btn btn-block btn-large btn-dark" value="Submit" disabled={this.state.formInvalid}>
            <span className="text-large">Register</span>
          </button>
        </div>
      </form>
    )
  }
}

export default UserNewFormContainer;
