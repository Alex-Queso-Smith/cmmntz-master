import React from 'react'
import Textarea from 'react-expanding-textarea'

import { Input, Checkbox } from '../../components/form/FormComponents';
import { ConfirmCancelModal } from '../../components/modals/ConfirmCancelModal';
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
  handleConfirmAnonModal = this.handleConfirmAnonModal.bind(this);
  handleOutsideClick = this.handleOutsideClick.bind(this);

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
    const name = target.name;
    const value = target.type === "checkbox" ? target.checked : name === 'anonymous' ? !this.state.anonymous : target.value;

    if (name === 'anonymous' && !this.state.anonModalShown) {
      this.handleShowAnonModal()
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
    document.addEventListener('click', this.handleOutsideClick, false)
    document.body.classList.add("cf-modal-locked");
  }

  handleCloseAnonModal(){
    this.setState({
      anonModalShow: false
    });
    document.removeEventListener('click', this.handleOutsideClick, false)
    document.body.classList.remove("cf-modal-locked");
  }

  handleConfirmAnonModal(){
    this.setState({
      anonModalShow: false,
      anonymous: true
    })
    document.removeEventListener('click', this.handleOutsideClick, false)
    document.body.classList.remove("cf-modal-locked");
  }

  handleOutsideClick(event) {
    if (!event.target.classList.value.includes("cf-modal-container")) {
      return;
    } else {
      this.handleCloseAnonModal();
    }
  }

  render(){

    var { commentFormErrors, artSettings, userSettings } = this.props
    var { text, formInvalid, selfVotes, selfVoteStatus, anonModalShow } = this.state
    var textError, timer, anonModal, selfVoteButtonsRowOne, selfVoteButtonsRowTwo;

    if (commentFormErrors.text) {
      textError = CreateErrorElements(commentFormErrors.text, "Comment text")
    }

    var userNameButton, buttonOne, buttonTwo;
    if (this.props.userSettings.guest) {

      var changeDisplayLogin = (event) => {
        this.props.updateDisplay("login", event)
      }

      var changeDisplayRegister = (event) => {
        this.props.updateDisplay("register", event)
      }

      userNameButton =
      <div className="col-6 cf-login-statement">
        Guest
      </div>
      buttonOne =
      <div className="col-3 cf-padding-cancel">
        <button className="btn btn-sm cf-fade-button cf-float-right" onClick={ changeDisplayLogin }>Login</button>
      </div>
      buttonTwo =
      <div className="col-3 cf-padding-cancel ">
        <button className="btn btn-sm cf-fade-button cf-float-right " onClick={ changeDisplayRegister }>Register</button>
      </div>

    } else {

      var changeDisplaySettings = (event) => {
        this.props.updateDisplay("settings", event)
      }

      var userNameStyle;
      if (this.state.anonymous) {
        userNameStyle = {
          textDecoration: "line-through"
        }
      }

      var gearStyle = {
        marginLeft: "5px",
        marginTop: "5px",
        background: "none"
      }

      var logoutStyle = {
        textAlign: "right"
      }

      userNameButton =
      <div className="col cf-login-statement cf-cursor-pointer cf-padding-cancel" style={userNameStyle}  onClick={ changeDisplaySettings }>
        {this.props.userInfo.userName}
      </div>
      buttonOne =
      <div style={gearStyle} className="col-2 cf-padding-cancel">
        <button className="btn btn-sm" onClick={ changeDisplaySettings }>
          <img className={`cf-vote-btn cf-cursor-pointer`} src={`${this.props.globalSettings.baseImageUrl}/images/icons-v2/gear.png`} />
        </button>
      </div>
      buttonTwo =
      <div style={logoutStyle} className="col-2 cf-padding-cancel">
        <button className="btn btn-sm cf-fade-button" onClick={ this.props.tempLogout }>Logout</button>
      </div>

    }

    if (selfVoteStatus) {
      selfVoteButtonsRowOne =
      RowOneVoteTypes.map((type) => {
        var visibility;
        var image = ImageSelector(type[0], this.props.globalSettings.baseImageUrl)
        var opacity = selfVotes.includes(type[0]) ? "" : "cf-translucent"

        if (type[0].includes('blank')) {
          visibility = "cf-hidden"
        }

        return(
          <VoteButtonRowOne
            key={type[0]}
            name={type[0]}
            opacity={opacity}
            visibility={`cf-margin-top-10px ${visibility}`}
            image={image}
            onClick={this.handleSelfVoteClick}
            />
        )
      })

      selfVoteButtonsRowTwo =
      RowTwoVoteTypes.map((type) => {
        var visibility;
        var image = ImageSelector(type[0], this.props.globalSettings.baseUrl)
        var opacity = selfVotes.includes(type[0]) ? "" : "cf-translucent"

        if (type[0].includes('blank')) {
          visibility = "cf-hidden"
        }

        return(
          <VoteButtonRowOne
            key={type[0]}
            name={type[0]}
            opacity={opacity}
            className="cf-self-vote-button"
            visibility={`${visibility}`}
            image={image}
            onClick={this.handleSelfVoteClick}
            />
        )
      })
    }

    if (anonModalShow) {
      anonModal =
      <ConfirmCancelModal
        closeAction={this.handleCloseAnonModal}
        confirmAction={this.handleConfirmAnonModal}
        modalTitle={'Post Anonymously?'}
        confirmText="Continue"
        className="anonymous-warning"
      >
      Please be aware that default settings are for Anonymous & Guest comments to be filtered out so the likelihood of this comment being read are greatly reduced. Click 'OK' to post anonymously or Cancel to post as yourself.
    </ConfirmCancelModal>
    }

    var anonCheckBox;
    if (!userSettings.guest) {
      var imageSrc = `${this.props.globalSettings.baseImageUrl}/images/icons-v2/anonymous-unselected.png`
      var anonMessage = "Post Anonymously"

      if (this.state.anonymous) {
        imageSrc = `${this.props.globalSettings.baseImageUrl}/images/icons-v2/anonymous-selected.png`
        anonMessage = "Post as Myself"
      }


      anonCheckBox =
      <div className="col-1 cf-padding-cancel cf-anon-login-button">
        <div className="cf-tooltip-container">
          <img className={`cf-vote-btn cf-cursor-pointer cf-margin-top-10px`} onClick={this.handleChange} name='anonymous' src={imageSrc} />
          <span className="cf-tooltip-content-top">{anonMessage}</span>
        </div>
      </div>
    }

    var commentForm, approvalMsg;
    if (artSettings.disabled) {
      var msg = "Commenting on this thread has been disabled by the site Admins.";

      approvalMsg =
      <span className="helper-text">Note: This thread requires approval of all comments before they will be displayed.</span>

      if (artSettings.disabledMessage) {
        msg = artSettings.disabledMessage
      }

      commentForm =
      <div className="cf-deactivated-message">
        <h4>{msg}</h4>
      </div>

    } else if (!artSettings.userCanPost) {
      commentForm =
      <div className="cf-deactivated-message">
        <h4>You must have voted on at least 5 comments or replies to post a comment.</h4>
      </div>
    } else {

      var pbyStyle = {
        color: "#777777",
        fontSize: "12px"
      }

      var imageStyle = {
        height: "30px"
      }

      var marginCancel = {
        margin: "0px",
        paddingRight: "12px",
        paddingLeft: "12px"
      }

      var logo =
      <a href="http://www.cmmntz.com" target="_blank" className="btn btn-sm">
        <span style={pbyStyle}>powered by</span><span><img style={imageStyle} src={`${this.props.globalSettings.baseImageUrl}/images/logo_gray.png`} /></span>
      </a>


      commentForm =
      <form className="cf-comment-form form" id="cf-comment-form"  onSubmit={this.handleFormSubmit}>
        <div style={marginCancel} className="row justify-content-between">
          <PrivacyPolicy />

          <CommentEtiquette galleryCommentEtiquette={this.props.commentEtiquette} />
        </div>
        <hr className="cf-login-hr" />
        <div className="cf-login-statement-container row cf-margin-top-5px">
          {userNameButton}
          {anonCheckBox}
          {buttonOne}
          {buttonTwo}
        </div>
        <div className="row">
          <div className="col-12">
            <Textarea
              maxLength="3000"
              className="form-control textarea"
              name="text"
              placeholder="Type your comment here"
              value={text}
              onChange={this.handleChange}
              rows={3}
              />
          </div>
        </div>
        {textError}
        {approvalMsg}
        <div className="row cf-comment-actions-row">
          <div className=" cf-margin-top-10px cf-float-left col-2">
            <button className="btn btn-sm cf-dark-button" onClick={this.handleSelfVoteButtonClick} >Self Vote</button>
          </div>
          <div id="cf-filters-top" />
          <div className="col-8 cf-margin-top-5px">
            <div className="row justify-content-center">
              {selfVoteButtonsRowTwo}
            </div>
            </div>
          <div className="cf-margin-top-10px col-2">
            <div className="cf-float-right">
              <button id="comments-button" type="submit" className="btn btn-sm cf-dark-button" value="Submit" disabled={formInvalid}>
                Submit
              </button>
            </div>
          </div>
        </div>
        <div className="cf-clear"></div>
      </form>
    }


    return(
      <div className="cf-container">
        {anonModal}
        {commentForm}
        <hr />
      </div>
    )
  }
}

export default CommentFormContainer;
