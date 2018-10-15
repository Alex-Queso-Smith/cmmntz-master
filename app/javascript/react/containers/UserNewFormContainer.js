import React from 'react';

import Input from '../components/form/Input';
import GenderButton from '../components/form/GenderButton';
import AgeRange from '../components/form/AgeRange';
import UserRegPageOne from '../components/form/UserRegPageOne';
import UserRegPageTwo from '../components/form/UserRegPageTwo';
import UserRegPageThree from '../components/form/UserRegPageThree';

class UserNewFormContainer extends React.Component {
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
      currentPage: 1,
      formInvalid: true,
      registrationErrors: {},
      errors: {}
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateEntry = this.validateEntry.bind(this);
    this.createUser = this.createUser.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
    this.handleBackClick = this.handleBackClick.bind(this);
    this.registrationStatus = this.registrationStatus.bind(this);
    this.validateErrorKeys = this.validateErrorKeys.bind(this);
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
        formInvalid: false,
        [event.target.name]: event.target.value

      })
    } else {
      this.setState({
        formInvalid: true,
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
      var newUser = new FormData();
      newUser.append("user[user_name]", this.state.userName);
      newUser.append("user[password]", this.state.password);
      newUser.append("user[password_confirmation]", this.state.passwordConfirmation);
      newUser.append("user[age_range]", this.state.ageRange);
      newUser.append("user[latitude]", this.state.latitude);
      newUser.append("user[longitude]", this.state.longitude);
      newUser.append("user[email]", this.state.email);
      newUser.append("user[gender]", this.state.gender);

      this.createUser(newUser);
      this.handleClear();
    }
  }

  createUser(payload){
    fetch('/api/v1/users.json', {
      method: 'POST',
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
     // .then(body => {debugger})
     .then(body => this.setState({ registrationErrors: body.errors }))
     .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  handleClear(){
    this.setState({
      userName: '',
      password: '',
      passwordConfirmation: '',
      email: '',
      ageRange: '',
      latitude: '',
      longitude: '',
      gender: '',
      errors: {}
    })
  }

  handleNextClick(){
    if (this.validateErrorKeys()){
      var current = this.state.currentPage
      current++
      this.setState({ currentPage: current })
    }
  }

  handleBackClick(){
    var reverse = this.state.currentPage
    reverse--
    this.setState({ currentPage: reverse })
  }

  registrationStatus(){
    if (this.validateErrorKeys()) {
      this.setState({ formInvalid: false })
    } else {
      this.setState({ formInvalid: true })
    }
  }

  validateErrorKeys(){
    Object.keys(this.state).forEach(key => {
      if (
        key != "errors" &&
        key != "ageRange" &&
        key != "latitude" &&
        key != "longitude" &&
        key != "gender" &&
        key != "currentPage" &&
        key != "formInvalid" &&
        key != "registrationErrors"
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

    if (this.state.registrationErrors.email) {
      emailError =
      this.state.registrationErrors.email.map((error) => {
        return(
          <p className="error-text" key={`email ${error}`}>{`${error}`}</p>
        )
      })
    }

    if (this.state.registrationErrors.user_name) {
      userNameError =
        <p className="error-text" key='username'>{`User Name ${this.state.registrationErrors.user_name}`}</p>
    }

    if (this.state.registrationErrors.password) {
      passwordError =
      this.state.registrationErrors.password.map((error) => {
        return(
          <p className="error-text" key={`password ${error}`}>{`${error}`}</p>
        )
      })
    }

    if (this.state.registrationErrors.password_confirmation) {
      passwordConfirmationError =
      this.state.registrationErrors.password_confirmation.map((error) => {
        return(
          <p className="error-text" key={`${error}`}>{`${error}`}</p>
        )
      })
    }

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
