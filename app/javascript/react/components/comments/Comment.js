import React from 'react';
import Textarea from 'react-expanding-textarea'

import { FetchBasic, FetchWithUpdate, CreateErrorElements, CheckInputValidation } from '../../util/CoreUtil';
import { Checkbox } from '../form/FormComponents';
import Modal from '../modals/Modal';
import Reply from './Reply';
import UserInfoTile from './UserInfoTile';
import VotingContainerBase from '../voting/VotingContainerBase';

class Comment extends React.Component {
  constructor(props){
    super(props);
      this.state = {
        editStatus: false,
        reply: false,
        replyAnonymous: false,
        updateId: null,
        text: this.props.text,
        edited: this.props.edited,
        replies: this.props.replies,
        userFollowed: this.props.userFollowed,
        userBlocked: this.props.userBlocked,
        replyText: '',
        replyErrors: {},
        formInvalid: true,
        anonModalShown: false,
        anonModalShow: false,
        showReplies: false,
        userTileHover: false,
        showFullText: false
      }
    this.handleChange = this.handleChange.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);
    this.handleCancelEditComment = this.handleCancelEditComment.bind(this);
    this.handleReplySubmit = this.handleReplySubmit.bind(this);
    this.handleCancelReply = this.handleCancelReply.bind(this);
    this.onUserHover = this.onUserHover.bind(this);
    this.handleStateFlip = this.handleStateFlip.bind(this);
    this.handleFollow = this.handleFollow.bind(this);
    this.handleBlock = this.handleBlock.bind(this);
    this.handleShowAnonModal = this.handleShowAnonModal.bind(this);
    this.handleCloseAnonModal = this.handleCloseAnonModal.bind(this);
    this.handleSuccessfulReply = this.handleSuccessfulReply.bind(this);
  }

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

  onUserHover(){
    this.setState({ userTileHover: !this.state.userTileHover })
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

  handleCancelEditComment(){
    if (this.state.edited) {
      this.setState({ editStatus: false })
    } else {
      this.setState({
        editStatus: false,
        text: this.props.text
      })
    }
  }

  handleEditSubmit(event){
    event.preventDefault();
    var newText = new FormData();
    newText.append("comment[text]", this.state.text)

    FetchBasic(this, `/api/v1/comments/${this.props.commentId}.json`, newText, 'PATCH')
    .then(resp => {
      this.setState({
        editStatus: false,
        text: resp.comment.text,
        edited: resp.comment.edited
      })
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  handleCancelReply(){
    this.setState({
      reply: false,
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

  handleFollow(event){
    event.preventDefault();

    var path;
    var newFollow = new FormData();
    newFollow.append("following[following_id]", this.props.commentUserId)
    newFollow.append("following[follower_id]", this.props.currentUserId)

    if (this.state.userFollowed) {
      path = `/api/v1/unfollowings.json`
    } else {
      path = `/api/v1/followings.json`
    }
    FetchWithUpdate(this, path, 'POST', newFollow)
    .then(body => {
      this.setState({ userFollowed: !this.state.userFollowed })
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  handleBlock(event){
    event.preventDefault();

    var path;
    var newBlock = new FormData();
    newBlock.append("blocking[blocking_id]", this.props.commentUserId)
    newBlock.append("blocking[blocker_id]", this.props.currentUserId)

    if (this.state.userBlocked) {
      path = `/api/v1/unblockings.json`
    } else {
      path = `/api/v1/blockings.json`
    }
    FetchWithUpdate(this, path, 'POST', newBlock)
    .then(body => {
      this.setState({ userBlocked: !this.state.userBlocked })
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
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

  render(){
    var { userName, createdAt, lengthImage, currentUserId, commentUserId, artId, userInfo, followedUsers, blockedUsers } = this.props
    var { replies, editStatus, edited, text, reply, replyText, showReplies, replyErrors, userTileHover, userFollowed, userBlocked, formInvalid } = this.state
    var textBox, editButton, cancelButton, lastEdited, commentReplies, commentRepliesWrapper, replyField, replyButton, cancelReplyButton, userTile, repliesContainer, starOpacity, blockOpacity, followStar, blockSym, replyErrorText, anonModal;
    var blockedCount = 0

    if (replyErrors) {
      replyErrorText = CreateErrorElements(replyErrors.text, "Reply")
    }

    if (reply) {
      replyField =
      <div>
        <Textarea
          maxLength="1000"
          className="form-control margin-top-10px textarea"
          name="replyText"
          value={replyText}
          rows={3}
          onChange={this.handleChange}
          />
        <Checkbox
          name="replyAnonymous"
          onChange={this.handleChange}
          label="Submit Anonymously"
          className="margin-top-bottom-10px"
          />
      </div>
      replyButton =
        <button className="btn btn-primary btn-sm" onClick={this.handleReplySubmit} disabled={formInvalid}>
          Submit Reply
        </button>
      cancelReplyButton =
      <button className="btn btn-light btn-sm margin-left-5px" onClick={this.handleCancelReply}>Cancel Reply</button>
    } else {
      replyButton =
      <button className="btn btn-primary btn-sm" name="reply" onClick={this.handleStateFlip}>Reply</button>
    }

    if (replies && showReplies) {

      commentReplies = replies.map((reply) => {
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

      commentRepliesWrapper =
      <div className="cf-comment-replies-wrapper">
        {repliesCount}
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <button className="btn btn-primary btn-sm" name="showReplies" onClick={this.handleStateFlip}>{buttonText}</button>
        <span className="margin-left-5px">
          {showBlockedCount}
        </span>
        {repliesContainer}
      </div>
    }

    if (editStatus && currentUserId === commentUserId) {
      editButton = <button className="btn btn-primary btn-sm" onClick={this.handleEditSubmit}>Edit Comment</button>
      cancelButton = <button className="btn btn-light btn-sm margin-left-5px" onClick={this.handleCancelEditComment}>Cancel Edit</button>
    } else if (currentUserId === commentUserId) {
      editButton = <button className="btn btn-primary btn-sm" name="editStatus" onClick={this.handleStateFlip}>Edit Comment</button>
    }

    if (edited) {
      lastEdited =
      <div className="cf-comment-edit">
        Comment has been Edited
      </div>
    }

    if (editStatus) {
      textBox =
        <Textarea
        maxLength="3000"
        className="form-control margin-top-10px textarea col-sm-10 cf-comment-text-area-edit"
        name="text"
        value={text}
        onChange={ this.handleChange }
        />
    } else {
      if (text.length > 1000) {
        if (!this.state.showFullText) {
          textBox =
          <div className="cf-comment-text" >
            {text.substring(0, 1000) + "..."}
            <a href='#' onClick={this.handleStateFlip} name="showFullText">show more</a>
          </div>
        } else {
          textBox =
          <div className="cf-comment-text" >
            {text}
            <a href='#' onClick={this.handleStateFlip} name="showFullText">show less</a>
          </div>
        }
      } else {
        textBox =
        <div className="cf-comment-text" >
          {text}
        </div>
      }
    }

    if (commentUserId != currentUserId && userName != "Anonymous") {
      if (!userFollowed) {
        starOpacity = "translucent"
      }
      followStar =
      <div className={`col-1 col-sm-1 cursor-pointer ${starOpacity}`}>
        <img onClick={this.handleFollow} src="/assets/star" height="20px" width="20px" />
      </div>
    } else {
      followStar =
      <div className={`col-1 col-sm-1`} />
    }

    if (commentUserId != currentUserId && userName != "Anonymous") {
      if (!userBlocked) {
        blockOpacity = "translucent"
      }
      blockSym =
      <div className={`col-1 col-sm-1 cursor-pointer ${blockOpacity}`}>
        <img onClick={this.handleBlock} src="/assets/block" height="20px" width="20px" />
      </div>
    } else {
      blockSym =
      <div className={`col-1 col-sm-1`}>
      </div>
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

    return(
      <div className="cf-comment">
        {anonModal}
        <div className="cf-comment-wrapper">
          <UserInfoTile
            userTileHover={userTileHover}
            userInfo={userInfo}
            onMouseEnter={this.onUserHover}
            onMouseLeave={this.onUserHover}
            userName={userName}
          />
          <div className="cf-comment-w-meta">
            <div className="cf-comment-comment-meta row">
              <div className="cf-comment-user-name col-6 col-sm-6">
                {this.props.userName}
              </div>
              <div className="cf-comment-length col-6 col-sm-6">
                <div className="float-right">
                  <img src={lengthImage} height="20px" width="20px"/>
                </div>
              </div>
            </div>
            <div className="row">
              {followStar}
              {blockSym}
              <div className="cf-comment-at col-10 col-sm-10" >
                <div className="float-right">
                  {createdAt}
                </div>
              </div>
            </div>
            {textBox}
            {lastEdited}
            <div className="margin-top-5px">
              {editButton}
              {cancelButton}
            </div>
          </div>
        </div>
        <div className="cf-comment-voting">
          <VotingContainerBase
            commentId={this.props.commentId}
            currentUserId={this.props.currentUserId}
            commentVotes={this.props.commentVotes}
            votePercents={this.props.votePercents}
            userVoted={this.props.userVoted}
            handleDelayClick={this.props.handleDelayClick}
            handleTopChange={this.props.handleTopChange}
          />
        </div>
        {commentRepliesWrapper}

        <div className="cf-comment-reply-field  margin-top-10px">
          {replyField}
          <div>
            {replyErrorText}
          </div>
          <div>
            {replyButton}
            {cancelReplyButton}
          </div>
        </div>
      </div>
    )
  }
}

export default Comment;
