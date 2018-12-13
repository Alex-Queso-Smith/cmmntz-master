import React from 'react';
import Textarea from 'react-expanding-textarea'

import { FetchBasic, FetchWithUpdate, CreateErrorElements, CheckInputValidation } from '../../util/CoreUtil';
import { ReplyFieldActivated, ReplyButtonActive, ReplyButtonInactive, ReplyCancelButton } from './CommentComponents';
import { Checkbox } from '../form/FormComponents';
import Modal from '../modals/Modal';
import BanUser from '../modals/BanUser';
import Reply from './Reply';
import RepliesContainer from '../../containers/comments/RepliesContainer';
import UserAvatar from '../../containers/comments/UserAvatar';
import VotingContainerBase from '../voting/VotingContainerBase';

class Comment extends React.Component {
  state = {
    editStatus: false,
    updateId: null,
    text: this.props.text,
    edited: this.props.edited,
    replies: this.props.replies,
    userFollowed: this.props.userFollowed,
    userBlocked: this.props.userBlocked,
    userVoted: this.props.userVoted,
    formInvalid: true,
    userTileHover: false,
    showFullText: false
  }

  onUserHover = this.onUserHover.bind(this);
  handleFollow = this.handleFollow.bind(this);
  handleBlock = this.handleBlock.bind(this);
  handleStateFlip = this.handleStateFlip.bind(this);
  handleChange = this.handleChange.bind(this);
  handleCancelEditComment = this.handleCancelEditComment.bind(this);
  handleEditSubmit = this.handleEditSubmit.bind(this);
  showVotes = this.showVotes.bind(this);
  updateUserVoted = this.updateUserVoted.bind(this);

