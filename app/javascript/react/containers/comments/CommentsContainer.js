import React from 'react';

import CommentsFormContainer from './CommentsFormContainer';

class CommentsContainer extends React.Component {
  state = {}

  render(){
    return(
      <CommentsFormContainer
        commentRoot={this.props.commentRoot}
      />
    )
  }
}

export default CommentsContainer;
