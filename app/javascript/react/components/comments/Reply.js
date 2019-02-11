import React from 'react';
import Textarea from 'react-expanding-textarea'

import { FetchWithUpdate, FetchBasic } from '../../util/CoreUtil';
import VotingContainerBase from '../voting/VotingContainerBase';
import UserAvatar from '../../containers/comments/UserAvatar';
import BanUser from '../modals/BanUser';

class Reply extends React.Component {
  state = {
    text: this.props.text,
    editStatus: false,
    edited: this.props.edited,
    userTileHover: false,
    userVoted: this.props.userVoted,
    showFullText: false,
    userFollowed: this.props.userFollowed,
    userBlocked: this.props.userBlocked
  }

  handleFollow = this.handleFollow.bind(this);
  handleBlock = this.handleBlock.bind(this);
  handleStateFlip = this.handleStateFlip.bind(this);
  handleChange = this.handleChange.bind(this);
  handleCancelEditReply = this.handleCancelEditReply.bind(this);
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

  handleCancelEditReply(){
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
        this.props.handleEditUpdate(this.props.replyId, text)
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

  showVotes(){
    this.setState({ userVoted: true })
    this.props.showVoteCountTrigger()
  }

  updateUserVoted(){
    this.setState({ userVoted: true })
  }

  render(){
    var { userName, userInfo, currentUserId, lengthImage, replyUserId, artSettings, createdAt } = this.props;
    var { text, editStatus, edited, userFollowed, userBlocked } = this.state;

    var starOpacity, followStar, blockSym, blockOpacity;
    if (userInfo.user_id != currentUserId && userName != "Anonymous") {
      if (!userFollowed) { starOpacity = "cf-translucent" }
      followStar =
      <div className={`col-1 col-sm-1 col-md-1 cf-cursor-pointer ${starOpacity}`}>
        <img onClick={this.handleFollow} src={`${this.props.globalSettings.baseImageUrl}/images/icons-v2/star.png`} height="20px" width="20px" />
      </div>

      if (!userBlocked) { blockOpacity = "cf-translucent" }
      blockSym =
      <div className={`col-1 col-sm-1 col-md-1 cf-cursor-pointer ${blockOpacity}`}>
        <img onClick={this.handleBlock} src={`${this.props.globalSettings.baseImageUrl}/images/icons-v2/block.png`} height="20px" width="20px" />
      </div>
    } else {
      blockSym = <div className={`col-1 col-sm-1 col-md-1`} />
      followStar = <div className={`cf-comment-user-name col-1 col-sm-1 col-md-1`} />
    }

    var textBox;
    if (editStatus) {
      textBox =
      <Textarea
        maxLength="3000"
        className="form-control cf-margin-top-10px textarea col-sm-10 cf-comment-text-area-edit"
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
        Reply has been Edited
      </div>
    }

    var cancelButton, editButton;
    if (!artSettings.disabled) {
      if (editStatus && currentUserId === replyUserId) {
        editButton = <button className="btn cf-dark-button btn-sm cf-fade-button" onClick={this.handleEditSubmit}>Edit Comment</button>
        cancelButton = <button className="btn btn-light btn-sm cf-fade-button" onClick={this.handleCancelEditReply}>Cancel Edit</button>
      } else if (currentUserId === replyUserId) {
        editButton = <button className="btn cf-dark-button btn-sm cf-fade-button" name="editStatus" onClick={this.handleStateFlip}>Edit Comment</button>
      }
    }

    var adminFlag;
    if (userInfo.gallery_admin) {
      adminFlag =
      " - Mod"
    }

    var deleteReplyButton, banUserButton;
    if (this.props.adminStatus && currentUserId != replyUserId) {
      deleteReplyButton =
      <button className="btn btn-sm cf-red-outline-button cf-margin-all-5px" onClick={this.props.handleDeleteReply}>
        Delete Reply
      </button>

      banUserButton =
      <BanUser banAction={this.props.handleBanUser} />
    }

    var showVotesButton;
    var { totalInteractions } = this.props;
    if (!this.state.userVoted) {

      showVotesButton =
      <div className="row">
        <div className="col-sm-2" />
        <div className="col-sm-7 cf-comment-interaction-line">
          <div className="cf-comment-interaction-line-div">
            {`Comment has ${totalInteractions} votes`}
          </div>
        </div>
        <div className="col-sm-3">
          <button onClick={this.showVotes} className="btn btn-sm cf-float-right cf-fade-button">
            Show Results
          </button>
        </div>
      </div>
    }

    return(
      <div className="cf-comment cf-comment-reply cf-margin-top-10px">
        <div className="cf-comment-wrapper">
          <UserAvatar
            userInfo={userInfo}
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
              {deleteReplyButton}
              {banUserButton}
            </div>
          </div>

        </div>
        {showVotesButton}
        <VotingContainerBase
          commentId={this.props.replyId}
          currentUserId={this.props.currentUserId}
          commentVotes={this.props.commentVotes}
          totalInteractions={this.props.totalInteractions}
          votePercents={this.props.votePercents}
          showVotes={this.showVotes}
          voteCounts={this.props.voteCounts}
          handleTopChange={this.props.handleTopChange}
          userVoted={this.state.userVoted}
          artSettings={artSettings}
          updateAppState={this.props.updateAppState}
          updateUserVoted={this.updateUserVoted}
        />
      </div>
    )
  }
}

export default Reply;
