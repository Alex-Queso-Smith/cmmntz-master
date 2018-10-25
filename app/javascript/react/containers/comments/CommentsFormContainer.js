import React from 'react'

import Input from '../../components/form/Input';
import { CreateErrorElements, SetStateWithValidation, FetchWithUpdate } from '../../util/CoreUtil';
import { Timeout } from '../../util/CommentUtil';
import Checkbox from '../../components/form/Checkbox';
import VoteButton from '../../components/voting/VoteButton';
import Textarea from 'react-expanding-textarea'

class CommentsFormContainer extends React.Component {
  state = {
    text: '',
    anonymous: false,
    formInvalid: true,
    selfVotes: []
  }

  handleChange = this.handleChange.bind(this);
  handleFormSubmit = this.handleFormSubmit.bind(this);
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

  handleFormSubmit(event){
    var { text, anonymous, formInvalid } = this.state

    this.props.handleSubmit(event, text, anonymous, formInvalid)
    this.handleClear();
  }

  handleClear(){
    this.setState({
      text: '',
      anonymous: false,
      formInvalid: true
    })
  }

  render(){
    var { text, formInvalid } = this.state
    var textError, timer;

    if (this.props.commentFormErrors.text) {
      textError = CreateErrorElements(this.props.commentFormErrors.text, "Comment text")
    }

    return(
      <div className="container">
        <form className="cf-comment-form form" id="cf-comment-form"  onSubmit={this.handleFormSubmit} >
          <div className="row">
            <Textarea
              maxLength="3000"
              className="form-control margin-top-10px textarea col-sm-10"
              name="text"
              placeholder="Type your comment here"
              onChange={ this.handleChange }
              rows={8}
              />
            <div className="col-sm-2">
              <VoteButton
                name="top"
                visibility="margin-top-10px"
                image={'/assets/top.Selected.bmp'}
              />
              <VoteButton
                name="top"
                visibility="margin-top-10px"
                image={'/assets/top.Selected.bmp'}
              />
              <VoteButton
                name="top"
                visibility="margin-top-10px"
                image={'/assets/top.Selected.bmp'}
              />
              <VoteButton
                name="top"
                visibility="margin-top-10px"
                image={'/assets/top.Selected.bmp'}
              />
            </div>
          </div>
          {textError}
          <Checkbox
            name="anonymous"
            onChange={this.handleChange}
            label="Submit Anonymously"
            className="row"
          />
          <div className="form-group actions margin-top-10px row">
            <button id="comments-button" type="submit" className="btn btn-block btn-large btn-dark" value="Submit" disabled={formInvalid}>
              <span className="text-large">Submit Comment</span>
            </button>
          </div>
        </form>
      </div>
    )
  }
}

export default CommentsFormContainer;
