import React from 'react';
import Textarea from 'react-expanding-textarea'

import { FetchBasic, FetchWithUpdate, CreateErrorElements, CheckInputValidation } from '../../util/CoreUtil';
import { ReplyFieldActivated, ReplyButtonActive, ReplyButtonInactive, ReplyCancelButton } from './CommentComponents';
import { Checkbox } from '../form/FormComponents';
import Modal from '../modals/Modal';
import Reply from './Reply';
import RepliesContainer from '../../containers/comments/RepliesContainer';
import UserInfoTile from './UserInfoTile';
import VotingContainerBase from '../voting/VotingContainerBase';

class Comment extends React.Component {
  constructor(props){
    super(props);
      this.state = {
        editStatus: false,
        updateId: null,
        text: this.props.text,
        edited: this.props.edited,
        replies: this.props.replies,
        userFollowed: this.props.userFollowed,
        userBlocked: this.props.userBlocked,
        formInvalid: true,
        userTileHover: false,
        showFullText: false
      }
    this.handleChange = this.handleChange.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);
    this.handleCancelEditComment = this.handleCancelEditComment.bind(this);
    this.onUserHover = this.onUserHover.bind(this);
    this.handleStateFlip = this.handleStateFlip.bind(this);
    this.handleFollow = this.handleFollow.bind(this);
    this.handleBlock = this.handleBlock.bind(this);
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

  render(){
    var { userName, createdAt, lengthImage, currentUserId, commentUserId, artId, artType, commentId, userInfo, followedUsers, blockedUsers } = this.props
    var { replies, editStatus, edited, text, userTileHover, userFollowed, userBlocked, formInvalid } = this.state
    var textBox, editButton, cancelButton, lastEdited, userTile, starOpacity, blockOpacity, followStar, blockSym;

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
      if (!userFollowed) { starOpacity = "translucent" }
      followStar =
      <div className={`col-1 col-sm-1 cursor-pointer ${starOpacity}`}>
        <img onClick={this.handleFollow} src="/assets/star" height="20px" width="20px" />
      </div>

      if (!userBlocked) { blockOpacity = "translucent" }
      blockSym =
      <div className={`col-1 col-sm-1 cursor-pointer ${blockOpacity}`}>
        <img onClick={this.handleBlock} src="/assets/block" height="20px" width="20px" />
      </div>

    } else {
      followStar = <div className={`col-1 col-sm-1`} />
      blockSym = <div className={`col-1 col-sm-1`} />
    }

    return(
      <div className="cf-comment">
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
        <VotingContainerBase
          commentId={this.props.commentId}
          currentUserId={currentUserId}
          commentVotes={this.props.commentVotes}
          votePercents={this.props.votePercents}
          userVoted={this.props.userVoted}
          handleTopChange={this.props.handleTopChange}
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
        />
      </div>
    )
  }
}

export default Comment;
