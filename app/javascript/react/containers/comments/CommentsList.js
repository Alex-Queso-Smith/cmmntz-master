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
        var userInfo, commentLength;
        var image = CommentLengthSorter(comment)
debugger
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
              Comment Length:
              <img src={image} />
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
