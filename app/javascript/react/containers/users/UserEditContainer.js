import React from 'react';
import { Link } from 'react-router-dom';

import Tabs from '../../components/settings/Tabs';
import UserEditSettingsContainer from './UserEditSettingsContainer';
import UserEditAccountContainer from './UserEditAccountContainer';
import UserEditLooksContainer from './UserEditLooksContainer';
import UserEditDemographicsContainer from './UserEditDemographicsContainer';
import UserEditPasswordContainer from './UserEditPasswordContainer';
import FeedbackFormContainer from '../FeedbackFormContainer';

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
        <UserEditAccountContainer userId={ userId } history={this.props.history} />
      break;
      case "looks":
        page =
        <UserEditLooksContainer userId={ userId } history={this.props.history} />
      break;
      case "demographics":
        page =
        <UserEditDemographicsContainer userId={ userId } history={this.props.history} />
      break;
      case "settings":
        page =
        <UserEditSettingsContainer userId={ userId } history={this.props.history} />
        break;
      case "password":
        page =
        <UserEditPasswordContainer userId={ userId } history={this.props.history} />
        break;
      default:

    }

    return(
      <div id="user-edit-container">
        <Link className="margin-left-10px" to={''} onClick={ () => { this.props.history.goBack() } }>Back to Articles</Link>
        <Tabs
          display={this.state.display}
          onClick={this.handleTabClick}
        />
        {page}
        <hr />
        <FeedbackFormContainer
          userId={this.state.userId}
        />
      </div>
    )
  }
}

export default UserEditContainer;
