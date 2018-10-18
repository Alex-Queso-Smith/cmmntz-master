import React from 'react'

import Input from '../../components/form/Input';
import { SetStateWithValidation } from '../../util/CoreUtil.js';

class CommentsFormContainer extends React.Component {
  state = {
    userId: '',
    artId: '',
    artType: '',
    text: '',
    formInvalid: true,
    commentFormErrors: {}
  }
  handleChange = this.handleChange.bind(this);

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

  render(){
    var commentRoot = this.props.commentRoot

    return(
      <div>
        <form className="cf-comment-form form" id="cf-comment-form" >
          <Input
            type="text"
            label="User ID"
            name="userId"
            content={commentRoot.getAttribute('data-user-id')}
            onChange={this.handleChange}
          />
          <Input
            type="text"
            label="Art Id"
            name="artId"
            content={commentRoot.getAttribute('data-art-id')}
            onChange={this.handleChange}
          />
          <Input
            type="text"
            label="Art Type"
            name="artType"
            content={commentRoot.getAttribute('data-art-type')}
            onChange={this.handleChange}
          />
          <label className="text-medium">Comment</label>
          <textarea name="text" className="form-control" onChange={this.handleChange}/>
        </form>
      </div>
    )
  }
}

export default CommentsFormContainer;
