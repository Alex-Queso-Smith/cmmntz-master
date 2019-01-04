import React from 'react';

import CommentingContainer from './containers/comments/CommentingContainer';
import PrivacyPolicy from './components/modals/PrivacyPolicy';
import { FetchDidMount, FetchIndividual } from './util/CoreUtil';

class CfCommentsApp extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      commentRoot: document.getElementById('cf-comments-app'),
      userId: document.getElementById('cf-comments-app').getAttribute('data-user-id'),
      artType: document.getElementById('cf-comments-app').getAttribute('data-art-type'),
      artId: document.getElementById('cf-comments-app').getAttribute('data-art-id'),
      galleryId: document.getElementById('cf-comments-app').getAttribute('data-gallery-id'),
      themeSettings: {
        font: document.getElementById('cf-comments-app').getAttribute('data-user-font'),
        color: document.getElementById('cf-comments-app').getAttribute('data-user-theme'),
      },
      artSettings: {
        disabled: false,
        deactivated: false,
        blacklisted: false,
        disabledMessage: "",
        userCanPost: true
      }
    }
    this.handleAppSetState = this.handleAppSetState.bind(this)
  }

  handleAppSetState(key, val) {
    this.setState({ [key]: val })
  }

  componentDidMount() {
  
    FetchDidMount(this, `/api/v1/arts/${this.state.artId}.json`)
    .then(artData => {

      var newArtSettings = this.state.artSettings
      newArtSettings.disabled = artData.art.disabled
      newArtSettings.deactivated = artData.art.deactivated
      newArtSettings.userBlacklisted = artData.art.user_blacklisted
      newArtSettings.disabledMessage = artData.art.disabled_message
      // newArtSettings.userCanPost = artData.art.user_can_post
      newArtSettings.userCanPost = true // override to deactivate check

      this.setState({
        artSettings: newArtSettings
      })
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  render(){
    var { commentRoot, userId, artType, artId, artSettings, gallerySettings, userSettings, galleryId } = this.state;
    var displayContainer;

    if (artSettings.userBlacklisted) {
      displayContainer =
      <div className="deactivated-message">
        <h3>You have been blacklisted from this site by the Admins.</h3>
      </div>
    } else if (!artSettings.deactivated) {
      displayContainer =
      <CommentingContainer
        userId={userId}
        artType={artType}
        artId={artId}
        galleryId={galleryId}
        artSettings={artSettings}
        gallerySettings={gallerySettings}
        userSettings={userSettings}
        updateAppState={this.handleAppSetState}
        gallerySettings={gallerySettings}
        banUser={this.banUser}
        />
    } else {
      var msg = "This thread has been deactivated by the site Admins."

      if (artSettings.disabledMessage != "") {
        msg = artSettings.disabledMessage
      }
      displayContainer =
      <div className="deactivated-message">
        <h3>{msg}</h3>
      </div>
    }

    var {font, color} = this.state.themeSettings;
    font = !font ? "serif" : font
    color = !color ? "light" : color

    return (
      <div id="cf-commenting-container" className={`container-fluid ${font} ${color}`}>
        <PrivacyPolicy />
        {displayContainer}
      </div>
    )
  }
}

export default CfCommentsApp;
