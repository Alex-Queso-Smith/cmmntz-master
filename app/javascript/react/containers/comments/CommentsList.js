import React from 'react';

import { FetchWithPull } from '../../util/CoreUtil';
import VotingContainerBase from '../../components/voting/VotingContainerBase'

class CommentsList extends React.Component {
  state = {}

  render(){
    var commentsArray;
    var { allComments } = this.props

    if (allComments) {
      commentsArray = allComments.map((comment) => {
        debugger
        var { user_name, gender, age_range } = comment.user
        var { id, text, created_at } = comment
        var userInfo;

        if (user_name == '') {
          userInfo = "Anonymous"
        } else {
          userInfo = `${comment.user.user_name} - ${comment.user.gender} - ${comment.user.age_range}`
        }
        return(
          <div className="cf-comment-div" key={comment.id}>
            <div className="cf-comment-user" >
              {userInfo}
            </div>
            <div className="cf-comment-at" >
              {created_at}
            </div>
            <div className="cf-comment-text" >
              {text}
            </div>
            <VotingContainerBase
              commentId={id}
            />
            <hr />
          </div>
        )
      })
    }

    return(
      <div>
        {commentsArray}
      </div>
    )
  }
}

export default CommentsList;
