import React from 'react'

import Input from '../../components/form/Input';
import { CreateErrorElements, SetStateWithValidation, FetchWithUpdate } from '../../util/CoreUtil';
import { Timeout } from '../../util/CommentUtil';
import Checkbox from '../../components/form/Checkbox';

class CommentsFormContainer extends React.Component {
  state = {
    text: '',
    anonymous: false,
    formInvalid: true,
    commentFormErrors: {}
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
    var { commentFormErrors, text, formInvalid } = this.state
    var textError, timer;

    if (commentFormErrors.text) {
      textError = CreateErrorElements(commentFormErrors.text, "Comment text")
    }

    return(
      <div>
        <form className="cf-comment-form form" id="cf-comment-form"  onSubmit={this.handleFormSubmit} >
          <Input
            name='text'
            label='Comment'
            addClass=''
            content={text}
            onChange={this.handleChange}
          />
          {textError}
          <Checkbox
            name="anonymous"
            onChange={this.handleChange}
            label="Submit Anonymously"
          />
          <div className="form-group actions margin-top-10px">
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
