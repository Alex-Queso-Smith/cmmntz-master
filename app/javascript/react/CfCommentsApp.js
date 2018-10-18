import React from 'react';
import { Route, BrowserRouter as Router, Link } from 'react-router-dom';

import CommentsContainer from './containers/comments/CommentsContainer';

class CfCommentsApp extends React.Component {

  render(){
    var commentRoot = document.getElementById('cf-comments-app')

    return (
      <CommentsContainer
        commentRoot={commentRoot}
      />
    )
  }
}

export default CfCommentsApp;
