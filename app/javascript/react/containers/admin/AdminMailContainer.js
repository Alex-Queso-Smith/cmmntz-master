import React from 'react';
import Textarea from 'react-expanding-textarea'

import { Input } from '../../components/form/FormComponents';
import { FetchWithPush, CreateErrorElements, CheckInputValidation } from '../../util/CoreUtil';

class AdminMailContainer extends React.Component {
  state = {
    subject: "",
    content: "",
    userName: "",
    user: "",
    formInvalid: false,
    formErrors: {}
  }

  handleChange = this.handleChange.bind(this);
  handleFormSubmit = this.handleFormSubmit.bind(this);
  handleClear = this.handleClear.bind(this);

  handleChange(event){
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({ [name]: value })
  }

  handleFormSubmit(event){
    event.preventDefault();
    if (!this.state.formInvalid){
      var newMail = new FormData();
      newMail.append("admin_mail[user_name]", this.state.userName)
      newMail.append("admin_mail[subject]", this.state.subject)
      newMail.append("admin_mail[content]", this.state.content)
      FetchWithPush(this, '/api/v1/admin_mails.json', '/', 'POST', 'formErrors', newMail)
      .catch(error => console.error(`Error in fetch: ${error.message}`));
    }
  }

  handleClear(){
    this.setState({
      subject: '',
      content: '',
      userName: '',
      user: "",
      formInvalid: false,
      formErrors: {}
    })
  }

  render(){
    var subjectErrors = CreateErrorElements(this.state.formErrors.subject, "Subject")
    var userNameErrors = CreateErrorElements(this.state.formErrors.userName, "Username")
    var userErrors = CreateErrorElements(this.state.formErrors.user, "User")
    var contentErrors = CreateErrorElements(this.state.formErrors.content, "Content")

    return (
      <div className="container">
        <form className="cf-comment-form form" id="cf-comment-form"  onSubmit={this.handleFormSubmit} >
          <div className="row">
            <Input
              name="subject"
              label="Subject"
              content={this.state.subject}
              onChange={this.handleChange}
            />
          </div>
          {subjectErrors}
          <div className="row">
            <Input
              name="userName"
              label="Username"
              content={this.state.userName}
              onChange={this.handleChange}
            />
          </div>
          {userErrors}
          {userNameErrors}
          <div className="row">
            <Textarea
              maxLength="1000"
              className="form-control margin-top-10px textarea"
              name="content"
              placeholder="Type your message here"
              value={this.state.content}
              onChange={ this.handleChange }
              rows={4}
              />
          </div>
          {contentErrors}

          <div className="margin-top-10px col-12 col-sm-12">
            <div className="float-right">
              <button id="comments-button" type="submit" className="btn btn-large btn-primary" value="Submit" disabled={this.state.formInvalid}>
                Submit Admin Mail
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}


export default AdminMailContainer;
