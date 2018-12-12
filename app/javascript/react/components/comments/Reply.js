import React from 'react';
import Textarea from 'react-expanding-textarea'

import { FetchWithUpdate, FetchBasic } from '../../util/CoreUtil';
import VotingContainerBase from '../voting/VotingContainerBase';
import UserAvatar from '../../containers/comments/UserAvatar';

class Reply extends React.Component {
  state = {
    text: this.props.text,
    editStatus: false,
    edited: this.props.edited,
    userTileHover: false,
    showFullText: false,
    userFollowed: this.props.userFollowed,
    userBlocked: this.props.userBlocked
  }

  onUserHover = this.onUserHover.bind(this);
  handleFollow = this.handleFollow.bind(this);
  handleBlock = this.handleBlock.bind(this);
  handleStateFlip = this.handleStateFlip.bind(this);
  handleChange = this.handleChange.bind(this);
  handleCancelEditReply = this.handleCancelEditReply.bind(this);
  handleEditSubmit = this.handleEditSubmit.bind(this);

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

  handleCancelEditReply(){
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

    FetchBasic(this, `/api/v1/comments/${this.props.replyId}.json`, newText, 'PATCH')
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
          this.props.updateAppState("artSettings", artSettings)
        }
      } else {
        this.setState({
          editStatus: false,
          text: body.comment.text,
          edited: body.comment.edited
        })
      }
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  handleFollow(event){
    event.preventDefault();

    var path;
    var newFollow = new FormData();
    newFollow.append("following[following_id]", this.props.replyUserId)
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
  }

  handleBlock(event){
    event.preventDefault();

    var path;
    var newBlock = new FormData();
    newBlock.append("blocking[blocking_id]", this.props.replyUserId)
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

  render(){
    var { currentUserId, user, lengthImage, replyUserId } = this.props;
    var { text, editStatus, edited } = this.state;
    var { user_name, gender, age_range } = this.props.user;
    var userInfo, starOpacity, followStar, blockSym, blockOpacity;

    if (user_name == '') {
      userInfo = "Anonymous"
    } else {
      userInfo = `${user_name} - ${gender} - ${age_range}`
    }

    if (user.user_id != currentUserId && user_name != "Anonymous") {
      if (!this.state.userFollowed) {
        starOpacity = "translucent"
      }
      if (!this.state.userBlocked) {
        blockOpacity = "translucent"
      }
      followStar =
      <div className={`col-1 col-sm-1 col-md-1 cursor-pointer ${starOpacity}`}>
        <img onClick={this.handleFollow} src="/assets/star" height="20px" width="20px" />
      </div>
      blockSym =
      <div className={`col-1 col-sm-1 col-md-1 cursor-pointer ${blockOpacity}`}>
        <img onClick={this.handleBlock} src="/assets/block" height="20px" width="20px" />
      </div>
    } else {
      blockSym =
      <div className={`col-1 col-sm-1 col-md-1`}>
      </div>
      followStar =
      <div className={`cf-comment-user-name col-1 col-sm-1 col-md-1`}>
      </div>
    }

    var textBox;
    if (editStatus) {
      textBox =
      <Textarea
        maxLength="3000"
        className="form-control margin-top-10px textarea col-sm-10 cf-comment-text-area-edit"
        name="text"
        value={text}
        onChange={this.handleChange}
      />
    } else {
      var text_length = 400;
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
        Reply has been Edited
      </div>
    }

    var cancelButton, editButton;
    if (editStatus && currentUserId === replyUserId) {
      editButton = <button className="btn btn-dark btn-sm comment-button" onClick={this.handleEditSubmit}>Edit Comment</button>
      cancelButton = <button className="btn btn-light btn-sm comment-button" onClick={this.handleCancelEditReply}>Cancel Edit</button>
    } else if (currentUserId === replyUserId) {
      editButton = <button className="btn btn-dark btn-sm comment-button" name="editStatus" onClick={this.handleStateFlip}>Edit Comment</button>
    } else {
      editButton = <div className="deactivated-message">Replying on this thread has been disabled.</div>
    }

    var adminFlag;
    if (this.props.user.gallery_admin) {
      adminFlag =
      " - Mod"
    }

    var deleteReplyButton, banUserButton;
    if (this.props.adminStatus && currentUserId != replyUserId) {
      deleteReplyButton =
        <button className="btn btn-sm red-outline-button margin-all-5px" onClick={this.props.handleDeleteReply}>
          Delete Reply
        </button>
        banUserButton =
        <button className="btn btn-sm red-outline-button margin-all-5px" onClick={this.props.handleBanUser}>
          Ban User
        </button>
    }

    return(
      <div className="cf-comment cf-comment-reply margin-top-10px">
        <div className="cf-comment-wrapper">
          <UserAvatar
            userTileHover={this.state.userTileHover}
            userInfo={this.props.user}
            onMouseEnter={this.onUserHover}
            onMouseLeave={this.onUserHover}
            userName={user_name}
            followStar={followStar}
            blockSym={blockSym}
            />
          <div className="cf-comment-w-meta">
            <div className="cf-comment-comment-meta row">
              <div className="cf-comment-user-name col-4">
                {user_name}{adminFlag}
              </div>
              <div className="cf-comment-at col-6" >
                {this.props.posted}
              </div>
              <div className="cf-comment-length col-2">
                <div className="float-right">
                  <img src={lengthImage} height="20px" width="20px"/>
                </div>
              </div>
            </div>
            {textBox}
            {lastEdited}
            <div className="cf-reply-button-group">
              {editButton}
              {cancelButton}
              {deleteReplyButton}
              {banUserButton}
            </div>
          </div>
        </div>
        <VotingContainerBase
          commentId={this.props.replyId}
          currentUserId={this.props.currentUserId}
          commentVotes={this.props.commentVotes}
          votePercents={this.props.votePercents}
          handleTopChange={this.props.handleTopChange}
          userVoted={this.props.userVoted}
          artSettings={this.props.artSettings}
          updateAppState={this.props.updateAppState}
        />
      </div>
    )
  }
}

export default Reply;
