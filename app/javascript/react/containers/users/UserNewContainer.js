import React from 'react';

import UserNewRequiredContainer from './UserNewRequiredContainer';
import UserNewOptionalContainer from './UserNewOptionalContainer';
import { FetchWithPush, CreateErrorElements, CheckInputValidation } from '../../util/CoreUtil';
import Modal from '../../components/modals/Modal';

class UserNewContainer extends React.Component {
  state = {
    userName: '',
    password: '',
    passwordConfirmation: '',
    email: '',
    ageRange: '65',
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
    privacyPolicy: false,
    genderAnon: false,
    locationAnon: false,
    ageRangeAnon: false,
    anonWarningShown: false,
    anonWarningShow: false,
    submissionWarningShow: false,
    registrationErrors: {}
  }

  handleChange = this.handleChange.bind(this);
  handleSubmit = this.handleSubmit.bind(this);
  handleNextClick = this.handleNextClick.bind(this);
  handleBackClick = this.handleBackClick.bind(this);
  handleSliderChange = this.handleSliderChange.bind(this);
  handleAvatarClick = this.handleAvatarClick.bind(this);
  setLatLongClick = this.setLatLongClick.bind(this);
  handleShowAnonWarning = this.handleShowAnonWarning.bind(this);
  handleSubmissionWarning = this.handleSubmissionWarning.bind(this);

  componentDidUpdate(prevProps, prevState){
    if (
      prevState.userName != this.state.userName ||
      prevState.password != this.state.password ||
      prevState.passwordConfirmation != this.state.passwordConfirmation ||
      prevState.email != this.state.email ||
      prevState.privacyPolicy != this.state.privacyPolicy
    ) {
      var { userName, password, passwordConfirmation, email, privacyPolicy } = this.state

      CheckInputValidation(this, [userName, password, passwordConfirmation, email], privacyPolicy)
    }
  }

  setLatLongClick(x, y){

    var longitude = Math.round((x * (180 / 150)) - 180)
    var latitude = Math.round(((y * (180 / 100)) - 180) * -1)

    this.setState({
      latitude: latitude,
      longitude: longitude,
      geoPin: { x: x - 6, y: y - 6 },
      locationAnon: false
     })
  }

  handleChange(event){
    const target = event.target;
    var value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    switch (name) {
      case "gender":
        value = target.getAttribute('value')
        this.setState({
          [name]: value,
          genderAnon: false
        })
        break;
      case "genderAnon":
        this.setState({
          gender: "",
          genderAnon: value
        })
        this.handleShowAnonWarning()
        break;
      case "ageRangeAnon":
        this.setState({
          ageRange: "",
          ageRangeAnon: value
        })
        this.handleShowAnonWarning()
        break;
      case "location":
        this.setState({
          latitude: "",
          longitude: "",
          x: "",
          y: "",
          geoPin: { x: "", y: "" },
          locationAnon: value
        })
        this.handleShowAnonWarning()
        break;
      default:
        this.setState({ [name]: value })
    }
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

    if (value === "10") {
      value = ""
    }

    if (value === "") {
      this.setState({
        [name]: value,
        ageRangeAnon: true
      })
    } else {
      this.setState({
        [name]: value,
        ageRangeAnon: false
      })
    }
  }

