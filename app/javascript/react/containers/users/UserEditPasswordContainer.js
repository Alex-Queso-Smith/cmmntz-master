import React from 'react';

import { Input, Checkbox } from '../../components/form/FormComponents';
import { FetchWithPush, CreateErrorElements, CheckInputValidation, FetchDeleteBasic} from '../../util/CoreUtil';

class UserEditPasswordContainer extends React.Component {
  state = {
    password: '',
    passwordConfirmation: '',
    formInvalid: true,
    passwordErrors: {}
  }

  handleSubmit = this.handleSubmit.bind(this);
  handleChange = this.handleChange.bind(this);
  handleDeleteAccount = this.handleDeleteAccount.bind(this);

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

      FetchWithPush(this, `/api/v1/users/${this.props.userId}.json`, '', 'PATCH', 'passwordErrors', user)
      .then(body => {
        if (!body.errors) {
          alert(body.message);
          this.setState({  passwordErrors: {} })
        }
      })
      .catch(error => console.error(`Error in fetch: ${error.message}`));
    }
  }

  handleDeleteAccount(event){
    event.preventDefault();

    var confirm1 = confirm("Are you sure you wish to delete your account? Deleting your account is irreversible. Once you delete your accounts, all of your comments and interactions will become anonymous.");

    if (confirm1 == true) {
      FetchDeleteBasic(this, `/api/v1/users/${this.props.userId}.json`)
      .then(finished => {

        // this.props.updateSpaId(finished.user_id);
        this.props.updateDisplay("login")
        }
      )
    }
  }

  render(){

    var passwordClass, passwordError, passwordConfirmationClass, passwordConfirmationError;
    var { passwordErrors } = this.state

    passwordError = CreateErrorElements(passwordErrors.password, "Password")
    passwordConfirmationError = CreateErrorElements(passwordErrors.password_confirmation, "Password Confirmation")

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

          <div className="form-group actions cf-margin-top-10px">
            <button type="submit" className="btn cf-float-right btn-sm btn-dark" value="Submit" disabled={this.state.formInvalid}>
              Update
            </button>
          </div>
        </form>
        <div className="row justify-content-center">
          <button onClick={this.handleDeleteAccount}  className="btn btn-danger btn-sm float-right">
            Delete Account
          </button>
        </div>
      </div>
    )
  }
}

export default UserEditPasswordContainer;
