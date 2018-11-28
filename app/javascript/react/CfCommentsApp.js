import React from 'react';

import CommentingContainer from './containers/comments/CommentingContainer';
import { FetchDidMount } from './util/CoreUtil';

class CfCommentsApp extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      commentRoot: document.getElementById('cf-comments-app'),
      userId: document.getElementById('cf-comments-app').getAttribute('data-user-id'),
      artType: document.getElementById('cf-comments-app').getAttribute('data-art-type'),
      artId: document.getElementById('cf-comments-app').getAttribute('data-art-id'),
      userThemeSettings: {
        font: 'serif',
        colorTheme: 'light'
      },
      artSettings: {
        disabled: false,
        deactivated: false
      }
    }
  }

  componentDidMount(){
    const userId = this.state.userId

    if (userId.length > 0){
      FetchDidMount(this, `/api/v1/users/${userId}.json`)
      .then(body => {

        var oldUserThemeSettings = this.state.userThemeSettings
        oldUserThemeSettings.font = body.user.font;
        oldUserThemeSettings.colorTheme = body.user.color_theme

        this.setState({ userThemeSettings: oldUserThemeSettings })
      })
      .catch(error => console.error(`Error in fetch: ${error.message}`));
    }
  }

  render(){
    var { commentRoot, userId, artType, artId, userThemeSettings, artSettings } = this.state;

    return (
      <div id="cf-commenting-container" className="container-fluid">
        <CommentingContainer
          userId={userId}
          artType={artType}
          artId={artId}
          commentRoot={commentRoot}
          userThemeSettings={userThemeSettings}
          artSettings={artSettings}
          />
      </div>
    )
  }
}

export default CfCommentsApp;
