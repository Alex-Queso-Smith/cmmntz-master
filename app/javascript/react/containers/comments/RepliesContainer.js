import React from 'react';

import { FetchWithUpdate, FetchIndividual, CreateErrorElements, CheckInputValidation } from '../../util/CoreUtil';
import { CommentLengthSorter } from '../../util/CommentUtil';
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
  deleteReply = this.deleteReply.bind(this);

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

    if (prevProps.replyParent != this.props.replyParent) {
      if (this.props.commentId != this.props.replyParent) {
        this.handleCancelReply()
      }
    }
  }

  handleStateFlip(event){
    event.preventDefault();
    const target = event.target;
    const name = event.target.name;
    const state = this.state[name];

    if (name === 'replyActive') {
      this.setState({ [name]: !state })
      this.props.handleReplyOpen(this.props.commentId)
    } else {
      this.setState({ [name]: !state })
    }
  }

  handleChange(event){
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (name === 'replyAnonymous' && !this.state.anonModalShown) {
      this.setState({
        [name]: value,
        anonModalShow: true,
        anonModalShown: true
      })
    } else {
      this.setState({ [name]: value })
    }
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
        var artErrors = body.errors["art"]
        if (artErrors) {
          alert(artErrors[0])

          var artSettings = this.props.artSettings
          artSettings[artErrors[1]] = true
          this.props.updateAppState("artSettings", artSettings)
        }

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

  deleteReply(replyId){
    var { galleryId } = this.props;
    var c = confirm("Are you sure you want to delete this reply?")
    if (c) {
      var updateComment = new FormData()
      updateComment.append("comment[deleted]", true)

      FetchWithUpdate(this, `/api/v1/comments/${replyId}.json?gallery_id=${galleryId}`, "DELETE", updateComment )
      .then(success => {
        var allReplies = this.state.replies;
        var filteredReplies = allReplies.filter(reply => reply.id != replyId)
        this.setState({ replies: filteredReplies })
        var test = this.state.replies
      })
      .catch(error => console.error(`Error in fetch: ${error.message}`));
    }
  }

  banUser(userId){
    var c = confirm("Do you wish to ban this user? You may unban from the admin console at any time.")
    var { galleryId, artId } = this.props;

    if (c) {
      FetchIndividual(this, `/api/v1/gallery_blacklistings.json?gallery_id=${galleryId}&user_id=${userId}`, "POST")
      .then(success => { alert("This user has been banned, login to admin console if you wish to unban at a future date.") })
      .then(finished => {
        var allReplies = this.state.replies;
        var filteredReplies = allReplies.filter(reply => reply.user.user_id != userId)
        this.setState({ replies: filteredReplies })
      })
      .catch(error => console.error(`Error in fetch: ${error.message}`));
    }
  }

  render(){
    var { followedUsers, blockedUsers, currentUserId, censored, artSettings } = this.props;
    var { replies } = this.state;
    var repliesList, anonModal, replyField, replyButton, cancelReplyButton, replyErrorText, repliesWrapper;
    var blockedCount = 0;


    if (replies && this.state.showReplies) {
       var commentReplies = replies.map((reply) => {

        var followed = followedUsers.includes(reply.user.user_id)
        var blocked = blockedUsers.includes(reply.user.user_id)
        var { id, edited, user, text, created_at, vote_percents, user_has_voted, current_users_votes, censored_text } = reply
        var lengthImage = CommentLengthSorter(text)

        var handleNewReplyBox = () => {
          this.props.handleReplyOpen(this.props.commentId)
        }

        var handleBanUser = () => {
          this.banUser(reply.user.user_id)
        }

        var handleDeleteReply = () => {

          this.deleteReply(reply.id)
        }

        var shownText = text;
        if (censored && censored_text) {
          shownText = censored_text
        }

        if (!blocked) {
          return(
            <Reply
              key={id}
              handleNewReplyBox={handleNewReplyBox}
              replyId={id}
              user={user}
              lengthImage={lengthImage}
              edited={edited}
              text={shownText}
              posted={created_at}
              userFollowed={followed}
              userBlocked={blocked}
              userVoted={user_has_voted}
              replyUserId={user.user_id}
              currentUserId={currentUserId}
              commentVotes={current_users_votes}
              votePercents={vote_percents}
              artSettings={this.props.artSettings}
              updateAppState={this.props.updateAppState}
              handleBanUser={handleBanUser}
              handleDeleteReply={handleDeleteReply}
              adminStatus={this.props.adminStatus}
              updateAppState={this.props.updateAppState}
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
      var showRepliesButton = <button className="btn show-replies-button btn-sm margin-left-10px" name="showReplies" onClick={this.handleStateFlip}>{buttonText}</button>

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

    if (!artSettings.disabled) {
      if (this.state.replyActive) {
        replyField = ReplyFieldActivated(this)
        replyButton = ReplyButtonActive(this)
        cancelReplyButton = ReplyCancelButton(this)
      } else {
        replyButton = ReplyButtonInactive(this)
      }
    }

    if (replies.length != 0) {
      repliesWrapper =
      <div className="cf-comment-replies-wrapper">
        {repliesCount}
        {showRepliesButton}
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <span >
          {showBlockedCount}
        </span>
        {repliesList}
      </div>
    }

    return(
      <div className="cf-comment-replies-container">
        {repliesWrapper}
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
