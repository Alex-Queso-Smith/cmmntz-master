import React from 'react';

import Tabs from '../../components/settings/Tabs';
import UserEditSettingsContainer from './UserEditSettingsContainer';
import UserEditAccountContainer from './UserEditAccountContainer';
import UserEditLooksContainer from './UserEditLooksContainer';
import UserEditDemographicsContainer from './UserEditDemographicsContainer';

class UserEditContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      display: "",
      userId: this.props.match.params.id
    }
    this.handleTabClick = this.handleTabClick.bind(this);
  }

  handleTabClick(event){
    const target = event.target;
    const value = target.getAttribute('data-value');

    this.setState({ display: value })
  }

  render(){
    var { display, userId } = this.state;

    var page;
    switch (display) {
      case "":
        page =
        <UserEditAccountContainer userId={ userId } />
      break;
      case "looks":
        page =
        <UserEditLooksContainer userId={ userId } />
      break;
      case "demographics":
        page =
        <UserEditDemographicsContainer userId={ userId } />
      break;
      case "settings":
        page =
        <UserEditSettingsContainer userId={ userId } />
        break;
      default:

    }

    return(
      <div id="user-edit-container">
        <Tabs
          display={this.state.display}
          onClick={this.handleTabClick}
        />
        {page}
      </div>
    )
  }
}

export default UserEditContainer;
