import React from 'react';

import { Input, Checkbox } from '../../components/form/FormComponents';
import { FetchWithPush, ErrorClassValidation, CreateErrorElements, CheckInputValidation, FetchDeleteBasic} from '../../util/CoreUtil';

class UserEditPasswordContainer extends React.Component {
  state = {
    password: '',
    passwordConfirmation: '',
    formInvalid: true,
    saveErrors: {}
  }

  handleSubmit = this.handleSubmit.bind(this);
  handleChange = this.handleChange.bind(this);

  componentDidUpdate(prevProps, prevState){
    if (
      prevState.password != this.state.password ||
      prevState.passwordConfirmation != this.state.passwordConfirmation
    ) {
      var { password, passwordConfirmation } = this.state;

      CheckInputValidation(this, [password, passwordConfirmation])
    }
  }

  handleChange(event){
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({ [name]: value })
  }

  handleSubmit(event){
    event.preventDefault();

    if (!this.state.formInvalid) {
      var user = new FormData();
      user.append("user[password]", this.state.password);
      user.append("user[password_confirmation]", this.state.passwordConfirmation);

      FetchWithPush(this, `${this.props.globalSettings.baseUrl}/api/v1/users/${this.props.userId}.json`, '', 'PATCH', 'saveErrors', user)
      .then(body => {
        if (!body.errors) {
          alert(body.message);
          this.setState({  passwordErrors: {} })
        }
      })
      .catch(error => console.error(`Error in fetch: ${error.message}`));
    }
  }

  render(){
    var { saveErrors } = this.state;

    var passwordError;
    if (saveErrors.password) { passwordError = CreateErrorElements(passwordErrors.password, "Password"); }
    var passwordClass,
    passwordClass = ErrorClassValidation(passwordError);

    var passwordConfirmationError;
    if (saveErrors.password_confirmation) { passwordConfirmationError = CreateErrorElements(passwordErrors.password_confirmation, "Password Confirmation"); }
    var passwordConfirmationClass;
    passwordConfirmationClass = ErrorClassValidation(passwordConfirmationError);

    var updateDisplaySettings = (event) => {
      this.props.updateDisplay("settings", event)
    }

    return(
      <div className="cf-user-edit-password-container">
        <form className="form" id="cf-password-form" onSubmit={this.handleSubmit}>
          <h1 className="cf-user-title cf-text-center">Edit Password</h1>
          <Input
            name="password"
            label="Password"
            onChange={this.handleChange}
            content={this.passwordConfirmation}
            type="password"
            addClass={passwordClass}
          />
          {passwordError}
          <Input
            name="passwordConfirmation"
            label="Password Confirmation"
            onChange={this.handleChange}
            content={this.passwordConfirmation}
            type="password"
            addClass={passwordConfirmationClass}
          />
          {passwordConfirmationError}
          <hr />
          <div className="form-group actions">
            <button type="submit" className="btn cf-float-right btn-sm btn-dark" value="Submit" disabled={this.state.formInvalid}>
              Update
            </button>
            <button type="submit" className="btn cf-float-left btn-sm btn-dark" value="Submit" onClick={updateDisplaySettings}>
              Close
            </button>
          </div>
        </form>
      </div>
    )
  }
}

export default UserEditPasswordContainer;
