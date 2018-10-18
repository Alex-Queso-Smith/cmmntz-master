import React from 'react'

import Input from '../../components/form/Input';
import { SetStateWithValidation, FetchWithPush, CreateErrorElements } from '../../util/CoreUtil.js';
import Checkbox from '../../components/form/Checkbox';

class CommentsFormContainer extends React.Component {
  state = {
    userId: '',
    artId: '',
    artType: '',
    text: '',
    anonymous: false,
    formInvalid: true,
    commentFormErrors: {}
  }
  handleChange = this.handleChange.bind(this);
  handleSubmit = this.handleSubmit.bind(this);
  handleClear = this.handleClear.bind(this);

  handleChange(event){
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (this.state.text.length != 0) {
      SetStateWithValidation(this, false, name, value)
    } else {
      SetStateWithValidation(this, true, name, value)
    }
  }

  handleSubmit(event){
    event.preventDefault();
    if (!this.state.formInvalid) {
      var newComment = new FormData();
      var commentRoot = this.props.commentRoot
      newComment.append("comment[user_id]", commentRoot.getAttribute('data-user-id'))
      newComment.append("comment[art_type]", commentRoot.getAttribute('data-art-type'))
      newComment.append("comment[art_id]", commentRoot.getAttribute('data-art-id'))
      newComment.append("comment[text]", this.state.text)
      newComment.append("comment[anonymous]", this.state.anonymous)

      FetchWithPush(this, '/api/v1/comments.json', '', 'POST', 'commentFormErrors', newComment )
      if (Object.keys(this.state.commentFormErrors).length === 0) {
        this.handleClear();
      }
    }
  }

  handleClear(){
    this.setState({
      text: '',
      anonymous: false,
      formInvalid: true
    })
  }

  render(){
    var commentRoot = this.props.commentRoot
    var { commentFormErrors } = this.state;
    var textError;

    textError = CreateErrorElements(commentFormErrors.text, "Comment text")

    return(
      <div>
        <form className="cf-comment-form form" id="cf-comment-form"  onSubmit={this.handleSubmit} >
          <label className="text-medium">Comment</label>
          <input value={this.state.text} type="text" name="text" className="form-control" onChange={this.handleChange}/>
          {textError}
          <Checkbox
            name="anonymous"
            onChange={this.handleChange}
            label="Submit Anonymously"
          />
          <div className="form-group actions margin-top-10px">
            <button id="comments-button" type="submit" className="btn btn-block btn-large btn-dark" value="Submit" disabled={this.state.formInvalid}>
              <span className="text-large">Submit Comment</span>
            </button>
          </div>
        </form>
      </div>
    )
  }
}

export default CommentsFormContainer;
