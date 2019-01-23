import React from 'react';
import { Link } from 'react-router-dom';

import { FetchWithPush, FetchDidMount, CreateErrorElements, ErrorClassValidation } from '../../util/CoreUtil';
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

  componentDidMount(){
    this._isMounted = true;
    FetchDidMount(this, `${this.props.globalSettings.baseUrl}/api/v1/users/${this.props.userId}.json`)
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

    FetchWithPush(this, `${this.props.globalSettings.baseUrl}/api/v1/users/${this.props.userId}.json`, '', 'PATCH', 'saveErrors', user)
    .then(body => {
      if (!body.errors) {
        this.setState({ saveErrors: {} })
        alert(`${body.message}`)
      }
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
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
      <div className="cf-text-center">
        <h5>Selected Avatar</h5>
        <img style={style} src={`${this.props.globalSettings.baseUrl}/images/avatars/${avatar}.png`} />
      </div>
    }

    return(
      <div id="cf-user-edit-account-container">
        <form className="form" id="cf-user-edit-form" onSubmit={this.handleSubmit} >
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

          <hr />

          <div className="form-group cf-margin-top-10px">
            <label className="cf-text-medium cf-text-center" htmlFor="avatar">Choose Your Avatar</label>
            <br />
            {selectedAvatar}
            <Carousel
              onChange={this.handleAvatarClick}
              baseUrl={this.props.globalSettings.baseUrl}
            />
          </div>

          <hr />

          <div className="form-group actions">
            <button id="user-registration-button" type="submit" className="btn cf-float-right btn-sm btn-dark" value="Submit">
              Update
            </button>
            <button className="btn btn-sm btn-dark float-left" onClick={ this.props.updateDisplay }>
              Close
            </button>
          </div>

        </form>
      </div>
    )
  }
}


export default UserEditAccountContainer;
