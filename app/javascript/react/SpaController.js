import React from 'react';

import CfCommentsApp from './CfCommentsApp';
import UserEditContainer from './containers/users/UserEditContainer';
import UserEditPasswordContainer from './containers/users/UserEditPasswordContainer';
import SessionLoginContainer from './containers/sessions/SessionLoginContainer';
import UserNewContainer from './containers/users/UserNewContainer';
import { FetchDeleteBasic, FetchDidMount } from './util/CoreUtil';

class SpaController extends React.Component {
  state = {
    display: "",
    userId: document.getElementById('cf-comments-app').getAttribute('data-user-id'),
    globalSettings: {
      baseUrl: this.getBaseUrl(),
      baseImageUrl: "https://classifilterstore.blob.core.windows.net/graphics"
    },
    themeSettings: {
      font: document.getElementById('cf-comments-app').getAttribute('data-user-font'),
      color: document.getElementById('cf-comments-app').getAttribute('data-user-theme')
    }
  }

  getBaseUrl = this.getBaseUrl.bind(this);
  updateDisplay = this.updateDisplay.bind(this);
  handleLogin = this.handleLogin.bind(this);
  handleLogout = this.handleLogout.bind(this);
  handleUpdateSpaId = this.handleUpdateSpaId.bind(this);

  getBaseUrl() {
    var mode = document.getElementById('cf-comments-app').getAttribute('data-mode')
    if (mode) {
      return mode == "staging" ? "https://classifilter-staging.herokuapp.com" : "http://localhost:3000"
    } else {
      // return "http://localhost:3000"
      return "https://api.cmmntz.com"
    }
  }

  updateDisplay(page, event){
    event.preventDefault();
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
    FetchDeleteBasic(this, `${this.state.globalSettings.baseUrl}/api/v1/user_sessions/${this.state.userId}.json`)
    .then(finished => {
      this.handleUpdateSpaId(finished.user_id);
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));

  }

  render(){
    var { userId, display, globalSettings } = this.state;

    var page;
    switch (display) {
      case "":
        page =
          <CfCommentsApp
            updateDisplay={this.updateDisplay}
            userId={userId}
            handleLogout={this.handleLogout}
            themeSettings={this.state.themeSettings}
            globalSettings={globalSettings}
          />
        break;
      case "settings":
        page =
          <UserEditContainer
            userId={userId}
            updateDisplay={this.updateDisplay}
            updateSpaId={this.handleUpdateSpaId}
            globalSettings={globalSettings}
          />
        break;
      case "login":
        page =
          <SessionLoginContainer
            userId={userId}
            updateDisplay={this.updateDisplay}
            handleLogin={this.handleLogin}
            globalSettings={globalSettings}
          />
        break;
      case "register":
        page =
          <UserNewContainer
            userId={userId}
            updateDisplay={this.updateDisplay}
            handleUpdateSpaId={this.handleUpdateSpaId}
            globalSettings={globalSettings}
          />
        break;
      case "password":
        page =
          <UserEditPasswordContainer
            userId={userId}
            updateDisplay={this.updateDisplay}
            handleUpdateSpaId={this.handleUpdateSpaId}
            globalSettings={globalSettings}
          />
        break;
      default:
        page  =
          <CfCommentsApp
            updateDisplay={this.updateDisplay}
            userId={userId}
            handleLogout={this.handleLogout}
            themeSettings={this.state.themeSettings}
            globalSettings={globalSettings}
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
