import React from 'react';

import CfCommentsApp from './CfCommentsApp';
import UserEditContainer from './containers/users/UserEditContainer';
import SessionLoginContainer from './containers/sessions/SessionLoginContainer';
import UserNewContainer from './containers/users/UserNewContainer';
import { FetchDeleteBasic } from './util/CoreUtil';

class SpaController extends React.Component {
  state = {
    display: "",
    userId: document.getElementById('cf-comments-app').getAttribute('data-user-id'),
    themeSettings: {
      font: document.getElementById('cf-comments-app').getAttribute('data-user-font'),
      color: document.getElementById('cf-comments-app').getAttribute('data-user-theme')
    }
  }

  updateDisplay = this.updateDisplay.bind(this);
  handleLogin = this.handleLogin.bind(this);
  handleLogout = this.handleLogout.bind(this);
  handleUpdateSpaId = this.handleUpdateSpaId.bind(this);

  updateDisplay(page){
    this.setState({ display: page })
  }

  handleLogin(userId){
    this.setState({
      userId: userId
    })
  }

  handleUpdateSpaId(id){
    this.setState({
      userId: id,
      themeSettings: {
        font: "serif",
        color: "light"
      }
    })
  }

  handleLogout(){
    FetchDeleteBasic(this, `/api/v1/user_sessions/${this.state.userId}.json`)
    .then(finished => {
      this.handleUpdateSpaId(finished.user_id);
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
            handleLogout={this.handleLogout}
            themeSettings={this.state.themeSettings}
          />
        break;
      case "settings":
        page =
          <UserEditContainer
            userId={userId}
            updateDisplay={this.updateDisplay}
            updateSpaId={this.handleUpdateSpaId}
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
            userId={userId}
            handleLogout={this.handleLogout}
            themeSettings={this.state.themeSettings}
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
