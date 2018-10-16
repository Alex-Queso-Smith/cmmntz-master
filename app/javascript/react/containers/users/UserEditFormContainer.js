import React from 'react';

import Input from '../../components/form/Input';
import GenderButton from '../../components/form/GenderButton';
import AgeRange from '../../components/form/AgeRange';
import UserEditForm from '../../components/form/users/UserEditForm'

class UserEditFormContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      userName: '',
      password: '',
      passwordConfirmation: '',
      email: '',
      ageRange: '',
      latitude: '',
      longitude: '',
      gender: '',
      saveErrors: {},
      errors: {}
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateEntry = this.validateEntry.bind(this);
    this.validateErrorKeys = this.validateErrorKeys.bind(this);
    this.saveUser = this.saveUser.bind(this);
  }

  componentDidMount(){
    fetch(`/api/v1/users/${this.props.match.params.id}.json`, {credentials: 'same-origin'})
    .then(response => {
       if(response.ok){
         return response
       } else {
         let errorMessage = `${response.status} (${response.statusText})`,
             error = new Error(errorMessage)
         throw(error)
       }
     })
     .then(response => response.json())
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
    if (
      event.target.name != "ageRange" ||
      event.target.name != "latitude" ||
      event.target.name != "longitude" ||
      event.target.name != "gender"
    ) {
      this.validateEntry(event.target.name, event.target.value)
    }
    if (
      this.state.userName.length != 0 &&
      this.state.email.length != 0 &&
      this.state.password != 0 &&
      this.state.passwordConfirmation != 0
    ) {
      this.setState({
        [event.target.name]: event.target.value
      })
    } else {
      this.setState({
        [event.target.name]: event.target.value
      });
    }
  }

  validateEntry(name, fieldValue){
    if (fieldValue.trim() === '') {
      var newError = { [name]: `You must enter a ${name}`};
      this.setState({ errors: Object.assign(this.state.errors, newError) });
      return false;
    } else {
      var errorState = this.state.errors;
      delete errorState[name];
      this.setState({ errors: errorState });
      return true;
    }
  }

  handleSubmit(event){
    event.preventDefault();
    if (this.validateErrorKeys()){
      var user = new FormData();
      user.append("user[user_name]", this.state.userName);
      user.append("user[password]", this.state.password);
      user.append("user[password_confirmation]", this.state.passwordConfirmation);
      user.append("user[age_range]", this.state.ageRange);
      user.append("user[latitude]", this.state.latitude);
      user.append("user[longitude]", this.state.longitude);
      user.append("user[email]", this.state.email);
      user.append("user[gender]", this.state.gender);

      this.saveUser(user);
    }
  }

  saveUser(payload){
    fetch(`/api/v1/users/${this.props.match.params.id}.json`, {
      method: 'PATCH',
      credentials: 'same-origin',
      body: payload
    })
    .then(response => {
       if(response.ok || response.status == 422){
         return response
       } else {
         let errorMessage = `${response.status} (${response.statusText})`,
             error = new Error(errorMessage)
         throw(error)
       }
     })
     .then(response => response.json())
     .then(body => {
       if (body.errors) {
         this.setState({ saveErrors: body.errors})
       }
     })
     .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  validateErrorKeys(){
    Object.keys(this.state).forEach(key => {
      if (
        key != "errors" &&
        key != "ageRange" &&
        key != "latitude" &&
        key != "longitude" &&
        key != "gender" &&
        key != "saveErrors"
      ) {
        this.validateEntry(key, this.state[key])
      }
    })
    return Object.keys(this.state.errors).length == 0
  }

  render(){
    var errorDiv, page, emailError, userNameError, passwordError, passwordConfirmationError;

    var errorItems;
    if (Object.keys(this.state.errors).length > 0) {
      errorItems = Object.values(this.state.errors).map(error => {
        return(<li key={error}>{error}</li>)
      })
      errorDiv = <div className="callout alert">{errorItems}</div>
    }

    if (this.state.saveErrors.email) {
      emailError =
      this.state.saveErrors.email.map((error) => {
        return(
          <p className="error-text" key={`${error}`}>{`${error}`}</p>
        )
      })
    }

    if (this.state.saveErrors.user_name) {
      userNameError =
      this.state.saveErrors.user_name.map((error) => {
        return(
          <p className="error-text" key={`${error}`}>{`${error}`}</p>
        )
      })
    }

    if (this.state.saveErrors.password) {
      passwordError =
      this.state.saveErrors.password.map((error) => {
        return(
          <p className="error-text" key={`${error}`}>{`${error}`}</p>
        )
      })
    }

    if (this.state.saveErrors.password_confirmation) {
      passwordConfirmationError =
      this.state.saveErrors.password_confirmation.map((error) => {
        return(
          <p className="error-text" key={`${error}`}>{`${error}`}</p>
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
