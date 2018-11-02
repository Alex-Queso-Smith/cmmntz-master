import React from 'react';
import Textarea from 'react-expanding-textarea'

import { FetchBasic, FetchWithUpdate } from '../../util/CoreUtil';
import { Checkbox } from '../form/FormComponents';
import Reply from './Reply';

class Comment extends React.Component {
  constructor(props){
    super(props);
      this.state = {
        edit: false,
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
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.handleReplySubmit = this.handleReplySubmit.bind(this);
    this.handleReplyClick = this.handleReplyClick.bind(this);
    this.handleCancelReply = this.handleCancelReply.bind(this);
    this.handleShowReplyToggle = this.handleShowReplyToggle.bind(this);
    this.onUserHover = this.onUserHover.bind(this);
  }

  onUserHover(){
    this.setState({ userTileHover: !this.state.userTileHover })
  }

  handleShowReplyToggle(){
    this.setState({
      showReplies: !this.state.showReplies
    })
  }

  handleEditClick(){
    this.setState({ edit: true })
  }

  handleCancelClick(){
    this.setState({
      edit: false,
      text: this.state.text
    })
  }

  handleChange(event){
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({ [name]: value })
  }

  handleEditSubmit(event){
    event.preventDefault();
    var newText = new FormData();
    newText.append("comment[text]", this.state.text)

    FetchBasic(this, `/api/v1/comments/${this.props.commentId}.json`, newText, 'PATCH')
    .then(resp => {
      this.setState({
        edit: false,
        text: resp.comment.text,
        edited: resp.comment.edited
      })
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  handleReplyClick(){
    this.setState({ reply: !this.state.reply })
  }

  handleCancelReply(){
    this.setState({
      reply: false,
      replyAnonymous: false,
      replyErrors: {},
      replyText: ''
    })
  }

  handleReplySubmit(){

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
    var { replies, edit, edited, text, reply, replyText, showReplies } = this.state
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
      <button className="btn btn-primary btn-sm" onClick={this.handleReplyClick}>Reply</button>
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
        <button className="btn btn-primary btn-sm " onClick={this.handleShowReplyToggle}>{buttonText}</button>
        {repliesContainer}
      </div>
    }

    if (edit && currentUserId === commentUserId) {
      editButton = <button className="btn btn-primary btn-sm" onClick={this.handleEditSubmit}>Edit Comment</button>
      cancelButton = <button className="btn btn-light btn-sm" onClick={this.handleCancelClick}>Cancel Edit</button>
    } else if (currentUserId === commentUserId) {
      editButton = <button className="btn btn-primary btn-sm" onClick={this.handleEditClick}>Edit Comment</button>
    }

    if (edited) {
      lastEdited =
      <div className="cf-comment-edit">
        Comment has been Edited
      </div>
    }

    if (edit) {
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

    if (!this.state.userTileHover) {
      var avatarImage = '/assets/avatar-default';
      if (this.props.userInfo.base_image) {
        avatarImage = `/assets/avatar-${this.props.userInfo.base_image}`
      }
      userTile =
      <div className="cf-comment-user-meta" onMouseEnter={this.onUserHover} onMouseLeave={this.onUserHover}>
        <div className="cf-comment-user-avatar">
          <span className="avatar-helper"></span>
          <img className="avatar-image" src={avatarImage} />
        </div>
        <div className="cf-comment-user-name" >
          {userName}
        </div>
      </div>
    } else {
      userTile =
      <div className="cf-comment-user-meta" onMouseEnter={this.onUserHover} onMouseLeave={this.onUserHover}>
        <div className="cf-comment-user-avatar">
          <span className="avatar-helper"></span>
        </div>
        <div className="cf-comment-user-data" >
          <div>
            {`${userInfo.user_name}`}
          </div>
          <div>
            {`${userInfo.gender}`}
          </div>
          <div>
            {`${userInfo.age_range}`}
          </div>
        </div>
      </div>
    }

    return(
      <div className="cf-comment">
        <div className="cf-comment-wrapper">

          {userTile}

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
          Voting to move here
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
