import React from 'react'
import Textarea from 'react-expanding-textarea'

import { Input, Checkbox } from '../../components/form/FormComponents';
import VoteButtonRowOne from '../../components/voting/VoteButtonRowOne';
import { CreateErrorElements, CheckInputValidation, FetchWithUpdate } from '../../util/CoreUtil';
import { Timeout } from '../../util/CommentUtil';
import { ImageSelector } from '../../util/VoteUtil';
import { OpacityHandlerIncludes } from '../../util/FilterUtil';

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
  handleSelfVoteClick = this.handleSelfVoteClick.bind(this);

  componentDidUpdate(prevProps, prevState){
    if (prevState.text != this.state.text) {
      CheckInputValidation(this, [this.state.text])
    }
  }

  handleChange(event){
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({ [name]: value })
  }

  handleSelfVoteClick(event){
    event.preventDefault();
    const target = event.target;
    const name = target.name;

    var updateSelfVotes = this.state.selfVotes
    if (updateSelfVotes.includes(name)) {
      updateSelfVotes = updateSelfVotes.filter(input => input != name)
      this.setState({ selfVotes: updateSelfVotes })
    } else {
      updateSelfVotes.push(name)
      this.setState({ selfVotes: updateSelfVotes })
    }
  }

  handleFormSubmit(event){
    var { text, anonymous, formInvalid, selfVotes } = this.state

    this.props.handleSubmit(event, text, anonymous, formInvalid, selfVotes, this.handleClear)
  }

  handleClear(){
    this.setState({
      text: '',
      anonymous: false,
      formInvalid: true,
      selfVotes: []
    })
  }

  render(){
    const SelfVoteButtonTypes = ["top", "like_a_lot", "smart", "funny"]

    var { commentFormErrors } = this.props
    var { text, formInvalid, selfVotes } = this.state
    var textError, timer;

    if (commentFormErrors.text) {
      textError = CreateErrorElements(commentFormErrors.text, "Comment text")
    }

    var selfVoteButtons =
      SelfVoteButtonTypes.map((type) => {
        var image = ImageSelector(type)
        var opacity = OpacityHandlerIncludes(selfVotes, type)

        return(
          <VoteButtonRowOne
            key={type}
            name={type}
            opacity={opacity}
            visibility={"margin-top-10px"}
            image={image}
            onClick={this.handleSelfVoteClick}
          />
        )
      })

    return(
      <div className="container">
        <form className="cf-comment-form form" id="cf-comment-form"  onSubmit={this.handleFormSubmit} >
          <div className="row">
            <Textarea
              maxLength="3000"
              className="form-control margin-top-10px textarea col-sm-10"
              name="text"
              placeholder="Type your comment here"
              value={this.state.text}
              onChange={ this.handleChange }
              rows={7}
              />
            <div className="col-sm-2">
              {selfVoteButtons}
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
            <button id="comments-button" type="submit" className="btn btn-block btn-large btn-primary" value="Submit" disabled={formInvalid}>
              <span className="text-large">Submit Comment</span>
            </button>
          </div>
        </form>
      </div>
    )
  }
}

export default CommentsFormContainer;
