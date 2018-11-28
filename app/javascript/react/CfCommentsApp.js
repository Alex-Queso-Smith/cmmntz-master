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
      artSettings: {
        disabled: false,
        deactivated: false
      }
    }
  }

  render(){
    var { commentRoot, userId, artType, artId, artSettings } = this.state;

    return (
      <div id="cf-commenting-container" className="container-fluid">
        <CommentingContainer
          userId={userId}
          artType={artType}
          artId={artId}
          commentRoot={commentRoot}
          artSettings={artSettings}
          />
      </div>
    )
  }
}

export default CfCommentsApp;
