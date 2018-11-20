import React from 'react';

import { UserRegPageOne, UserRegPageTwo, UserRegPageThree } from '../../components/form/users/UserRegPages';
import { FetchWithPush, CreateErrorElements, CheckInputValidation } from '../../util/CoreUtil';
import PrivacyPolicy from '../../components/modals/PrivacyPolicy'

class UserNewFormContainer extends React.Component {
  state = {
    userName: '',
    password: '',
    passwordConfirmation: '',
    email: '',
    ageRange: '',
    latitude: '',
    longitude: '',
    x: '',
    y: '',
    geoPin: {
      x: '',
      y: ''
    },
    gender: '',
    avatar: '',
    currentPage: 1,
    formInvalid: true,
    registrationErrors: {}
  }

  handleChange = this.handleChange.bind(this);
  handleSubmit = this.handleSubmit.bind(this);
  handleNextClick = this.handleNextClick.bind(this);
  handleBackClick = this.handleBackClick.bind(this);
  handleSliderChange = this.handleSliderChange.bind(this);
  handleAvatarClick = this.handleAvatarClick.bind(this);
  handleGenderChange = this.handleGenderChange.bind(this);
  _onMouseMove = this._onMouseMove.bind(this);
  setLatLongClick = this.setLatLongClick.bind(this);

  componentDidUpdate(prevProps, prevState){
    if (
      prevState.text != this.state.text ||
      prevState.password != this.state.password ||
      prevState.passwordConfirmation != this.state.passwordConfirmation ||
      prevState.email != this.state.email
    ) {
      var { userName, password, passwordConfirmation, email } = this.state

      CheckInputValidation(this, [userName, password, passwordConfirmation, email])
    }
  }

  _onMouseMove(event) {
    this.setState({ x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY });
  }

  setLatLongClick(event){
    var { x, y } = this.state;

    var longitude = Math.round((x * (180 / 150)) - 180)
    var latitude = Math.round(((y * (180 / 100)) - 180) * -1)

    this.setState({
      latitude: latitude,
      longitude: longitude,
      geoPin: { x: x, y: y }
     })
  }

  handleGenderChange(event){
    event.preventDefault();
    const target = event.target;
    const value = target.name;
    this.setState({ gender: value })
  }

  handleChange(event){
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({ [name]: value })
  }

  handleAvatarClick(event){
    event.preventDefault();

    const target = event.target;
    const value = target.name;
    this.setState({ avatar: value })
  }

  handleSliderChange(event){
    const target = event.target;
    var value = target.value;
    const name = target.name;

    if (value === "15") {
      value = "13"
    } else if (value === "10") {
      value = ""
    }
    this.setState({
      [name]: value
    })
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
      newUser.append("user[base_image]", this.state.avatar)

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
          onChange={this.handleChange}
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
          onChange={this.handleChange}
          handleSliderChange={this.handleSliderChange}
          handleGenderChange={this.handleGenderChange}
          ageRange={this.state.ageRange}
          gender={this.state.gender}
          latitude={this.state.latitude}
          longitude={this.state.longitude}
          geoPin={this.state.geoPin}
          x={this.state.x}
          y={this.state.y}
          onMouseMove={this._onMouseMove}
          setLatLongClick={this.setLatLongClick}
          handleButtonClick={this.handleNextClick}
          handleBackClick={this.handleBackClick}
        />
        break;
      case 3:
        page =
        <UserRegPageThree
          handleBackClick={this.handleBackClick}
          handleAvatarClick={this.handleAvatarClick}
          avatar={this.state.avatar}
        />
      break;
    }

    return(
      <div id="login-container" className="login-container">
        <form className="form" id="user-registration-form" onSubmit={this.handleSubmit} >
          <h5 className="user-title text-center">User Registration</h5>

          {page}

          <div className="form-group actions margin-top-10px">
            <button id="user-registration-button" type="submit" className="btn btn-sm btn-primary" value="Submit" disabled={this.state.formInvalid}>
              Register
            </button>
          </div>
          <PrivacyPolicy />
        </form>
      </div>
    )
  }
}

export default UserNewFormContainer;
