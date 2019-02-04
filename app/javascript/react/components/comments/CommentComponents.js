import React from 'react';
import Textarea from 'react-expanding-textarea';
import { Checkbox } from '../form/FormComponents';
import Reply from './Reply';

export const ReplyFieldActivated = (object) => {
  style = {
    height: "75px"
  }
  var field =
  <div>
    <Textarea
      maxLength="1000"
      className="form-control cf-margin-top-10px textarea"
      name="replyText"
      value={object.state.replyText}
      rows={3}
      onChange={object.handleChange}
      style={style}
      />
    <Checkbox
      name="replyAnonymous"
      onChange={object.handleChange}
      label="Submit Anonymously"
      className="cf-margin-top-bottom-10px"
      />
  </div>
  return field
}

export const ReplyButtonActive = (object) => {
  var replyButton =
  <button className="btn cf-fade-button btn-sm" onClick={object.handleReplySubmit} disabled={object.state.formInvalid}>
    Submit Reply
  </button>
  return replyButton
}

export const ReplyButtonInactive = (object) => {
  var replyButton =
  <button className="btn cf-fade-button btn-sm" name="replyActive" onClick={object.handleStateFlip}>Reply</button>
  return replyButton
}

export const ReplyCancelButton = (object) => {
  var replyCancelButton =
  <button className="btn cf-fade-button btn-sm cf-margin-left-5px" onClick={object.handleCancelReply}>Cancel Reply</button>
  return replyCancelButton
}
