import React from 'react'

import Input from '../../components/form/Input';
import { CreateErrorElements } from '../../util/CoreUtil.js';
import Checkbox from '../../components/form/Checkbox';

class CommentsFormContainer extends React.Component {
  state = {}

  render(){
    var { commentRoot, onChange, handleSubmit, formInvalid, text, commentFormErrors } = this.props
    var textError;

    textError = CreateErrorElements(commentFormErrors.text, "Comment text")

    return(
      <div>
        <form className="cf-comment-form form" id="cf-comment-form"  onSubmit={handleSubmit} >
          <label className="text-medium">Comment</label>
          <input value={text} type="text" name="text" className="form-control" onChange={onChange}/>
          {textError}
          <Checkbox
            name="anonymous"
            onChange={onChange}
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
