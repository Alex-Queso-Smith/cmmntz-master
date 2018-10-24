import React from 'react';

import { FetchDidMount } from '../../util/CoreUtil';
import { CommentLengthSorter } from '../../util/CommentUtil';
import VotingContainerBase from '../../components/voting/VotingContainerBase'

class CommentsList extends React.Component {
  state = {}

  render(){
    var commentsArray;
    var { allComments } = this.props

    if (allComments) {
      commentsArray = allComments.map((comment) => {
        var { user_name, gender, age_range } = comment.user
        var { id, text, created_at } = comment
        var userInfo;
        var commentLength;

        switch (CommentLengthSorter(comment.text)) {
          case 1:
            commentLength = "0-250"
            break;
          case 2:
            commentLength = "251-500"
            break;
          case 3:
            commentLength = "501-750"
            break;
          case 4:
            commentLength = "751-1000"
            break;
          case 5:
            commentLength = "1000-3000"
            break;
          default:
            commentLength = ''
        }

        if (user_name == '') {
          userInfo = "Anonymous"
        } else {
          userInfo = `${comment.user.user_name} - ${comment.user.gender} - ${comment.user.age_range}`
        }

        return(
          <div className="cf-comment-div" key={id}>
            <div className="cf-comment-user" >
              {userInfo}
            </div>
            <div className="cf-comment-at" >
              {created_at}
            </div>
            <div className="cf-comment-length">
              Comment Length: {commentLength}
            </div>
            <div className="cf-comment-text" >
              {text}
            </div>
            <VotingContainerBase
              commentId={id}
              commentRoot={this.props.commentRoot}
              commentVotes={comment.current_users_votes}
              userVoted={comment.user_has_voted}
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
