import React from 'react';

import CommentsFormContainer from './CommentsFormContainer';
import CommentsList from './CommentsList';

class CommentsContainer extends React.Component {
  state = {}

  render(){

    return(
      <div>
        <CommentsFormContainer
          commentRoot={this.props.commentRoot}
        />
        <hr />
        <CommentsList
          commentRoot={this.props.commentRoot}
        />
      </div>
    )
  }
}

export default CommentsContainer;
