import React from 'react';

import { FetchWithUpdate, CreateErrorElements, CheckInputValidation } from '../../util/CoreUtil';
import { ReplyFieldActivated, ReplyButtonActive, ReplyButtonInactive, ReplyCancelButton } from '../../components/comments/CommentComponents';
import Modal from '../../components/modals/Modal';
import Reply from '../../components/comments/Reply';

class RepliesContainer extends React.Component {
  state = {
    showReplies: false,
    anonModalShow: false,
    anonModalShown: false,
    replyActive: false,
    replyAnonymous: false,
    replyText: '',
    replies: this.props.replies,
    replyErrors: {}
  }

  handleStateFlip = this.handleStateFlip.bind(this);
  handleShowAnonModal = this.handleShowAnonModal.bind(this);
  handleCloseAnonModal = this.handleCloseAnonModal.bind(this);
  handleChange = this.handleChange.bind(this);
  handleCancelReply = this.handleCancelReply.bind(this);
  handleSuccessfulReply = this.handleSuccessfulReply.bind(this);
  handleReplySubmit = this.handleReplySubmit.bind(this);

  componentDidUpdate(prevProps, prevState){
    if (prevState.replyText != this.state.replyText) {
      CheckInputValidation(this, [this.state.replyText])
      if (
        !this.state.anonModalShown &&
        this.state.replyAnonymous
      ) {
        this.handleShowAnonModal()
      }
    }
  }

  handleStateFlip(event){
    event.preventDefault();
    const target = event.target;
    const name = event.target.name;
    const state = this.state[name];

    this.setState({ [name]: !state })
  }

  handleChange(event){
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({ [name]: value })
  }

  handleShowAnonModal(){
    this.setState({
      anonModalShow: true,
      anonModalShown: true
    });
    document.body.classList.add("cf-modal-locked");
  }

  handleCloseAnonModal(){
    this.setState({ anonModalShow: false });
    document.body.classList.remove("cf-modal-locked");
  }

  handleCancelReply(){
    this.setState({
      replyActive: false,
      replyAnonymous: false,
      replyErrors: {},
      replyText: ''
    })
  }

  handleSuccessfulReply(){
    this.setState({
      replyErrors: {},
      replyText: '',
      showReplies: true
    })
  }

  handleReplySubmit(event){
    event.preventDefault();

    var newReply = new FormData();
    var { artId, artType, currentUserId, commentId } = this.props
    var { replyText, replyAnonymous } = this.state
    var allComments;

    newReply.append("comment[text]", replyText)
    newReply.append("comment[art_id]", artId)
    newReply.append("comment[art_type]", artType)
    newReply.append("comment[user_id]", currentUserId)
    newReply.append("comment[anonymous]", replyAnonymous)
    newReply.append("comment[parent_id]", commentId)

    FetchWithUpdate(this, `/api/v1/comments.json`, 'POST', newReply)
    .then(body => {
      if (body.errors) {
        this.setState({ replyErrors: body.errors})
      } else {
        var id = this.props.commentId
        var commentReplies = body.comments.find(c => c.id === id).replies
        this.setState({ replies: commentReplies })
        this.handleSuccessfulReply()
      }
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));

  }

  render(){
    var { followedUsers, blockedUsers, currentUserId } = this.props;
    var { replies } = this.state;
    var repliesList, anonModal, replyField, replyButton, cancelReplyButton, replyErrorText;
    var blockedCount = 0;

    if (replies && this.state.showReplies) {
       var commentReplies = replies.map((reply) => {

        var followed = followedUsers.includes(reply.user.user_id)
        var blocked = blockedUsers.includes(reply.user.user_id)
        var { id, user, text, created_at, vote_percents, user_has_voted, current_users_votes } = reply
        
        if (!blocked) {
          return(
            <Reply
              key={id}
              replyId={id}
              user={user}
              reply={text}
              posted={created_at}
              userFollowed={followed}
              userBlocked={blocked}
              userVoted={user_has_voted}
              replyUserId={user.user_id}
              currentUserId={currentUserId}
              commentVotes={current_users_votes}
              votePercents={vote_percents}
              />
          )
        } else {
          blockedCount ++
        }
      })
      repliesList =
      <div className="cf-comment-replies">
        {commentReplies}
      </div>
    }

    if (replies.length > 0){ // will alway show without the explicit len check
      var buttonText = this.state.showReplies ? "Hide" : "Show"
      var showBlockedCount, repliesCount;
      var showRepliesButton = <button className="btn btn-primary btn-sm margin-left-10px" name="showReplies" onClick={this.handleStateFlip}>{buttonText}</button>

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

    if (this.state.anonModalShow) {
      anonModal =
      <Modal
        handleClose={this.handleCloseAnonModal}
        modalTitle={'Do you wish to post anonymously?'}
      >
      If you wish to take advantage of ...... please do not post anonymously, thanks pal!
      </Modal>
    }

    if (this.state.replyErrors) { replyErrorText = CreateErrorElements(this.state.replyErrors.text, "Reply") }

    if (this.state.replyActive) {
      replyField = ReplyFieldActivated(this)
      replyButton = ReplyButtonActive(this)
      cancelReplyButton = ReplyCancelButton(this)
    } else {
      replyButton = ReplyButtonInactive(this)
    }

    return(
      <div className="cf-comment-replies-container">
        <div className="cf-comment-replies-wrapper">
          {repliesCount}
          {showRepliesButton}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <span >
            {showBlockedCount}
          </span>
          {repliesList}
        </div>
        <div className="cf-comment-reply-field  margin-top-10px">
        {replyField}
          <div>
            {replyErrorText}
          </div>
          <div>
            {replyButton}
            {cancelReplyButton}
          </div>
          {anonModal}
        </div>
      </div>
    )
  }
}

export default RepliesContainer;
