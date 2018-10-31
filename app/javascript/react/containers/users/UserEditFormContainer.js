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
    saveErrors: {}
  }

  handleChange = this.handleChange.bind(this);
  handleSubmit = this.handleSubmit.bind(this);
  handleSliderChange = this.handleSliderChange.bind(this);
  handleDeleteAccountClick = this.handleDeleteAccountClick.bind(this);
  handleThemeSelectorChange = this.handleThemeSelectorChange.bind(this);

  handleThemeSelectorChange(event){
    event.preventDefault();

    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    })


  }

  handleDeleteAccountClick(event){
    event.preventDefault();
    var confirm1 = confirm("Are you sure you wish to delete your account?");
    if (confirm1 == true) {
      var confirm2 = confirm("Are you REALLY certain that you wish to delete your account?\n\nOnce you do this, there is no going back.");
      if (confirm2){
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

  componentDidMount(){
    FetchDidMount(this, `/api/v1/users/${this.props.match.params.id}.json`)
    .then(body => {
     this.setState({
       userName: body.user.user_name,
       email: body.user.email,
       ageRange: body.user.age_range,
       gender: body.user.gender,
       latitude: body.user.latitude,
       longitude: body.user.longitude,
       font: body.user.font,
       colorTheme: body.user.color_theme
     })
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  handleChange(event){
    event.preventDefault();
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({ [name]: value })
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

      FetchWithPush(this, `/api/v1/users/${this.props.match.params.id}.json`, '/', 'PATCH', 'saveErrors', user)
    }
  }

  render(){
    var errorDiv, page, emailError, userNameError, passwordError, passwordConfirmationError;
    var { saveErrors } = this.state

    emailError = CreateErrorElements(saveErrors.email, "Email")
    userNameError = CreateErrorElements(saveErrors.user_name, "User Name")
    passwordError = CreateErrorElements(saveErrors.password, "Password")
    passwordConfirmationError = CreateErrorElements(saveErrors.password_confirmation, "Password Confirmation")

    return(
      <form className="form" id="user-edit-form" onSubmit={this.handleSubmit} >
        <h1 className="user-title text-center">Edit Account</h1>

        <UserEditForm
          onChange={this.handleChange}
          handleSliderChange={this.handleSliderChange}
          handleThemeSelectorChange={this.handleThemeSelectorChange}
          userName={this.state.userName}
          password={this.state.password}
          passwordConfirmation={this.state.passwordConfirmation}
          email={this.state.email}
          handleButtonClick={this.handleNextClick}
          handleBackClick={this.handleBackClick}
          handleChange={this.handleChange}
          emailError={emailError}
          userNameError={userNameError}
          passwordError={passwordError}
          passwordConfirmationError={passwordConfirmationError}
          ageRange={this.state.ageRange}
          gender={this.state.gender}
          latitude={this.state.latitude}
          longitude={this.state.longitude}
          font={this.state.font}
          colorTheme={this.state.colorTheme}
        />

        <div className="form-group actions margin-top-10px">
          <button id="user-registration-button" type="submit" className="btn btn-block btn-large btn-primary" value="Submit">
            <span className="text-large">Update</span>
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
    )
  }
}

export default UserEditFormContainer;
