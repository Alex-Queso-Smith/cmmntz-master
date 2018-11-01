import React from 'react';

import { UserRegPageOne, UserRegPageTwo, UserRegPageThree } from '../../components/form/users/UserRegPages';
import { FetchWithPush, CreateErrorElements, SetStateWithValidation } from '../../util/CoreUtil';
import BasicModal from '../../components/general/BasicModal'

class UserNewFormContainer extends React.Component {
  state = {
    userName: '',
    password: '',
    passwordConfirmation: '',
    email: '',
    ageRange: '',
    latitude: '',
    longitude: '',
    gender: '',
    avatar: '',
    currentPage: 1,
    formInvalid: true,
    registrationErrors: {}
  }

  handleChange = this.handleChange.bind(this);
  handleSubmit = this.handleSubmit.bind(this);
  handleNextClick = this.handleNextClick.bind(this);
  handleBackClick = this.handleBackClick.bind(this);
  handleSliderChange = this.handleSliderChange.bind(this);
  handleAvatarClick = this.handleAvatarClick.bind(this);

  handleChange(event){
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (
      this.state.userName.length != 0 &&
      this.state.email.length != 0 &&
      this.state.password.length != 0 &&
      this.state.passwordConfirmation.length != 0
    ) {
      SetStateWithValidation(this, false, name, value)
    } else {
      SetStateWithValidation(this, true, name, value)
    }
  }

