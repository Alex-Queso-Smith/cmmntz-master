import React from 'react';

import { FetchDidMount } from '../../util/CoreUtil';
import { CommentLengthSorter } from '../../util/CommentUtil';
import VotingContainerBase from '../../components/voting/VotingContainerBase'
import Comment from '../../components/comments/Comment';

class CommentsList extends React.Component {
  state = {}

  render(){

    var commentsArray;
    var { allComments, percentShow, handleDelayClick } = this.props

    if (allComments) {
      commentsArray = allComments.map((comment) => {
        var { user_name, gender, age_range, user_id} = comment.user
        var { id, text, created_at, edit_date } = comment
        var userInfo, commentLength;
        var image = CommentLengthSorter(comment.text)

        if (user_name == '') {
          userInfo = "Anonymous"
        } else {
          userInfo = `${comment.user.user_name} - ${comment.user.gender} - ${comment.user.age_range}`
        }

        return(
          <div className="cf-comment-div" key={id}>
            <Comment
              editDate={edit_date}
              commentUserId={user_id}
              commentId={id}
              userInfo={userInfo}
              createdAt={created_at}
              image={image}
              text={text}
              userId={this.props.commentRoot.getAttribute('data-user-id')}
            />
            <VotingContainerBase
              commentId={id}
              commentRoot={this.props.commentRoot}
              commentVotes={comment.current_users_votes}
              votePercents={comment.vote_percents}
              userVoted={comment.user_has_voted}
              handleDelayClick={handleDelayClick}
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
