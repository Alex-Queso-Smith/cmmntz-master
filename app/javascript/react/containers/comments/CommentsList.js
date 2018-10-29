import React from 'react';

import { FetchDidMount } from '../../util/CoreUtil';
import { CommentLengthSorter } from '../../util/CommentUtil';
import VotingContainerBase from '../../components/voting/VotingContainerBase'
import Comment from '../../components/comments/Comment';

class CommentsList extends React.Component {
  state = {}

  render(){

    var commentsArray;
    var { allComments, percentShow, handleDelayClick, commentRoot } = this.props

    if (allComments) {
      commentsArray = allComments.map((comment) => {
        var { user_name, gender, age_range, user_id} = comment.user
        var { id, text, created_at, edit_date, replies, vote_percents, current_users_votes, user_has_voted } = comment
        var userInfo, commentLength;
        var lengthImage = CommentLengthSorter(text)

        if (user_name == '') {
          userInfo = "Anonymous"
        } else {
          userInfo = `${user_name} - ${gender} - ${age_range}`
        }

        return(
          <div className="cf-comment-div" key={id}>
            <Comment
              editDate={edit_date}
              commentUserId={user_id}
              commentId={id}
              userInfo={userInfo}
              createdAt={created_at}
              lengthImage={lengthImage}
              text={text}
              replies={replies}
              artId={commentRoot.getAttribute('data-art-id')}
              currentUserId={commentRoot.getAttribute('data-user-id')}
              artType={commentRoot.getAttribute('data-art-type')}
            />
            <VotingContainerBase
              commentId={id}
              commentRoot={commentRoot}
              commentVotes={current_users_votes}
              votePercents={vote_percents}
              userVoted={user_has_voted}
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
