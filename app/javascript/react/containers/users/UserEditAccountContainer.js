import React from 'react';
import { Link } from 'react-router-dom';

import { FetchWithPush, FetchDidMount, CreateErrorElements, ErrorClassValidation, FetchDeleteBasicWithPush } from '../../util/CoreUtil';
import { Input, NukaCarousel as Carousel } from '../../components/form/FormComponents';

class UserEditAccountContainer extends React.Component {
  state = {
    userName: '',
    email: '',
    avatar: '',
    saveErrors: {}
  }

  _isMounted = false;
  handleChange = this.handleChange.bind(this);
  handleAvatarClick = this.handleAvatarClick.bind(this);
  handleSubmit = this.handleSubmit.bind(this);
  handleDeleteAccount = this.handleDeleteAccount.bind(this);

  componentDidMount(){
    this._isMounted = true;

    FetchDidMount(this, `/api/v1/users/${this.props.userId}.json`)
    .then(body => {
      var user = body.user

      if (this._isMounted) {
        this.setState({
          userName: user.user_name,
          email: user.email,
          avatar: user.avatar_image
        })
      }
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  handleChange(event){
    event.preventDefault();
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

  handleSubmit(event){
    event.preventDefault();

    var user = new FormData();
    user.append("user[user_name]", this.state.userName);
    user.append("user[email]", this.state.email);
    user.append("user[base_image]", this.state.avatar);

    FetchWithPush(this, `/api/v1/users/${this.props.userId}.json`, '', 'PATCH', 'saveErrors', user)
    .then(body => {
      if (!body.errors) {
        this.setState({ saveErrors: {} })
        alert(`${body.message}`)
      }
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  handleDeleteAccount(event){
    event.preventDefault();
    var confirm1 = confirm("Are you sure you wish to delete your account?");
    if (confirm1 == true) {
      var confirm2 = confirm("Are you REALLY certain that you wish to delete your account?\n\nOnce you do this, there is no going back.");
      if (confirm2 == true){
        FetchDeleteBasicWithPush(this, `/api/v1/users/${this.props.userId}.json`, '/login')
      }
    }
  }

  render(){
    var { saveErrors, userName, email, avatar } = this.state;

    var emailError;
    emailError = CreateErrorElements(saveErrors.email, "Email")
    var emailClass;
    emailClass = ErrorClassValidation(emailError);

    var userNameError;
    userNameError = CreateErrorElements(saveErrors.user_name, "User Name")
    var userNameClass;
    userNameClass = ErrorClassValidation(userNameError);

    var selectedAvatar;
    if (avatar) {
      var style = {
        height: '110px',
        width: '110px',
        marginBottom: '10px'
      }

      selectedAvatar =
      <div className="text-center">
        <h5>Selected Avatar</h5>
        <img style={style} src={`/images/avatars/${avatar}.png`} />
      </div>
    }

    return(
      <div id="user-edit-account-container">
        <form className="form" id="user-edit-form" onSubmit={this.handleSubmit} >
          <Input
            name="userName"
            label="User Name"
            onChange={this.handleChange}
            content={userName}
            type="text"
            addClass={userNameClass}
          />
          {userNameError}
          <Input
            name="email"
            label="Email"
            onChange={this.handleChange}
            content={email}
            type="text"
            addClass={emailClass}
          />
          {emailError}

          <Link to={`/users/${this.props.userId}/edit_password`} className="text-medium btn change-password-button">
              Change Password
          </Link>

          <hr />

          <div className="form-group margin-top-10px">
            <label className="text-medium text-center" htmlFor="avatar">Choose Your Avatar</label>
            <br />
            {selectedAvatar}
            <Carousel
              onChange={this.handleAvatarClick}
            />
          </div>

          <div className="form-group actions">
            <button id="user-registration-button" type="submit" className="btn float-right btn-sm btn-dark  margin-top-10px" value="Submit">
              Update
            </button>
          </div>

          <hr />

          <div id="delete-account">
            <h3>Delete my account</h3>
            <p className="warning-text">Warning: Deleting your account is irreversible. Once you delete your accounts, all of your comments and interactions will become anonymous.</p>
            <p className="warning-text">Do not click the button unless you are certain.</p>
            <button onClick={this.handleDeleteAccountClick}  className="btn btn-danger btn-large btn-block">
              Delete Account
            </button>
          </div>

        </form>
      </div>
    )
  }
}


export default UserEditAccountContainer;
