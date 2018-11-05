import React from 'react';
import Textarea from 'react-expanding-textarea'

import { FetchBasic, FetchWithUpdate } from '../../util/CoreUtil';
import { Checkbox } from '../form/FormComponents';
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
        replyText: '',
        replyErrors: {},
        showReplies: false,
        userTileHover: false
      }
    this.handleChange = this.handleChange.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);
    this.handleCancelEditComment = this.handleCancelEditComment.bind(this);
    this.handleReplySubmit = this.handleReplySubmit.bind(this);
    this.handleCancelReply = this.handleCancelReply.bind(this);
    this.onUserHover = this.onUserHover.bind(this);
    this.handleStateFlip = this.handleStateFlip.bind(this);
  }

  onUserHover(){
    this.setState({ userTileHover: !this.state.userTileHover })
  }

  handleStateFlip(event){
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
      }
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));

    this.handleCancelReply()
  }

  render(){
    var { userName, createdAt, lengthImage, currentUserId, commentUserId, artId, userInfo } = this.props
    var { replies, editStatus, edited, text, reply, replyText, showReplies, userTileHover } = this.state
    var textBox, editButton, cancelButton, lastEdited, commentReplies, commentRepliesWrapper, replyField, replyButton, cancelReplyButton, userTile, repliesContainer;

    if (reply) {
      replyField =
      <div>
        <Textarea
          maxLength="1000"
          className="form-control margin-top-10px textarea"
          name="replyText"
          value={replyText}
          onChange={this.handleChange}
          />
        <Checkbox
          name="replyAnonymous"
          onChange={this.handleChange}
          label="Submit Anonymously"
          className="row"
          />
      </div>
      replyButton =
        <button className="btn btn-primary btn-sm" onClick={this.handleReplySubmit}>
          Submit Reply
        </button>
      cancelReplyButton =
      <button className="btn btn-light btn-sm" onClick={this.handleCancelReply}>Cancel Reply</button>
    } else {
      replyButton =
      <button className="btn btn-primary btn-sm" name="reply" onClick={this.handleStateFlip}>Reply</button>
    }

    if (replies && showReplies) {

      commentReplies = replies.map((reply) => {
        return(
          <Reply
            key={reply.id}
            user={reply.user}
            reply={reply.text}
            posted={reply.created_at}
          />
        )
      })
      repliesContainer =
      <div className="cf-comment-replies">
        {commentReplies}
      </div>
    }

    if (replies.length > 0){ // will alway show without the explicit len check
      var buttonText = showReplies ? "Hide" : "Show"
      commentRepliesWrapper =
      <div className="cf-comment-replies-wrapper">
        <span className="cf-replies-count">
          There are {replies.length} replies to this comment
        </span>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <button className="btn btn-primary btn-sm" name="showReplies" onClick={this.handleStateFlip}>{buttonText}</button>
        {repliesContainer}
      </div>
    }

    if (editStatus && currentUserId === commentUserId) {
      editButton = <button className="btn btn-primary btn-sm" onClick={this.handleEditSubmit}>Edit Comment</button>
      cancelButton = <button className="btn btn-light btn-sm" onClick={this.handleCancelEditComment}>Cancel Edit</button>
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
      textBox =
      <div className="cf-comment-text" >
        {text}
      </div>
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
            <div className="cf-comment-comment-meta">
              <div className="cf-comment-length">
                Comment Length:
                <img src={lengthImage} height="20px" width="20px"/>
              </div>
              <div className="cf-comment-at" >
                {createdAt}
              </div>
            </div>


            {textBox}

            {lastEdited}
            <div>
              {editButton}
              {cancelButton}
            </div>
          </div>
        </div>
        <div className="cf-comment-voting">
          <VotingContainerBase
            commentId={this.props.commentId}
            commentRoot={this.props.commentRoot}
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
            {replyButton}
            {cancelReplyButton}
          </div>
        </div>
      </div>
    )
  }
}

export default Comment;
