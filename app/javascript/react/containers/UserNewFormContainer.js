import React from 'react';
// import { Router } from 'react-router-dom';

import Input from '../components/form/Input';
import GenderButton from '../components/form/GenderButton';
import AgeRange from '../components/form/AgeRange';

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
      errors: {}
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateEntry = this.validateEntry.bind(this);
    this.createUser = this.createUser.bind(this);
  }

  handleChange(event){
    if (
      event.target.name != "email" ||
      event.target.name != "ageRange" ||
      event.target.name != "latitude" ||
      event.target.name != "longitude" ||
      event.target.name != "gender"
    ) {
      this.validateEntry(event.target.name, event.target.value)
    }
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  validateEntry(name, fieldValue){
    if (fieldValue.trim() === '') {
      let newError = { [name]: `You must enter a ${name}`};
      this.setState({ errors: Object.assign(this.state.errors, newError) });
      return false;
    } else {
      let errorState = this.state.errors;
      delete errorState[name];
      this.setState({ errors: errorState });
      return true;
    }
  }

  handleSubmit(event){
    event.preventDefault();
    Object.keys(this.state).forEach(key => {
      if (
        key != "errors" &&
        key != "email" &&
        key != "ageRange" &&
        key != "latitude" &&
        key != "longitude" &&
        key != "gender"
      ) {
        this.validateEntry(key, this.state[key])
      }
    })
    if (Object.keys(this.state.errors).length == 0){
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
       if(response.ok){
         return response
       } else {
         let errorMessage = `${response.status} (${response.statusText})`,
             error = new Error(errorMessage)
         throw(error)
       }
     })
     .then(response => response.json())
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

  render(){
    let errorDiv;

    let errorItems;
    if (Object.keys(this.state.errors).length > 0) {
      errorItems = Object.values(this.state.errors).map(error => {
        return(<li key={error}>{error}</li>)
      })
      errorDiv = <div className="callout alert">{errorItems}</div>
    }

    return(
      <form className="form" id="user-registration-form" onSubmit={this.handleSubmit} >
        <h1 className="user-title text-center">User Registration</h1>

        {errorDiv}

        <div id="reg-required" className="form-group">
          <h3 className="text-center">Sign-Up Required Information </h3>
          <Input
            name="userName"
            label="User Name"
            handleChange={this.handleChange}
            content={this.state.userName}
            type="text"
          />
          <Input
            name="email"
            label="Email"
            handleChange={this.handleChange}
            content={this.state.email}
            type="text"
          />
          <Input
            name="password"
            label="Password"
            handleChange={this.handleChange}
            content={this.state.password}
            type="password"
          />
          <Input
            name="passwordConfirmation"
            label="Password Confirmation"
            handleChange={this.handleChange}
            content={this.state.passwordConfirmation}
            type="password"
          />
          <div className="form-group actions margin-top-10px">
            <button id="user-registration-button" className="btn btn-block btn-large btn-dark" >
              <span className="text-large">Next Page (Optional)</span>
            </button>
          </div>
        </div>

        <div id="reg-optional-1" className="form-group">
          <h3 className="text-center">Sign-Up Optional Information 1/2 </h3>

          <hr />

          <AgeRange
            name="ageRange"
            label="Age Range"
            handleChange={this.handleChange}
            content={this.state.ageRange}
            type="text"
          />
          <hr />
          <GenderButton
            name="gender"
            label="Gender"
            handleChange={this.handleChange}
            content={this.state.gender}
            type="text"
          />
          <hr />
          <Input
            name="latitude"
            label="Latitude"
            handleChange={this.handleChange}
            content={this.state.latitude}
            type="text"
          />
          <Input
            name="longitude"
            label="Longitude"
            handleChange={this.handleChange}
            content={this.state.longitude}
            type="text"
          />
          <div className="custom-control custom-checkbox margin-top-10px">
            <input type="checkbox" className="custom-control-input" id='location-opt-out' autoComplete="off" />
            <label className="custom-control-label text-medium" htmlFor='location-opt-out' >None of Your Business</label>
          </div>
          <div className="form-group actions margin-top-10px">
            <button id="user-registration-button" className="btn btn-block btn-large btn-dark" >
              <span className="text-large">Next Page (Optional)</span>
            </button>
          </div>
        </div>

        <div id="reg-optional-2" className="form-group hidden">
          <h3 className="text-center">Sign-Up Optional Information 2/2 </h3>

          <hr />

          <div className="form-group margin-top-10px">
            <label className="text-large" htmlFor="avatar">Avatar</label>
            <br />
            Coming Soon
          </div>
        </div>
        <div className="form-group actions margin-top-10px">
          <button id="user-registration-button" type="submit" className="btn btn-block btn-large btn-dark" value="Submit">
            <span className="text-large">Register</span>
          </button>
        </div>
      </form>
    )
  }
}

export default UserNewFormContainer;
