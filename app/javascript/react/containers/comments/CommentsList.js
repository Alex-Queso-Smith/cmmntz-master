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
    var { allComments, percentShow, handleTopChange, followedUsers, blockedUsers, artType, artId, userId , artSettings, updateAppState, adminStatus, censored } = this.props

    if (allComments) {
      commentsArray = allComments.map((comment) => {

        var handleDeleteComment = () => {
          this.props.deleteComment(comment.id)
        }

        var handleBanUser = () => {
          this.props.banUser(comment.user.user_id)
        }

        var { user_name, gender, age_range, user_id, show_censored} = comment.user
        var { id, text, created_at, edited, replies, vote_percents, current_users_votes, user_has_voted, censored_text, total_interactions, vote_counts } = comment
        var userName, commentLength;

        var shownText = text;
        var lengthImage = CommentLengthSorter(text)
        var userFollowed = followedUsers.includes(user_id)
        var userBlocked = blockedUsers.includes(user_id)

        if (censored) {
          shownText = censored_text
        }
        if (user_name) {
          userName = `${user_name}`
        }

        var showCensored = true;

        if (censored && user_id != userId) {
          if (show_censored === "false") {
            showCensored = false
          }
        }

        if (!userBlocked && showCensored ) {
          return(
            <div className="cf-comment-div" key={id}>
              <Comment
                adminStatus={adminStatus}
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
                text={shownText}
                replies={replies}
                commentVotes={current_users_votes}
                votePercents={vote_percents}
                userVoted={user_has_voted}
                handleTopChange={handleTopChange}
                handleReplyOpen={this.handleReplyOpen}
                replyParent={this.state.replyParent}
                artId={artId}
                currentUserId={userId}
                artType={artType}
                censored={censored}
                artSettings={artSettings}
                updateAppState={updateAppState}
                handleDeleteComment={handleDeleteComment}
                banCommentUser={handleBanUser}
                banUser={this.props.banUser}
                handleBanUser={handleBanUser}
                galleryId={this.props.galleryId}
                totalInteractions={total_interactions}
                voteCounts={vote_counts}
                showVoteCountTrigger={this.props.showVoteCountTrigger}
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
