import React from 'react';
import Textarea from 'react-expanding-textarea'

import { FetchBasic, FetchWithUpdate } from '../../util/CoreUtil';
import Checkbox from '../form/Checkbox';
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
        edited: this.props.editDate,
        replies: this.props.replies,
        replyText: '',
        replyErrors: {}
      }
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.handleReplySubmit = this.handleReplySubmit.bind(this);
    this.handleReplyClick = this.handleReplyClick.bind(this);
    this.handleCancelReply = this.handleCancelReply.bind(this);
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
        edited: resp.comment.edit_date
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
    newReply.append("comment[anonymous]", anonymous)
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
    var { userInfo, createdAt, lengthImage, currentUserId, commentUserId, artId } = this.props
    var { replies, edit, edited, text, reply, replyText } = this.state
    var textBox, editButton, cancelButton, lastEdited, commentReplies, replyField, replyButton, cancelReplyButton;

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
        <button onClick={this.handleReplySubmit}>
          Submit Reply
        </button>
      cancelReplyButton =
      <button onClick={this.handleCancelReply}>Cancel Reply</button>
    } else {
      replyButton =
      <button onClick={this.handleReplyClick}>Reply</button>
    }

    if (replies) {
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
    }

    if (edit && currentUserId === commentUserId) {
      editButton = <button onClick={this.handleEditSubmit}>Edit Comment</button>
      cancelButton = <button onClick={this.handleCancelClick}>Cancel Edit</button>
    } else if (currentUserId === commentUserId) {
      editButton = <button onClick={this.handleEditClick}>Edit Comment</button>
    }

    if (edited) {
      lastEdited =
      <div className="cf-comment-edit">
        Last Edited: {edited}
      </div>
    }

    if (edit) {
      textBox =
      <Textarea
      maxLength="3000"
      className="form-control margin-top-10px textarea col-sm-10"
      name="text"
      value={text}
      onChange={ this.handleChange }
      />
    } else {
      textBox = text
    }

    return(
      <div className="">
        <div className="cf-comment-user" >
          {userInfo}
        </div>
        <div className="cf-comment-at" >
          Posted: {createdAt}
        </div>
          {lastEdited}
        <div className="cf-comment-length">
          Comment Length:
          <img src={lengthImage} height="20px" width="20px"/>
        </div>
        <div className="cf-comment-text" >
          {textBox}
        </div>
        <div>
          {editButton}
        </div>
        <div>
          {cancelButton}
        </div>
        <div>
          {replyButton}
          {cancelReplyButton}
        </div>
        <div className="cf-comment-reply-field">
          {replyField}
        </div>
        <div className="cf-comment-replies">
          {commentReplies}
        </div>
      </div>
    )
  }
}

export default Comment;
