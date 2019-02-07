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
    text: this.props.text,
    editStatus: false,
    edited: this.props.edited,
    userVoted: this.props.userVoted,
    showFullText: false,
    userFollowed: this.props.userFollowed,
    userBlocked: this.props.userBlocked,
    replies: this.props.replies,
    isReply: this.props.isReply
  }

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

    FetchBasic(this, `${this.props.globalSettings.baseUrl}/api/v1/comments/${this.props.commentId}.json`, newText, 'PATCH')
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
      path = `${this.props.globalSettings.baseUrl}/api/v1/unfollowings.json`
    } else {
      path = `${this.props.globalSettings.baseUrl}/api/v1/followings.json`
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
      path = `${this.props.globalSettings.baseUrl}/api/v1/unblockings.json`
    } else {
      path = `${this.props.globalSettings.baseUrl}/api/v1/blockings.json`
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
    var { userName, createdAt, lengthImage, currentUserId, commentUserId, artId, artType, commentId, userInfo, followedUsers, censor, blockedUsers, artSettings, updateAppState, galleryId, postedAsGuest } = this.props
    var { replies, editStatus, edited, text, userFollowed, userBlocked } = this.state

    var followStar, blockSym, starOpacity, blockOpacity;
    if (
      commentUserId != currentUserId &&
      userName != "Anonymous" &&
      !this.props.guestStatus &&
      !postedAsGuest
    ) {
      var starMessage = "Unfollow"
      if (!userFollowed) {
        starOpacity = "cf-translucent"
        starMessage = "Follow"
      }
      followStar =
      <div className={`col-2 cf-padding-cancel cf-block-follow-box-start cf-cursor-pointer cf-tooltip-container`}>
        <img className={`${starOpacity}`} onClick={this.handleFollow} src={`${this.props.globalSettings.baseImageUrl}/images/icons-v2/star.png`} height="20px" width="20px" />
        <span className="cf-tooltip-content-top cf-tooltip-content-top-user-tile">{starMessage}</span>
      </div>

      var blockMessage = "Unblock"
      if (!userBlocked) {
        blockOpacity = "cf-translucent"
        blockMessage = "Block"
      }
      blockSym =
      <div className={`col-2 cf-padding-cancel cf-cursor-pointer cf-tooltip-container`}>
        <img className={`${blockOpacity}`} onClick={this.handleBlock} src={`${this.props.globalSettings.baseImageUrl}/images/icons-v2/block.png`} height="20px" width="20px" />
        <span className="cf-tooltip-content-top cf-tooltip-content-top-user-tile">{blockMessage}</span>
      </div>

    } else

    var textBox;
    if (editStatus) {
      var style = {
        height: "75px"
      }
      textBox =
      <Textarea
        maxLength="3000"
        className="form-control cf-margin-top-10px textarea col-sm-10 cf-comment-text-area-edit"
        name="text"
        value={text}
        onChange={ this.handleChange }
        style={style}
        />
    } else {
      var text_length = 400 ;
      if (text.length > text_length) {
        if (!this.state.showFullText) {
          textBox =
          <div className="cf-comment-text" >
            <div className="cf-display-linebreak" dangerouslySetInnerHTML={{__html: text.substring(0, text_length) + "..."}} />
            <br />
            <a href='#' onClick={this.handleStateFlip} name="showFullText" className="cf-link-text">show more</a>
          </div>
        } else {
          textBox =
          <div className="cf-comment-text" >
            <div className="cf-display-linebreak" dangerouslySetInnerHTML={{__html: text}} />
            <br />
            <a href='#' onClick={this.handleStateFlip} name="showFullText" className="cf-link-text">show less</a>
          </div>
        }
      } else {
        textBox =
        <div className="cf-comment-text" >
          <div className="cf-display-linebreak" dangerouslySetInnerHTML={{__html: text}} />
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
        editButton = <button className="btn btn-sm cf-fade-button" onClick={this.handleEditSubmit}>Edit</button>
        cancelButton = <button className="btn btn-sm cf-fade-button" onClick={this.handleCancelEditComment}>Cancel</button>
      } else if (currentUserId === commentUserId) {
        editButton = <button className="btn btn-sm cf-fade-button" name="editStatus" onClick={this.handleStateFlip}>Edit</button>
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
      <button className="btn btn-sm cf-red-outline-button cf-margin-all-5px" onClick={this.props.handleDeleteComment}>
        Delete Comment
      </button>

      banUserButton =
      <BanUser banAction={this.props.handleBanUser} />

    }

    var { totalInteractions } = this.props;
    var showVotesButton;

    if (!this.state.userVoted) {

      showVotesButton =
      <div className="row cf-comment-interaction-row">
        <div className="col-6 col-sm-6 cf-comment-interaction-line">
          {`${totalInteractions} votes`}
        </div>
        <div className="col-6 col-sm-6">
          <button onClick={this.showVotes} className="btn btn-sm cf-float-right cf-fade-button">
            Results
          </button>
        </div>
      </div>
    } else {
      showVotesButton =
      <div className="row cf-comment-interaction-row">
        <div className="col-12 col-sm-12 cf-comment-interaction-line">
          {`${totalInteractions} votes`}
        </div>
      </div>
    }

    var replies;
    if (!this.state.isReply) {
      replies =
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
        censor={censor}
        artSettings={artSettings}
        updateAppState={updateAppState}
        banUser={this.props.banUser}
        adminStatus={this.props.adminStatus}
        galleryId={galleryId}
        showVoteCountTrigger={this.props.showVoteCountTrigger}
        globalSettings={this.props.globalSettings}
      />
    }

    return(
      <div className="cf-comment">
        <div className="cf-comment-wrapper">
          <UserAvatar
            userInfo={userInfo}
            userName={userName}
            followStar={followStar}
            blockSym={blockSym}
            userVoted={this.state.userVoted}
            globalSettings={this.props.globalSettings}
          />

          <div className="cf-comment-w-meta">
            <div className="cf-comment-comment-meta row">
              <div className="cf-comment-user-name col-10">
                {this.props.userName}{adminFlag}
              </div>
              <div className="cf-comment-length col-2">
                <div className="cf-float-right">
                  <img src={lengthImage} height="20px" width="20px"/>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-6">
                {createdAt}
              </div>
              <div className="col-sm-6" />
            </div>

            {textBox}
            {lastEdited}
            <div className="cf-cf-fade-button-group">
              {editButton}
              {cancelButton}
              <div className="row">
                <div className="col-4">
                  {deleteCommentButton}
                </div>
                <div className="col-3">
                  {banUserButton}
                </div>
              </div>
            </div>
          </div>

        </div>
        {showVotesButton}
        <VotingContainerBase
          commentId={this.props.commentId}
          currentUserId={currentUserId}
          commentVotes={this.props.commentVotes}
          totalInteractions={this.props.totalInteractions}
          votePercents={this.props.votePercents}
          showVotes={this.showVotes}
          voteCounts={this.props.voteCounts}
          handleTopChange={this.props.handleTopChange}
          userVoted={this.state.userVoted}
          artSettings={artSettings}
          updateAppState={updateAppState}
          updateUserVoted={this.updateUserVoted}
          globalSettings={this.props.globalSettings}
        />
      {replies}
      </div>
    )
  }
}

export default Comment;
