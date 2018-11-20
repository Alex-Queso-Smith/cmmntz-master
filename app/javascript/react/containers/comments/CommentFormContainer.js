import React from 'react'
import Textarea from 'react-expanding-textarea'

import { Input, Checkbox } from '../../components/form/FormComponents';
import Modal from '../../components/modals/Modal';
import VoteButtonRowOne from '../../components/voting/VoteButtonRowOne';
import { CreateErrorElements, CheckInputValidation, FetchWithUpdate } from '../../util/CoreUtil';
import { Timeout } from '../../util/CommentUtil';
import { ImageSelector, RowOneVoteTypes, RowTwoVoteTypes } from '../../util/VoteUtil';
import { OpacityHandlerIncludes } from '../../util/FilterUtil';

class CommentFormContainer extends React.Component {
  state = {
    text: '',
    anonymous: false,
    formInvalid: true,
    anonModalShown: false,
    anonModalShow: false,
    selfVoteStatus: false,
    selfVoteBigFive: '',
    selfVotes: []
  }

  handleChange = this.handleChange.bind(this);
  handleFormSubmit = this.handleFormSubmit.bind(this);
  handleClear = this.handleClear.bind(this);
  handleSelfVoteClick = this.handleSelfVoteClick.bind(this);
  handleShowAnonModal = this.handleShowAnonModal.bind(this);
  handleCloseAnonModal = this.handleCloseAnonModal.bind(this);
  handleSelfVoteButtonClick = this.handleSelfVoteButtonClick.bind(this);

  componentDidUpdate(prevProps, prevState){
    if (prevState.text != this.state.text) {
      CheckInputValidation(this, [this.state.text])
      if (
        !this.state.anonModalShown &&
        this.state.anonymous
      ) {
        this.handleShowAnonModal()
      }
    }
  }

  handleChange(event){
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (name === 'anonymous' && !this.state.anonModalShown) {
      this.setState({
        [name]: value,
        anonModalShow: true,
        anonModalShown: true
      })
    } else {
      this.setState({ [name]: value })
    }
  }

  handleSelfVoteClick(event){
    event.preventDefault();
    const target = event.target;
    const name = target.name;
    const bigFive = ["dislike_a_lot", "dislike", "indifferent", "like", "like_a_lot"]

    var updateSelfVotes = this.state.selfVotes

    if (this.state.selfVoteBigFive === name) {
      updateSelfVotes = updateSelfVotes.filter(input => input != name)
      this.setState({
        selfVotes: updateSelfVotes,
        selfVoteBigFive: ''
      })
    } else if (
      this.state.selfVoteBigFive &&
      bigFive.includes(name)
    ) {
      updateSelfVotes = updateSelfVotes.filter(input => input != this.state.selfVoteBigFive)
      updateSelfVotes.push(name)
      this.setState({
        selfVotes: updateSelfVotes,
        selfVoteBigFive: name
      })
    } else if (
      !this.state.selfVoteBigFive &&
      bigFive.includes(name)
    ) {
      updateSelfVotes.push(name)
      this.setState({ selfVoteBigFive: name })
    } else if (updateSelfVotes.includes(name)) {
      updateSelfVotes = updateSelfVotes.filter(input => input != name)
      this.setState({ selfVotes: updateSelfVotes })
    } else {
      updateSelfVotes.push(name)
      this.setState({ selfVotes: updateSelfVotes })
    }
  }

  handleSelfVoteButtonClick(event){
    event.preventDefault();

    this.setState({ selfVoteStatus: !this.state.selfVoteStatus })
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
      selfVoteStatus: false,
      selfVoteBigFive: '',
      selfVotes: []
    })
  }

  handleShowAnonModal(){
    this.setState({
      anonModalShow: true,
      anonModalShown: true
    });
    document.body.classList.add("cf-modal-locked");
  }

  handleCloseAnonModal(){
    this.setState({ anonModalShow: false });
    document.body.classList.remove("cf-modal-locked");
  }

  render(){

    var { commentFormErrors } = this.props
    var { text, formInvalid, selfVotes, selfVoteStatus } = this.state
    var textError, timer, anonModal, selfVoteButtonsRowOne, selfVoteButtonsRowTwo;

    if (commentFormErrors.text) {
      textError = CreateErrorElements(commentFormErrors.text, "Comment text")
    }

    if (selfVoteStatus) {

      selfVoteButtonsRowOne =
      RowOneVoteTypes.map((type) => {
        var visibility;
        var image = ImageSelector(type[0])
        var opacity = OpacityHandlerIncludes(selfVotes, [], type[0])

        if (type[0].includes('blank')) {
          visibility = "hidden"
        }

        return(
          <VoteButtonRowOne
            key={type[0]}
            name={type[0]}
            opacity={opacity}
            visibility={`margin-top-10px ${visibility}`}
            image={image}
            onClick={this.handleSelfVoteClick}
            />
        )
      })

      selfVoteButtonsRowTwo =
      RowTwoVoteTypes.map((type) => {
        var visibility;
        var image = ImageSelector(type[0])
        var opacity = OpacityHandlerIncludes(selfVotes, [], type[0])

        if (type[0].includes('blank')) {
          visibility = "hidden"
        }

        return(
          <VoteButtonRowOne
            key={type[0]}
            name={type[0]}
            opacity={opacity}
            visibility={`margin-top-10px ${visibility}`}
            image={image}
            onClick={this.handleSelfVoteClick}
            />
        )
      })
    }

    if (this.state.anonModalShow) {
      anonModal =
      <Modal
        handleClose={this.handleCloseAnonModal}
        modalTitle={'Do you wish to post anonymously?'}
      >
      If you wish to take advantage of ...... please do not post anonymously, thanks pal!
      </Modal>
    }

    return(
      <div className="container">
        {anonModal}
        <form className="cf-comment-form form" id="cf-comment-form"  onSubmit={this.handleFormSubmit} >
          <div className="">
            <Checkbox
              name="anonymous"
              onChange={this.handleChange}
              label="Submit Anonymously"
              className="row"
              />
          </div>
          <div className="row">
            <Textarea
              maxLength="3000"
              className="form-control margin-top-10px textarea"
              name="text"
              placeholder="Type your comment here"
              value={this.state.text}
              onChange={ this.handleChange }
              rows={7}
              />
          </div>
          {textError}
          <div className="row">
            <div className=" margin-top-10px float-left col-3">
              <button className="btn btn-sm btn-primary" onClick={this.handleSelfVoteButtonClick} >Self Vote</button>
            </div>
            <div className="margin-top-10px col-9 col-sm-9">
              <div className="float-right">
                <button id="comments-button" type="submit" className="btn btn-sm btn-primary" value="Submit" disabled={formInvalid}>
                  Submit Comment
                </button>
              </div>
            </div>
            <div className="row">
              {selfVoteButtonsRowOne}
            </div>
            <div className="row">
              {selfVoteButtonsRowTwo}
            </div>
          </div>
          <div className="clear"></div>
        </form>
      </div>
    )
  }
}

export default CommentFormContainer;
