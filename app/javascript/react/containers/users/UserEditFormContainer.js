import React from 'react';

import Input from '../../components/form/Input';
import GenderSelector from '../../components/form/GenderSelector';
import AgeRangeSelector from '../../components/form/AgeRangeSelector';
import UserEditForm from '../../components/form/users/UserEditForm';
import FetchWithPush from '../../util/FetchWithPush';
import FetchWithPull from '../../util/FetchWithPull';

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
    saveErrors: {}
  }

  handleChange = this.handleChange.bind(this);
  handleSubmit = this.handleSubmit.bind(this);

  componentDidMount(){
    FetchWithPull(this, `/api/v1/users/${this.props.match.params.id}.json`)
    .then(body => {
     this.setState({
       userName: body.user.user_name,
       email: body.user.email,
       ageRange: body.user.age_range,
       gender: body.user.gender,
       latitude: body.user.latitude,
       longitude: body.user.longitude
     })
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  handleChange(event){
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    })
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

      FetchWithPush(this, `/api/v1/users/${this.props.match.params.id}.json`, '/', 'PATCH', 'saveErrors', user)
    }
  }

  render(){
    var errorDiv, page, emailError, userNameError, passwordError, passwordConfirmationError;
    var { saveErrors } = this.state

    if (saveErrors.email) {
      emailError =
      saveErrors.email.map((error) => {
        return(
          <p className="error-text" key={`${error}`}>{`Email ${error}`}</p>
        )
      })
    }

    if (saveErrors.user_name) {
      userNameError =
      saveErrors.user_name.map((error) => {
        return(
          <p className="error-text" key={`${error}`}>{`User Name ${error}`}</p>
        )
      })
    }

    if (saveErrors.password) {
      passwordError =
      saveErrors.password.map((error) => {
        return(
          <p className="error-text" key={`${error}`}>{`Password ${error}`}</p>
        )
      })
    }

    if (saveErrors.password_confirmation) {
      passwordConfirmationError =
      saveErrors.password_confirmation.map((error) => {
        return(
          <p className="error-text" key={`${error}`}>{`Password Confirmation ${error}`}</p>
        )
      })
    }

    return(
      <form className="form" id="user-edit-form" onSubmit={this.handleSubmit} >
        <h1 className="user-title text-center">Edit Account</h1>

        <UserEditForm
          handleChange={this.handleChange}
          userName={this.state.userName}
          password={this.state.password}
          passwordConfirmation={this.state.passwordConfirmation}
          email={this.state.email}
          handleButtonClick={this.handleNextClick}
          handleBackClick={this.handleBackClick}
          emailError={emailError}
          userNameError={userNameError}
          passwordError={passwordError}
          passwordConfirmationError={passwordConfirmationError}
          ageRange={this.state.ageRange}
          gender={this.state.gender}
          latitude={this.state.latitude}
          longitude={this.state.longitude}
        />

        <div className="form-group actions margin-top-10px">
          <button id="user-registration-button" type="submit" className="btn btn-block btn-large btn-dark" value="Submit">
            <span className="text-large">Update</span>
          </button>
        </div>
      </form>
    )
  }
}

export default UserEditFormContainer;