  handleAvatarClick(event){
    event.preventDefault();

    const target = event.target;
    const value = target.name;
    this.setState({ avatar: value })
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

  handleSubmit(event){
    event.preventDefault();
    if (!this.state.formInvalid){
      var newUser = new FormData();
      newUser.append("user[user_name]", this.state.userName);
      newUser.append("user[password]", this.state.password);
      newUser.append("user[password_confirmation]", this.state.passwordConfirmation);
      newUser.append("user[age_range]", this.state.ageRange);
      newUser.append("user[latitude]", this.state.latitude);
      newUser.append("user[longitude]", this.state.longitude);
      newUser.append("user[email]", this.state.email);
      newUser.append("user[gender]", this.state.gender);
      newUser.append("user[base_image]", this.state.base_image)

      FetchWithPush(this, '/api/v1/users.json', '/', 'POST', 'registrationErrors', newUser)
    }
  }

  handleNextClick(){
    var current = this.state.currentPage
    current++
    this.setState({ currentPage: current })
  }

  handleBackClick(){
    var reverse = this.state.currentPage
    reverse--
    this.setState({ currentPage: reverse })
  }

  render(){
    var errorDiv, page, emailError, userNameError, passwordError, passwordConfirmationError;
    var { registrationErrors } = this.state

    emailError = CreateErrorElements(registrationErrors.email, "Email")
    userNameError = CreateErrorElements(registrationErrors.user_name, "User Name")
    passwordError = CreateErrorElements(registrationErrors.password, "Password")
    passwordConfirmationError = CreateErrorElements(registrationErrors.password_confirmation, "Password Confirmation")

    switch (this.state.currentPage) {
      case 1:
        page =
        <UserRegPageOne
          onChange={this.handleChange}
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
          onChange={this.handleChange}
          handleSliderChange={this.handleSliderChange}
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
          <button id="user-registration-button" type="submit" className="btn btn-block btn-large btn-primary" value="Submit" disabled={this.state.formInvalid}>
            <span className="text-large">Register</span>
          </button>
        </div>
        <BasicModal
          modalButtonText="Privacy Policy"
          modalTitle="Privacy Policy"
        >
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec luctus odio nec magna consequat, et cursus turpis placerat. Sed at tristique nisl, in pharetra urna. Vestibulum nec tortor eget velit eleifend ullamcorper eget at purus. Fusce consequat magna tellus, vitae laoreet tortor aliquam quis. Pellentesque finibus diam lacinia, euismod libero vitae, faucibus risus. Etiam a nunc sed quam semper eleifend vitae et ex. Cras volutpat, lectus et porta elementum, nibh nisl condimentum augue, nec tempus lectus lectus nec ligula. Pellentesque sed commodo eros, vel feugiat magna. Nam eleifend pellentesque pretium. Nam lacus sapien, bibendum sit amet diam volutpat, ornare feugiat arcu. Proin tempus aliquet enim, quis pellentesque tortor hendrerit a. Nunc vel metus pulvinar, ultrices sapien ut, sagittis sem. Pellentesque luctus consectetur suscipit. Curabitur luctus condimentum scelerisque. Integer vitae imperdiet nulla, sed placerat tellus.</p>

          <p>Fusce non ante nec mi sagittis pellentesque. Quisque nulla elit, auctor quis augue sed, porttitor scelerisque nulla. Nullam sit amet placerat lacus. Donec massa lacus, maximus ut pretium cursus, efficitur in eros. Aenean urna ex, ornare sit amet quam quis, efficitur congue risus. Nunc faucibus eget nibh nec scelerisque. Phasellus commodo congue augue, eget ultricies enim. Suspendisse vehicula nunc consequat risus tempus, nec consequat nulla interdum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent mattis ante finibus, cursus leo tempor, maximus turpis. Phasellus lectus leo, auctor quis mauris a, rutrum dictum urna. Vestibulum eu molestie elit. Phasellus convallis porta diam, in fermentum orci. Ut quis eleifend nulla, eu lacinia ex. Quisque tempus tellus vel ipsum feugiat, ut euismod nunc consectetur. Fusce dictum dignissim ultrices.</p>

          <p>Donec consectetur, nisi eu placerat vestibulum, nunc nulla vestibulum neque, eget rutrum velit eros blandit eros. Duis aliquet massa et maximus rhoncus. Nunc in justo ligula. Fusce sed arcu blandit, consequat tellus vel, aliquet ex. Fusce ac varius libero. In ac scelerisque odio, nec euismod tellus. Maecenas laoreet odio lectus, ut tempor nulla tristique non. Sed commodo, odio at congue tempus, sem nulla volutpat nibh, a fringilla dolor arcu ac turpis. Nam egestas egestas metus dapibus fermentum. Aenean vestibulum lacus eu faucibus eleifend. Nunc eu arcu auctor, luctus lacus a, lobortis erat. Morbi vel venenatis leo. Suspendisse fermentum condimentum dolor in accumsan. Praesent tincidunt varius lacinia. Vivamus egestas tellus et eleifend viverra.</p>

          <p>Cras hendrerit elementum ipsum in faucibus. Cras porta pharetra urna sit amet pretium. Etiam convallis suscipit velit nec mattis. Donec commodo placerat libero, eu vulputate nibh semper vel. Etiam porta, nunc cursus tempor interdum, sapien magna dapibus augue, sed ultrices magna enim quis libero. Donec et egestas magna. In semper sem est, id congue enim lacinia at. Nullam posuere est sed accumsan viverra. Donec in elit sed mi vestibulum vulputate. In at libero sed elit finibus ultrices ut nec leo. In vestibulum hendrerit lectus, ac vestibulum nisl posuere non. Proin quis ligula dui.</p>

          <p>Pellentesque lacinia neque ut tincidunt scelerisque. Praesent commodo lectus risus, sed blandit nibh lacinia ut. In fermentum hendrerit velit quis condimentum. Sed rutrum volutpat urna, vel ornare elit finibus nec. Nam mattis imperdiet velit, et pulvinar ante convallis ut. Sed at dolor pulvinar lorem ullamcorper venenatis. Donec maximus auctor nulla et blandit. Etiam tincidunt lacus eget porta interdum. Curabitur ut rhoncus magna. Vivamus placerat ornare lacinia. Nulla viverra mauris vel nisl molestie faucibus. Quisque imperdiet ipsum in neque aliquet faucibus fermentum in enim.</p>
        </BasicModal>
      </form>
    )
  }
}

export default UserNewFormContainer;
