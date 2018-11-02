import React from 'react';

import { FetchDidMount } from '../../util/CoreUtil';
import { CommentLengthSorter } from '../../util/CommentUtil';
import Comment from '../../components/comments/Comment';

class CommentsList extends React.Component {
  state = {}

  render(){

    var commentsArray;
    var { allComments, percentShow, handleDelayClick, commentRoot, handleTopChange } = this.props

    if (allComments) {
      commentsArray = allComments.map((comment) => {

        var { user_name, gender, age_range, user_id} = comment.user
        var { id, text, created_at, edited, replies, vote_percents, current_users_votes, user_has_voted } = comment
        var userName, commentLength;
        var lengthImage = CommentLengthSorter(text)

        if (user_name) {
          userName = `${user_name}`
        }

        return(
          <div className="cf-comment-div" key={id}>
            <Comment
              edited={edited}
              commentUserId={user_id}
              commentId={id}
              userName={userName}
              userInfo={comment.user}
              createdAt={created_at}
              lengthImage={lengthImage}
              text={text}
              replies={replies}
              commentRoot={commentRoot}
              commentVotes={current_users_votes}
              votePercents={vote_percents}
              userVoted={user_has_voted}
              handleDelayClick={handleDelayClick}
              handleTopChange={handleTopChange}
              artId={commentRoot.getAttribute('data-art-id')}
              currentUserId={commentRoot.getAttribute('data-user-id')}
              artType={commentRoot.getAttribute('data-art-type')}
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
