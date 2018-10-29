import React from 'react';
import Textarea from 'react-expanding-textarea'

import { FetchBasic } from '../../util/CoreUtil';

class Comment extends React.Component {
  constructor(props){
    super(props);
      this.state = {
        edit: false,
        text: this.props.text,
        edited: this.props.editDate
      }
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
  }

  handleEditClick(event){
    event.preventDefault();
    this.setState({ edit: true })
  }

  handleCancelClick(event){
    event.preventDefault();
    this.setState({
      edit: false,
      text: this.state.text
    })
  }

  handleChange(event){
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value })
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

  render(){
    var { userInfo, createdAt, image, userId, commentUserId } = this.props
    var textBox, editButton, cancelButton, lastEdited;

    if (this.state.edit && userId === commentUserId) {
      editButton = <button onClick={this.handleEditSubmit}>Edit Comment</button>
      cancelButton = <button onClick={this.handleCancelClick}>Cancel Edit</button>
    } else if (userId === commentUserId) {
      editButton = <button onClick={this.handleEditClick}>Edit Comment</button>
    }

    if (this.state.edited.length != 0) {
      lastEdited =
      <div className="cf-comment-edit">
        Last Edited: {this.state.edited}
      </div>
    }

    if (this.state.edit) {
      textBox =
      <Textarea
      maxLength="3000"
      className="form-control margin-top-10px textarea col-sm-10"
      name="text"
      value={this.state.text}
      onChange={ this.handleChange }
      />
    } else {
      textBox = this.state.text
    }

    return(
      <div>
        <div className="cf-comment-user" >
          {userInfo}
        </div>
        <div className="cf-comment-at" >
          Posted: {createdAt}
        </div>
          {lastEdited}
        <div className="cf-comment-length">
          Comment Length:
          <img src={image} height="20px" width="20px"/>
        </div>
        <div className="cf-comment-text" >
          {textBox}
        </div>
        {editButton}
        {cancelButton}
      </div>
    )
  }
}

export default Comment;