  handleChange(event){
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({ [name]: value })
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

  handleCancelEditComment(){
    this.setState({
      editStatus: false,
      text: this.props.text
    })
  }

  handleEditSubmit(event){
    event.preventDefault();

    var { text } = this.state;

    var newText = new FormData();
    newText.append("comment[text]", text)

    FetchBasic(this, `/api/v1/comments/${this.props.commentId}.json`, newText, 'PATCH')
    .then(body => {
      if (body.errors) {
        var artErrors = body.errors["art"]
        if (artErrors) {
          alert(artErrors[0])

          this.setState({
            editStatus: false,
            text: this.props.text
          })

          var artSettings = this.props.artSettings
          artSettings[artErrors[1]] = true
          if (artErrors[2]) {
            artSettings['disabledMessage'] = artErrors[2]
          }
          this.props.updateAppState("artSettings", artSettings)
        }
      } else {
        this.setState({
          editStatus: false,
          edited: body.comment.edited
        })
        this.props.handleEditUpdate(this.props.commentId, text)
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
      if (this.state.userBlocked) {
        this.setState({
          userFollowed: !this.state.userFollowed,
          userBlocked: !this.state.userBlocked
        })
      } else {
        this.setState({
          userFollowed: !this.state.userFollowed
        })
      }
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
      if (this.state.userFollowed) {
        this.setState({
          userBlocked: !this.state.userBlocked,
          userFollowed: !this.state.userFollowed
        })
      } else {
        this.setState({
          userBlocked: !this.state.userBlocked
        })
      }
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  showVotes(){
    this.setState({ userVoted: true })
    this.props.showVoteCountTrigger()
  }

  updateUserVoted(){
    this.setState({ userVoted: true })
  }

  render(){
    var { userName, createdAt, lengthImage, currentUserId, commentUserId, artId, artType, commentId, userInfo, followedUsers, blockedUsers, censored, artSettings, updateAppState, galleryId } = this.props
    var { replies, editStatus, edited, text, userTileHover, userFollowed, userBlocked, formInvalid, userVoted } = this.state

    var followStar, blockSym, starOpacity, blockOpacity;
    if (commentUserId != currentUserId && userName != "Anonymous") {
      if (!userFollowed) { starOpacity = "translucent" }
      followStar =
      <div className={`col-sm-1 block-follow-box cursor-pointer ${starOpacity}`}>
        <img onClick={this.handleFollow} src="/assets/star" height="20px" width="20px" />
      </div>

      if (!userBlocked) { blockOpacity = "translucent" }
      blockSym =
      <div className={`col-sm-1 block-follow-box cursor-pointer ${blockOpacity}`}>
        <img onClick={this.handleBlock} src="/assets/block" height="20px" width="20px" />
      </div>

    } else {
      followStar = <div className={`col-sm-1 block-follow-box`} />
      blockSym = <div className={`col-sm-1 block-follow-box`} />
    }

    var textBox;
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
      var text_length = 400 ;
      if (text.length > text_length) {
        if (!this.state.showFullText) {
          textBox =
          <div className="cf-comment-text" >
            <div className="display-linebreak" dangerouslySetInnerHTML={{__html: text.substring(0, text_length) + "..."}} />
            <br />
            <a href='#' onClick={this.handleStateFlip} name="showFullText" className="link-text">show more</a>
          </div>
        } else {
          textBox =
          <div className="cf-comment-text" >
            <div className="display-linebreak" dangerouslySetInnerHTML={{__html: text}} />
            <br />
            <a href='#' onClick={this.handleStateFlip} name="showFullText" className="link-text">show less</a>
          </div>
        }
      } else {
        textBox =
        <div className="cf-comment-text" >
          <div className="display-linebreak" dangerouslySetInnerHTML={{__html: text}} />
        </div>
      }
    }

    var lastEdited;
    if (edited) {
      lastEdited =
      <div className="cf-comment-edit">
        Comment has been Edited
      </div>
    }

    var editButton, cancelButton;
    if (!artSettings.disabled) {
      if (editStatus && currentUserId === commentUserId) {
        editButton = <button className="btn btn-sm comment-button" onClick={this.handleEditSubmit}>Edit Comment</button>
        cancelButton = <button className="btn btn-sm comment-cancel-button" onClick={this.handleCancelEditComment}>Cancel</button>
      } else if (currentUserId === commentUserId) {
        editButton = <button className="btn btn-sm comment-button" name="editStatus" onClick={this.handleStateFlip}>Edit Comment</button>
      }
    }

    var adminFlag;
    if (this.props.userInfo.gallery_admin) {
      adminFlag =
      " - Mod"
    }

    var deleteCommentButton, banUserButton;
    if (this.props.adminStatus && commentUserId != currentUserId) {
      deleteCommentButton =
      <button className="btn btn-sm red-outline-button margin-all-5px" onClick={this.props.handleDeleteComment}>
        Delete Comment
      </button>

      banUserButton =
      <BanUser banAction={this.props.handleBanUser} />

    }

    var showVotesButton;
    var { totalInteractions } = this.props;
    if (!userVoted) {

      showVotesButton =
      <div className="row">
        <div className="col-sm-2" />
        <div className="col-sm-7 comment-interaction-line">
          <div className="comment-interaction-line-div">
            {`Comment has ${totalInteractions} votes`}
          </div>
        </div>
        <div className="col-sm-3">
          <button onClick={this.showVotes} className="btn btn-sm float-right show-votes-button">
            Show Results
          </button>
        </div>
      </div>
    }

    return(
      <div className="cf-comment">
        <div className="cf-comment-wrapper">
          <UserAvatar
            userTileHover={userTileHover}
            userInfo={userInfo}
            onMouseEnter={this.onUserHover}
            onMouseLeave={this.onUserHover}
            userName={userName}
            followStar={followStar}
            blockSym={blockSym}
          />
          <div className="cf-comment-w-meta">
            <div className="cf-comment-comment-meta row">
              <div className="cf-comment-user-name col-10">
                {this.props.userName}{adminFlag}
              </div>
              <div className="cf-comment-length col-2">
                <div className="float-right">
                  <img src={lengthImage} height="20px" width="20px"/>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6">
                {createdAt}
              </div>
              <div className="col-sm-6">
              </div>
            </div>
            {textBox}
            {lastEdited}
            <div className="cf-comment-button-group">
              {editButton}
              {cancelButton}
              {deleteCommentButton}
              {banUserButton}
            </div>
          </div>
        </div>
        {showVotesButton}
        <VotingContainerBase
          commentId={this.props.commentId}
          currentUserId={currentUserId}
          commentVotes={this.props.commentVotes}
          votePercents={this.props.votePercents}
          userVoted={this.state.userVoted}
          handleTopChange={this.props.handleTopChange}
          artSettings={artSettings}
          updateAppState={updateAppState}
          showVotes={this.showVotes}
          voteCounts={this.props.voteCounts}
          updateUserVoted={this.updateUserVoted}
          totalInteractions={this.props.totalInteractions}
        />
        <RepliesContainer
          replies={replies}
          followedUsers={followedUsers}
          blockedUsers={blockedUsers}
          currentUserId={currentUserId}
          artId={artId}
          artType={artType}
          commentId={commentId}
          handleTopChange={this.props.handleTopChange}
          handleReplyOpen={this.props.handleReplyOpen}
          replyParent={this.props.replyParent}
          censored={censored}
          artSettings={artSettings}
          updateAppState={updateAppState}
          banUser={this.props.banUser}
          adminStatus={this.props.adminStatus}
          galleryId={galleryId}
          showVoteCountTrigger={this.props.showVoteCountTrigger}
        />
      </div>
    )
  }
}

export default Comment;
