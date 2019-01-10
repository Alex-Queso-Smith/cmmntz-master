import React from 'react';

import CfCommentsApp from './CfCommentsApp';
import UserEditContainer from './containers/users/UserEditContainer';
import SessionLoginContainer from './containers/sessions/SessionLoginContainer';
import UserNewContainer from './containers/users/UserNewContainer';

class SpaController extends React.Component {
  state = {
    display: "",
    userId: document.getElementById('cf-comments-app').getAttribute('data-user-id')
  }

  updateDisplay = this.updateDisplay.bind(this);
  handleLogin = this.handleLogin.bind(this);

  updateDisplay(page){
    this.setState({ display: page })
  }

  handleLogin(userId){
    this.setState({
      userId: userId
    })
  }

  render(){
    var { userId, display } = this.state;

    var page;
    switch (display) {
      case "":
        page =
          <CfCommentsApp
            updateDisplay={this.updateDisplay}
            userId={userId}
          />
        break;
      case "settings":
        page =
          <UserEditContainer
            userId={userId}
            updateDisplay={this.updateDisplay}
          />
        break;
      case "login":
        page =
          <SessionLoginContainer
            userId={userId}
            updateDisplay={this.updateDisplay}
            handleLogin={this.handleLogin}
          />
        break;
      case "register":
        page =
          <UserNewContainer
            userId={userId}
            updateDisplay={this.updateDisplay}
          />
        break;
      default:
        page  =
          <CfCommentsApp
            updateDisplay={this.updateDisplay}
          />
    }
    return(
      <div className="cf-spa-controller">
        {page}
      </div>
    )
  }
}

export default SpaController;
