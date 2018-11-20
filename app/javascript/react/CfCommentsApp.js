import React from 'react';

import CommentingContainer from './containers/comments/CommentingContainer';

class CfCommentsApp extends React.Component {

  render(){
    var commentRoot = document.getElementById('cf-comments-app')

    return (
      <div id="cf-commenting-container">
        <CommentingContainer
          commentRoot={commentRoot}
          />
      </div>
    )
  }
}

export default CfCommentsApp;
