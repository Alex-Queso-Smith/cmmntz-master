import React from 'react';

import Tabs from '../../components/settings/Tabs';
import UserEditSettingsContainer from './UserEditSettingsContainer';
import UserEditAccountContainer from './UserEditAccountContainer';
import UserEditLooksContainer from './UserEditLooksContainer';
import UserEditDemographicsContainer from './UserEditDemographicsContainer';
import UserEditPasswordContainer from './UserEditPasswordContainer';
import FeedbackFormContainer from '../FeedbackFormContainer';

class UserEditContainer extends React.Component {
  state = {
    display: "",
    userId: this.props.userId
  }

  handleTabClick = this.handleTabClick.bind(this);

  handleTabClick(event){
    const target = event.target;
    const value = target.getAttribute('data-value');

    this.setState({ display: value })
  }

  render(){
    var { display, userId } = this.state;
    var updateDisplayComments = () => {
      this.props.updateDisplay("")
    }

    var page;
    switch (display) {
      case "":
        page =
        <UserEditAccountContainer
          userId={ userId }
          updateDisplay={updateDisplayComments}
          globalSettings={this.props.globalSettings}
        />
      break;
      case "looks":
        page =
        <UserEditLooksContainer
          userId={ userId }
          updateDisplay={updateDisplayComments}
          globalSettings={this.props.globalSettings}
        />
      break;
      case "demographics":
        page =
        <UserEditDemographicsContainer
          userId={ userId }
          updateDisplay={updateDisplayComments}
          globalSettings={this.props.globalSettings}
        />
      break;
      case "settings":
        page =
        <UserEditSettingsContainer
          userId={ userId }
          updateDisplay={updateDisplayComments}
          globalSettings={this.props.globalSettings}
        />
        break;
      case "password":
        page =
        <UserEditPasswordContainer
          userId={ userId }
          updateDisplay={updateDisplayComments}
          updateSpaId={this.props.updateSpaId}
          globalSettings={this.props.globalSettings}
        />
        break;
      default:
        page =
        <UserEditAccountContainer
          userId={ userId }
          updateDisplay={updateDisplayComments}
          globalSettings={this.props.globalSettings}
        />
    }

    return(
      <div id="cf-user-edit-container">
        <Tabs
          display={this.state.display}
          onClick={this.handleTabClick}
        />

        {page}

        <hr />

        <FeedbackFormContainer
          userId={this.state.userId}
          globalSettings={this.props.globalSettings.baseUrl}
        />

      </div>
    )
  }
}

export default UserEditContainer;