  handleSubmit(event){
    event.preventDefault();

    if (!this.state.formInvalid){
      var { gender, userName, password, passwordConfirmation, ageRange, latitude, longitude, email, avatar } = this.state;
      var { genderAnon, locationAnon, ageRangeAnon, submissionWarningShow, submissionWarningShown } = this.state;

      switch (gender) {
        case "female":
            gender = 0
          break;
        case "other":
            gender = 1
          break;
        case "male":
            gender = 2
          break;
      }

      if (
        !genderAnon && gender === "" ||
        !locationAnon && latitude === "" & longitude == "" ||
        !ageRangeAnon && ageRange === ""
      ) {
        this.handleSubmissionWarning()
      } else {
        var newUser = new FormData();

        newUser.append("user[user_name]", userName);
        newUser.append("user[password]", password);
        newUser.append("user[password_confirmation]", passwordConfirmation);
        newUser.append("user[age_range]", ageRange);
        newUser.append("user[latitude]", latitude);
        newUser.append("user[longitude]", longitude);
        newUser.append("user[email]", email);
        newUser.append("user[gender]", gender);
        newUser.append("user[base_image]", avatar)

        FetchWithPush(this, '/api/v1/users.json', '/', 'POST', 'registrationErrors', newUser)
        .then(body =>{
          if (body.errors) {
            this.setState({currentPage: 1})
          } else {
            this.props.history.goBack()
          }
        })
        .catch(error => console.error(`Error in fetch: ${error.message}`));
      }
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

  handleShowAnonWarning(){
    var { anonWarningShow, anonWarningShown } = this.state;

    if (!anonWarningShow && !anonWarningShown) {
      document.body.classList.add("cf-modal-locked");
      this.setState({
        anonWarningShow: true,
        anonWarningShown: true
      })
    } else {
      document.body.classList.remove("cf-modal-locked");
      this.setState({
        anonWarningShow: false
      })
    }
  }

  handleSubmissionWarning(){
    var { submissionWarningShow } = this.state;

    if (!submissionWarningShow) {
      document.body.classList.add("cf-modal-locked");
      this.setState({
        submissionWarningShow: true,
        anonWarningShown: true
      })
    } else {
      document.body.classList.remove("cf-modal-locked");
      this.setState({
        submissionWarningShow: false
      })
    }
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
        <UserNewRequiredContainer
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
        <UserNewOptionalContainer
          onChange={this.handleChange}
          handleSliderChange={this.handleSliderChange}
          handleGenderChange={this.handleGenderChange}
          ageRange={this.state.ageRange}
          gender={this.state.gender}
          genderAnon={this.state.genderAnon}
          latitude={this.state.latitude}
          longitude={this.state.longitude}
          geoPin={this.state.geoPin}
          x={this.state.x}
          y={this.state.y}
          setLatLongClick={this.setLatLongClick}
          handleButtonClick={this.handleNextClick}
          handleBackClick={this.handleBackClick}
          selectedAvatar={this.state.avatar}
          handleSubmit={this.handleSubmit}
          handleAvatarClick={this.handleAvatarClick}
          locationAnon={this.state.locationAnon}
          ageRangeAnon={this.state.ageRangeAnon}
        />
        break;
    }

    var anonWarningModal;
    if (this.state.anonWarningShow) {
      anonWarningModal =
      <Modal
        modalTitle="For your consideration"
        handleClose={this.handleShowAnonWarning}
      >
      "Please be aware that by listing some of your information as anonymous, the likelihood that any comments you post will be filtered out via default settings goes up substantially. You always have the option to post specific comments as an anonymous user, but the system works best when your main account has the demographic details entered."
      </Modal>
    }

    var anonSubmissionModal;
    if (this.state.submissionWarningShow) {
      anonSubmissionModal =
      <Modal
        modalTitle="Please select options for demographics"
        handleClose={this.handleSubmissionWarning}
      >
      Please select an option or select Prefer Not To say for all demographics. Please be aware that by listing some of your information as anonymous, the likelihood that any comments you post will be filtered out via default settings goes up substantially. You always have the option to post specific comments as an anonymous user, but the system works best when your main account has the demographic details entered.
      </Modal>
    }

    return(
      <div className="login-container">
        <form className="form" id="cf-user-registration-form" onSubmit={this.handleSubmit} >
          <div className="row">
            <div className="col-3">
              <button className="btn btn-sm cf-fade-button" onClick={ () => window.location = "/login" }>Login</button>
            </div>
          </div>
          <h5 className="cf-user-title cf-text-center">User Registration</h5>

          {page}
          {anonWarningModal}
          {anonSubmissionModal}
        </form>
      </div>
    )
  }
}

export default UserNewContainer;
