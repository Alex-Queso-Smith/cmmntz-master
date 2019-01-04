import React from 'react'
import Textarea from 'react-expanding-textarea'

import { Input, Checkbox } from '../../components/form/FormComponents';
import Modal from '../../components/modals/Modal';
import PrivacyPolicy from '../../components/modals/PrivacyPolicy';
import VoteButtonRowOne from '../../components/voting/VoteButtonRowOne';
import { CreateErrorElements, CheckInputValidation, FetchWithUpdate } from '../../util/CoreUtil';
import { Timeout } from '../../util/CommentUtil';
import { ImageSelector, RowOneVoteTypes, RowTwoVoteTypes } from '../../util/VoteUtil';
import CommentEtiquette from '../../components/modals/CommentEtiquette';

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

    var { commentFormErrors, artSettings } = this.props
    var { text, formInvalid, selfVotes, selfVoteStatus, anonModalShow } = this.state
    var textError, timer, anonModal, selfVoteButtonsRowOne, selfVoteButtonsRowTwo, approvalMsg;

    if (commentFormErrors.text) {
      textError = CreateErrorElements(commentFormErrors.text, "Comment text")
    }

    if (selfVoteStatus) {

      selfVoteButtonsRowOne =
      RowOneVoteTypes.map((type) => {
        var visibility;
        var image = ImageSelector(type[0])
        var opacity = selfVotes.includes(type[0]) ? "" : "translucent"

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
        var opacity = selfVotes.includes(type[0]) ? "" : "translucent"

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

    if (anonModalShow) {
      anonModal =
      <Modal
        handleClose={this.handleCloseAnonModal}
        modalTitle={'Do you wish to post anonymously?'}
      >
      If you wish to take advantage of ...... please do not post anonymously, thanks pal!
      </Modal>
    }
    if (artSettings.disabled) {
      approvalMsg =
      <span className="helper-text">Note: This thread requires approval of all comments before they will be displayed.</span>
    }

    var commentForm;
    if (artSettings.disabled) {
      var msg = "Commenting on this thread has been disabled by the site Admins."

      if (artSettings.disabledMessage) {
        msg = artSettings.disabledMessage
      }
      commentForm =
      <div className="deactivated-message">
        <h4>{msg}</h4>
      </div>
    } else if (!artSettings.userCanPost) {
      commentForm =
      <div className="deactivated-message">
        <h4>You must have voted on at least 5 comments or replies to post a comment.</h4>
      </div>
    } else {
      commentForm =
      <form className="cf-comment-form form" id="cf-comment-form"  onSubmit={this.handleFormSubmit}>
        <div className="row">
          <div className="col-12">
            <a target="_blank" href="https://www.classibridge.com"><img className="cf-logo-image-form" src="/assets/Classifilter_Logo" /></a>
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <div className="float-left">
              <PrivacyPolicy />
            </div>
          </div>
          <div className="col-6">
            <div className="float-right">
              <CommentEtiquette galleryCommentEtiquette={this.props.commentEtiquette} />
            </div>
          </div>
        </div>
        <hr className="cf-login-hr" />
        {this.props.loginStatement}
        <div className="row">
          <div className="col-12">
            <Textarea
              maxLength="3000"
              className="form-control textarea"
              name="text"
              placeholder="Type your comment here"
              value={text}
              onChange={this.handleChange}
              rows={7}
              />
          </div>
        </div>
        {textError}
        {approvalMsg}
        <div className="row">
          <div className=" margin-top-10px float-left col-3">
            <button className="btn btn-sm btn-dark" onClick={this.handleSelfVoteButtonClick} >Self Vote</button>
          </div>
          <div className="col-6">
            <Checkbox
              name="anonymous"
              onChange={this.handleChange}
              label="Submit Anonymously"
              className=""
            />
          </div>
          <div className="margin-top-10px col-3">
            <div className="float-right">
              <button id="comments-button" type="submit" className="btn btn-sm btn-dark" value="Submit" disabled={formInvalid}>
                Submit Comment
              </button>
            </div>
          </div>
        </div>
        <div className="row justify-content-center margin-top-10px">
          {selfVoteButtonsRowOne}
        </div>
        <div className="row justify-content-center">
          {selfVoteButtonsRowTwo}
        </div>
        <div className="clear"></div>
      </form>
    }

    return(
      <div className="container">
        {anonModal}
        {commentForm}
        <hr />
      </div>
    )
  }
}

export default CommentFormContainer;
