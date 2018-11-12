import React from 'react';
import Textarea from 'react-expanding-textarea';
import { Checkbox } from '../form/FormComponents';

export const ReplyFieldActivated = (object) => {
  var field =
  <div>
    <Textarea
      maxLength="1000"
      className="form-control margin-top-10px textarea"
      name="replyText"
      value={object.state.replyText}
      rows={3}
      onChange={object.handleChange}
      />
    <Checkbox
      name="replyAnonymous"
      onChange={object.handleChange}
      label="Submit Anonymously"
      className="margin-top-bottom-10px"
      />
  </div>
  return field
}

// export const ReplyButton
// replyButton =
//   <button className="btn btn-primary btn-sm" onClick={this.handleReplySubmit} disabled={formInvalid}>
//     Submit Reply
//   </button>
// cancelReplyButton =
// <button className="btn btn-light btn-sm margin-left-5px" onClick={this.handleCancelReply}>Cancel Reply</button>
