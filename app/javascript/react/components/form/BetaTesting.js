import React from 'react';
import Textarea from 'react-expanding-textarea';

import { Input } from './FormComponents';


export const BugForm = (props)  => {
  const selectStyle = {
    width: "65%"
  }

  var buttons;
  if (!props.modal) {
    buttons =
    <div className="row">
      <div className="col-6">
        <button className="btn btn-sm btn-dark float-left margin-top-10px" onClick={ props.cancelFeedbackForm }>Cancel</button>
      </div>
      <div className="col-6">
        <button className="btn btn-sm btn-dark float-right margin-top-10px" type="submit" value="Submit" >Submit</button>
      </div>
    </div>
  } else {
    buttons =
    <div className="row">
      <div className="col-6">
        <button className="btn btn-sm btn-dark float-right margin-top-10px" type="submit" value="Submit" >Submit</button>
      </div>
    </div>
  }

  var catError;
  if (props.categoryError) {
    catError = props.categoryError
  }

  var tError;
  if (props.textError) {
    tError = props.textError
  }

  var fNmError;
  if (props.firstNameError) {
    fNmError = props.firstNameError
  }

  var lNmError;
  if (props.lastNameError) {
    lNmError = props.lastNameError
  }

  return(
    <form  className="cf-user-feedback-form" onSubmit={ props.feedbackFormSubmit }>
      <div className="form-inline">
        <label htmlFor="feedbackCategory" className="text-medium margin-right-10px">Category</label>
        <select style={selectStyle} className="form-control" name="feedbackCategory" value={props.feedbackCategory} onChange={props.onChange}>
          <option />
          <option value="commenting" className="cf-category-item">
            Commenting
          </option>
          <option value="voting" className="cf-category-item">
            Voting
          </option>
          <option value="filters" className="cf-category-item">
            Filtering / Sorting
          </option>
          <option value="account" className="cf-category-item">
            Account / Settings
          </option>
          <option value="other" className="cf-category-item">
            Other
          </option>
        </select>
        {catError}
      </div>
        <Textarea
          maxLength="3000"
          className="form-control margin-top-10px textarea"
          name="userText"
          placeholder={props.placeholder}
          value={props.userText}
          onChange={props.onChange}
          rows={7}
        />
      {tError}
      <div className="form-inline">
        <Input
          name="userFirstName"
          label="First Name "
          onChange={props.onChange}
          content={props.firstName}
          type="text"
          addClass="margin-left-10px"
          />
      </div>
      {fNmError}
      <div className="form-inline">
        <Input
          name="userLastName"
          label="Last Name "
          onChange={props.onChange}
          content={props.lastName}
          type="text"
          addClass="margin-left-10px"
          />
      </div>
      {lNmError}
      <input type="hidden" name="feedbackType" value={props.type} />
      {buttons}
    </form>
  )
}
