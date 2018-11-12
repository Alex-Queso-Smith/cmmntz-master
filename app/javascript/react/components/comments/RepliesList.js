import React from 'react';
import Reply from './Reply';

class RepliesList extends React.Component {
  state = {}

  render(){
    var { replies, showReplies, followedUsers, blockedUsers, currentUserId } = this.props;
    var repliesContainer;
    var blockedCount = 0;

    if (replies && showReplies) {
       var commentReplies = replies.map((reply) => {

        var followed = followedUsers.includes(reply.user.user_id)
        var blocked = blockedUsers.includes(reply.user.user_id)
        var { id, user, text, created_at } = reply
        if (!blocked) {
          return(
            <Reply
              key={id}
              user={user}
              reply={text}
              posted={created_at}
              userFollowed={followed}
              userBlocked={blocked}
              replyUserId={user.user_id}
              currentUserId={currentUserId}
              />
          )
        } else {
          blockedCount ++
        }
      })
      repliesContainer =
      <div className="cf-comment-replies">
        {commentReplies}
      </div>
    }

    if (replies.length > 0){ // will alway show without the explicit len check
      var buttonText = showReplies ? "Hide" : "Show"
      var showBlockedCount, repliesCount;

      if (blockedCount > 1) {
        showBlockedCount = `${blockedCount} replies have been blocked`
      } else if (blockedCount > 0) {
        showBlockedCount = `${blockedCount} reply has been blocked`
      }

      if (replies.length === 1) {
        repliesCount =
        <span className="cf-replies-count">
          There is {replies.length} reply to this comment
        </span>
      } else {
        repliesCount =
        <span className="cf-replies-count">
          There are {replies.length} replies to this comment
        </span>
      }
    }


    return(
      <div className="cf-comment-replies-wrapper">
        {repliesCount}
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <button className="btn btn-primary btn-sm" name="showReplies" onClick={this.props.handleStateFlip}>{buttonText}</button>
        <span className="margin-left-5px">
          {showBlockedCount}
        </span>
        {repliesContainer}
      </div>
    )
  }
}

export default RepliesList;
