import React from 'react';

import { FetchDidMount } from '../../util/CoreUtil';
import { CommentLengthSorter } from '../../util/CommentUtil';
import Comment from '../../components/comments/Comment';

class CommentsList extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      replyParent: null,
      allComments: this.props.allComments
    }
    this.handleReplyOpen = this.handleReplyOpen.bind(this);
    this.handleEditUpdate = this.handleEditUpdate.bind(this);
  }

  componentDidUpdate(prevProps, prevState){
    if (prevProps.allComments != this.props.allComments) {
      this.setState({ allComments: this.props.allComments })
    }
  }

  handleReplyOpen(commentId){
    this.setState({ replyParent: commentId })
  }

  handleEditUpdate(commentId, text){
    var updateComments = this.state.allComments;

    updateComments.find(comment => comment.id === commentId).text = text
    this.setState({ allComments: updateComments })
  }

  render(){

    var commentsArray;
    var { allComments } = this.state;
    var { percentShow, followedUsers, blockedUsers, artType, artId, currentUserId , artSettings, updateAppState, adminStatus, guestStatus, censored } = this.props

    if (allComments) {
      commentsArray = allComments.map((comment) => {

        var handleDeleteComment = () => {
          this.props.deleteComment(comment.id)
        }

        var handleBanUser = (event) => {
          this.props.banUser(comment.user.user_id, event)
        }

        var { id, edited, text, created_at, vote_percents, user_has_voted, current_users_votes, censored_text, vote_counts, total_interactions, replies } = comment
        var { user_name, gender, age_range, user_id, show_censored} = comment.user

        var shownText = text;
        if (censored && censored_text) {
          shownText = censored_text
        }

        var lengthImage = CommentLengthSorter(text)
        var userFollowed = followedUsers.includes(user_id)
        var userBlocked = blockedUsers.includes(user_id)

        var userName;
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
                guestStatus={guestStatus}
                edited={edited}
                userFollowed={userFollowed}
                userBlocked={userBlocked}
                commentUserId={user_id}
                commentId={id}
                userName={userName}
                userInfo={comment.user}
                lengthImage={lengthImage}
                createdAt={created_at}
                text={shownText}
                userVoted={user_has_voted}
                currentUserId={currentUserId}
                commentVotes={current_users_votes}
                votePercents={vote_percents}
                voteCounts={vote_counts}
                totalInteractions={total_interactions}
                artSettings={artSettings}
                updateAppState={updateAppState}
                handleBanUser={handleBanUser}
                handleDeleteComment={handleDeleteComment}
                showVoteCountTrigger={this.props.showVoteCountTrigger}
                handleEditUpdate={this.handleEditUpdate}
                isReply={comment.reply}

                artId={artId}
                artType={artType}
                censored={censored}
                galleryId={this.props.galleryId}

                handleTopChange={this.props.handleTopChange}

                replyParent={this.state.replyParent}
                handleReplyOpen={this.handleReplyOpen}
                banUser={this.props.banUser}
                replies={replies}
                followedUsers={followedUsers}
                blockedUsers={blockedUsers}
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
