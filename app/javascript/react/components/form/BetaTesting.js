import React from 'react';
import Textarea from 'react-expanding-textarea';

import { Input } from './FormComponents';


export const BugForm = (object, type, textError, categoryError, placeholder)  => {
  const selectStyle = {
    width: "65%"
  }

  return(
    <form  className="cf-user-feedback-form" onSubmit={ object.feedbackFormSubmit }>
      <div className="form-inline">
        <label htmlFor="feedbackCategory" className="text-medium margin-right-10px">Category</label>
        <select style={selectStyle} className="form-control" name="feedbackCategory" value={object.state.feedbackCategory} onChange={object.handleChange}>
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
        {categoryError}
      </div>
        <Textarea
          maxLength="3000"
          className="form-control margin-top-10px textarea"
          name="userText"
          placeholder={placeholder}
          value={object.state.userText}
          onChange={object.handleChange}
          rows={7}
        />
      {textError}
      <input type="hidden" name="feedbackType" value={type} />
      <div className="row">
        <div className="col-6">
          <button className="btn btn-sm btn-dark float-left margin-top-10px" onClick={ (e) => { e.preventDefault(); object.setState({ userBugForm: false }) } }>Cancel</button>
        </div>
        <div className="col-6">
          <button className="btn btn-sm btn-dark float-right margin-top-10px" type="submit" value="Submit" >Submit</button>
        </div>
      </div>
    </form>
  )
}
