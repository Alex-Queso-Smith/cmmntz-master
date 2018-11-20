import React from 'react';

import { FetchDidMount } from '../../util/CoreUtil';
import { CommentLengthSorter } from '../../util/CommentUtil';
import Comment from '../../components/comments/Comment';

class CommentsList extends React.Component {
  state = {
    replyParent: null
  }

  handleReplyOpen = this.handleReplyOpen.bind(this);

  handleReplyOpen(commentId){
    this.setState({ replyParent: commentId })
  }

  render(){

    var commentsArray;
    var { allComments, percentShow, commentRoot, handleTopChange, followedUsers, blockedUsers } = this.props

    if (allComments) {
      commentsArray = allComments.map((comment) => {

        var { user_name, gender, age_range, user_id} = comment.user
        var { id, text, created_at, edited, replies, vote_percents, current_users_votes, user_has_voted } = comment
        var userName, commentLength;
        var lengthImage = CommentLengthSorter(text)
        var userFollowed = followedUsers.includes(user_id)
        var userBlocked = blockedUsers.includes(user_id)

        if (user_name) {
          userName = `${user_name}`
        }
        if (!userBlocked) {
          return(
            <div className="cf-comment-div" key={id}>
              <Comment
                edited={edited}
                userFollowed={userFollowed}
                userBlocked={userBlocked}
                followedUsers={followedUsers}
                blockedUsers={blockedUsers}
                commentUserId={user_id}
                commentId={id}
                userName={userName}
                userInfo={comment.user}
                createdAt={created_at}
                lengthImage={lengthImage}
                text={text}
                replies={replies}
                commentVotes={current_users_votes}
                votePercents={vote_percents}
                userVoted={user_has_voted}
                handleTopChange={handleTopChange}
                handleReplyOpen={this.handleReplyOpen}
                replyParent={this.state.replyParent}
                artId={commentRoot.getAttribute('data-art-id')}
                currentUserId={commentRoot.getAttribute('data-user-id')}
                artType={commentRoot.getAttribute('data-art-type')}
                />
              <hr />
            </div>
          )
        }
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
