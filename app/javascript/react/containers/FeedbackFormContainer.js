import React from 'react';

import { CreateErrorElements, FetchBasic } from '../util/CoreUtil';
import { BugForm } from '../components/form/BetaTesting';

class FeedbackFormContainer extends React.Component {
  state = {
    userFeedbackForm: false,
    userBugForm: false,
    userText: "",
    feedbackCategory: "",
    feedbackType: "",
    feedbackErrors: {}
  }

  handleChange = this.handleChange.bind(this);
  feedbackFormUpdate = this.feedbackFormUpdate.bind(this);
  feedbackFormSubmit = this.feedbackFormSubmit.bind(this);

  handleChange(event){
    this.setState({ [event.target.name]: event.target.value })
  }

  feedbackFormUpdate(type){
    if (type === "feedback") {
      this.setState({
        userFeedbackForm: !this.state.userFeedbackForm,
        userBugForm: false,
        feedbackType: "Feedback",
        userText: ""
      })
    } else {
      this.setState({
        userFeedbackForm: false,
        userBugForm: !this.state.userBugForm,
        feedbackType: "Bug",
        userText: ""
      })
    }
  }

  feedbackFormSubmit(event){
    event.preventDefault();

    var { userText, feedbackCategory, feedbackType } = this.state;

    var newFeedback = new FormData();

    newFeedback.append("user_feedback[text]", userText)
    newFeedback.append("user_feedback[category]", feedbackCategory)
    newFeedback.append("user_feedback[user_id]", this.props.userId)
    newFeedback.append("user_feedback[type]", feedbackType)

    FetchBasic(this, '/api/v1/user_feedbacks.json', newFeedback, 'POST')
    .then(feedbackData => {

      if (feedbackData.errors) {
        this.setState({
          feedbackErrors: feedbackData.errors
        })
      } else {
        alert(feedbackData.message)
        this.setState({
          userFeedbackForm: false,
          userBugForm: false,
          userText: "",
          feedbackCategory: "",
          feedbackType: ""
        })
      }
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  render(){

    var handleBugForm = () => {
      this.feedbackFormUpdate("bug")
    }

    var handleFeedbackForm = () => {
      this.feedbackFormUpdate("feedback")
    }

    var { feedbackErrors } = this.state;

    var categoryError;
    if (feedbackErrors.category) {
      categoryError = CreateErrorElements(feedbackErrors.category, "Category")
    }

    var textError;
    if (feedbackErrors.text) {
      textError = CreateErrorElements(feedbackErrors.text, "Text area")
    }

    var userFeedbackForm;

    if (this.state.userFeedbackForm) {
      userFeedbackForm =
      <BugForm
        modal={false}
        type="feedback"
        textError={textError}
        categoryError={categoryError}
        placeholder={"Provide your feedback here. Thank you!"}
        feedbackFormSubmit={this.feedbackFormSubmit}
        feedbackCategory={this.state.feedbackCategory}
        onChange={this.handleChange}
        text={this.state.userText}
      />
    } else if (this.state.userBugForm) {
      userFeedbackForm =
      <BugForm
        modal={false}
        type="bug"
        textError={textError}
        categoryError={categoryError}
        placeholder={"Please describe bug with context of how it occurred. Thank you!"}
        feedbackFormSubmit={this.feedbackFormSubmit}
        feedbackCategory={this.state.feedbackCategory}
        onChange={this.handleChange}
        text={this.state.userText}
      />
    }

    return(
      <div>
        <div className="row justify-content-center">
          <div>
            <button onClick={ handleFeedbackForm } className="btn btn-lg btn-primary">Feedback?</button>
          </div>
          &nbsp;
          <button onClick={ handleBugForm } className="btn btn-lg btn-primary">Bugs?</button>
        </div>
        {userFeedbackForm}
      </div>
    )
  }
}

export default FeedbackFormContainer;
