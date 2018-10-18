import React from 'react';

import { FetchWithPull } from '../../util/CoreUtil';

class CommentsList extends React.Component {
  state = { comments: [] }

  componentDidMount(){
    var commentRoot = this.props.commentRoot
    var artType = commentRoot.getAttribute('data-art-type')
    var artId = commentRoot.getAttribute('data-art-id')

    FetchWithPull(this, `/api/v1/comments.json?art_type=${artType}&art_id=${artId}`)
    .then(body => {
     this.setState({ comments: body.comments })
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  render(){
    var allComments;
    var { comments } = this.state

    if (comments) {
      allComments = comments.map((comment) => {
        return(
          <div className="cf-comment-div" key={comment.text}>
            <div className="cf-comment-user" >
              {comment.user.user_name} - {comment.user.gender} - {comment.user.age_range}
            </div>
            <div className="cf-comment-at" >
              {comment.created_at}
            </div>
            <div className="cf-comment-text" >
              {comment.text}
            </div>
            <hr />
          </div>
        )
      })
    }

    return(
      <div>
        {allComments}
      </div>
    )
  }
}

export default CommentsList;
