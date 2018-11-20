import React from 'react';

import UserEditForm from '../../components/form/users/UserEditForm';
import { FetchWithPush, FetchDidMount, CreateErrorElements, FetchDeleteBasicWithPush } from '../../util/CoreUtil';

class UserEditFormContainer extends React.Component {
  state = {
    userName: '',
    password: '',
    passwordConfirmation: '',
    email: '',
    ageRange: '',
    latitude: '',
    longitude: '',
    gender: '',
    font: '',
    colorTheme: '',
    avatar: '',
    x: '',
    y: '',
    geoPin: { x: '', y: '' },
    saveErrors: {}
  }

  handleChange = this.handleChange.bind(this);
  handleSubmit = this.handleSubmit.bind(this);
  handleSliderChange = this.handleSliderChange.bind(this);
  handleDeleteAccountClick = this.handleDeleteAccountClick.bind(this);
  handleThemeSelectorChange = this.handleThemeSelectorChange.bind(this);
  handleGenderChange = this.handleGenderChange.bind(this);
  handleAvatarClick = this.handleAvatarClick.bind(this);
  _onMouseMove = this._onMouseMove.bind(this);
  setLatLongClick = this.setLatLongClick.bind(this);

  componentDidMount(){
    FetchDidMount(this, `/api/v1/users/${this.props.match.params.id}.json`)
    .then(body => {
      var user = body.user

      var x = ((user.longitude + 180) / (180 / 150))
      var y = (((user.latitude / -1) + 180) / (180 / 100))

      this.setState({
        userName: user.user_name,
        email: user.email,
        ageRange: user.age_range,
        gender: user.gender,
        latitude: user.latitude,
        longitude: user.longitude,
        geoPin: {
          x: x,
          y: y
        },
        font: user.font,
        colorTheme: user.color_theme,
        avatar: user.avatar_image
      })
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  handleThemeSelectorChange(event){
    event.preventDefault();

    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({ [name]: value })
  }

  handleDeleteAccountClick(event){
    event.preventDefault();
    var confirm1 = confirm("Are you sure you wish to delete your account?");
    if (confirm1 == true) {
      var confirm2 = confirm("Are you REALLY certain that you wish to delete your account?\n\nOnce you do this, there is no going back.");
      if (confirm2 == true){
        FetchDeleteBasicWithPush(this, `/api/v1/users/${this.props.match.params.id}.json`, '/login')
      }
    }
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

  handleChange(event){
    event.preventDefault();
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({ [name]: value })
  }

  handleGenderChange(event){
    event.preventDefault();
    const target = event.target;
    const value = target.name;
    this.setState({ gender: value })
  }

  handleAvatarClick(event){
    event.preventDefault();

    const target = event.target;
    const value = target.name;
    this.setState({ avatar: value })
  }

  handleSubmit(event){
    event.preventDefault();
    if (!this.state.formInvalid){
      var user = new FormData();
      user.append("user[user_name]", this.state.userName);
      user.append("user[password]", this.state.password);
      user.append("user[password_confirmation]", this.state.passwordConfirmation);
      user.append("user[age_range]", this.state.ageRange);
      user.append("user[latitude]", this.state.latitude);
      user.append("user[longitude]", this.state.longitude);
      user.append("user[email]", this.state.email);
      user.append("user[gender]", this.state.gender);
      user.append("user[font]", this.state.font);
      user.append("user[color_theme]", this.state.colorTheme);
      user.append("user[base_image]", this.state.avatar);

      FetchWithPush(this, `/api/v1/users/${this.props.match.params.id}.json`, '/', 'PATCH', 'saveErrors', user)
    }
  }

  render(){
    var errorDiv, page, emailError, userNameError, passwordError, passwordConfirmationError;
    var { saveErrors, userName, password, passwordConfirmation, ageRange, gender, latitude, longitude, font, colorTheme, avatar, email } = this.state

    emailError = CreateErrorElements(saveErrors.email, "Email")
    userNameError = CreateErrorElements(saveErrors.user_name, "User Name")
    passwordError = CreateErrorElements(saveErrors.password, "Password")
    passwordConfirmationError = CreateErrorElements(saveErrors.password_confirmation, "Password Confirmation")

    return(
      <div className="user-container">
        <form className="form" id="user-edit-form" onSubmit={this.handleSubmit} >
          <h5 className="user-title text-center">Edit Account</h5>

          <UserEditForm
            onChange={this.handleChange}
            onMouseMove={this._onMouseMove}
            setLatLongClick={this.setLatLongClick}
            handleSliderChange={this.handleSliderChange}
            handleThemeSelectorChange={this.handleThemeSelectorChange}
            handleGenderChange={this.handleGenderChange}
            handleAvatarClick={this.handleAvatarClick}
            userName={userName}
            password={password}
            passwordConfirmation={passwordConfirmation}
            email={email}
            handleButtonClick={this.handleNextClick}
            handleBackClick={this.handleBackClick}
            handleChange={this.handleChange}
            emailError={emailError}
            userNameError={userNameError}
            passwordError={passwordError}
            passwordConfirmationError={passwordConfirmationError}
            ageRange={ageRange}
            gender={gender}
            latitude={latitude}
            longitude={longitude}
            font={font}
            avatar={avatar}
            colorTheme={colorTheme}
            x={this.state.x}
            y={this.state.y}
            geoPin={this.state.geoPin}
            lat={this.state.latitude}
            long={this.state.longitude}
            />

          <div className="form-group actions margin-top-10px">
            <button id="user-registration-button" type="submit" className="btn btn-block btn-large btn-primary" value="Submit">
              <span className="text-medium">Update</span>
            </button>
          </div>
          <hr />
          <div id="delete-account">
            <h3>Delete my account</h3>
            <p className="warning-text">Warning: Deleting your account is irreversible. Once you delete your accounts, all of your comments and interactions will become anonymous.</p>
            <p className="warning-text">Do not click the button unless you are certain.</p>
            <button onClick={this.handleDeleteAccountClick}  className="btn btn-danger btn-large btn-block">Delete Account</button>

          </div>
        </form>
      </div>
    )
  }
}

export default UserEditFormContainer;
