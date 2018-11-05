import React from 'react';

import CommentingContainer from './containers/comments/CommentingContainer';

class CfCommentsApp extends React.Component {

  render(){
    var commentRoot = document.getElementById('cf-comments-app')

    return (
      <CommentingContainer
        commentRoot={commentRoot}
      />
    )
  }
}

export default CfCommentsApp;
