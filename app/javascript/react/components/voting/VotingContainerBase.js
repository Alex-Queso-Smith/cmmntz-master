import React from 'react';

import { FetchBasic, FetchDidMount, FetchDeleteBasic } from '../../util/CoreUtil';
import { VoteClick, ImageSelector, RowOneVoteButtons, RowTwoVoteButtons, bigFive } from '../../util/VoteUtil';
import { Timeout } from '../../util/CommentUtil';
import Modal from '../modals/Modal';

class VotingContainerBase extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      selectedBigFive: '',
      selectedVotes: this.props.commentVotes,
      votePercents: this.props.votePercents,
      voteCounts: this.props.voteCounts,
      totalInteractions: this.props.totalInteractions,
      userVoted: this.props.userVoted,
      percentShow: this.props.userVoted,
      flagModalShow: false
    }
    this.handleClickVote = this.handleClickVote.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDestroy = this.handleDestroy.bind(this);
    this.handleShowFlagModal = this.handleShowFlagModal.bind(this);
    this.handleFlagCommentModal = this.handleFlagCommentModal.bind(this);
  }

  componentDidMount(){
    const BigFive = ["like", "like_a_lot", "indifferent", "dislike", "dislike_a_lot"]

    Object.keys(this.props.commentVotes).forEach((key) => {
      if (BigFive.includes(key) && this.props.commentVotes[key] != null) {
        this.setState({ selectedBigFive: key })
      }
    })
  }

  componentDidUpdate(prevProps, prevState){
    if ( prevProps.votePercents != this.props.votePercents ) {
      this.setState({
        votePercents: this.props.votePercents
      })
    }

    if (prevProps.userVoted != this.props.userVoted) {
        this.setState({
          userVoted: this.props.userVoted,
          percentShow: this.props.userVoted
        })
    }
  }

  handlePost(payload, name){
    FetchBasic(this, '/api/v1/votes.json', payload, 'POST')
    .then(body => {

      if (body.errors) {
        var artErrors = body.errors["art"]
        if (artErrors) {
          alert(artErrors[0])

          var artSettings = this.props.artSettings
          artSettings[artErrors[1]] = true
          this.props.updateAppState("artSettings", artSettings)
        } else {
          var message = body.errors["base"][1]
          var r = confirm(message);

          if (r == true) {
            var old_top_id = body.errors["base"][3]
            payload.append("vote[force]", true)
            payload.append("vote[old_top_id]",old_top_id )
            this.handlePost(payload, name)
          }
        }
      } else {
        var updateVotes = this.state.selectedVotes
        updateVotes[body.vote_type] = body.vote_id

        if (bigFive.includes(name)) {
          this.setState({
            selectedBigFive: name,
            selectedVotes: updateVotes,
            votePercents: body.vote_percents,
            voteCounts: body.vote_counts,
            totalInteractions: body.total_interactions,
            userVoted: true
          })
        } else {
          this.setState({
            selectedVotes: updateVotes,
            votePercents: body.vote_percents,
            totalInteractions: body.total_interactions,
            voteCounts: body.vote_counts,
            userVoted: true
          })
        }

        // update app
        var artSettings = this.props.artSettings
        if (artSettings.userCanPost != body.user_can_post) {
          artSettings["userCanPost"] = body.user_can_post
          this.props.updateAppState("artSettings", artSettings)
        }

        if (body.old_top_id){
          this.props.handleTopChange(body.old_top_id)
        }
      }
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  handleUpdate(payload, id){
    FetchBasic(this, `/api/v1/votes/${id}.json`, payload, 'PATCH')
    .then(body => {
      if (body.errors) {
        var artErrors = body.errors["art"]
        if (artErrors) {
          alert(artErrors[0])

          var artSettings = this.props.artSettings
          artSettings[artErrors[1]] = true
          this.props.updateAppState("artSettings", artSettings)
        }
      } else {
        this.setState({
          votePercents: body.vote_percents,
          voteCounts: body.vote_counts,
          totalInteractions: body.total_interactions
        })
      }
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  handleDestroy(id, name){
    FetchDeleteBasic(this, `/api/v1/votes/${id}.json`)
    .then(body => {
      if (body.errors) {
        var artErrors = body.errors["art"]
        if (artErrors) {
          alert(artErrors[0])

          var artSettings = this.props.artSettings
          artSettings[artErrors[1]] = true
          this.props.updateAppState("artSettings", artSettings)
        }
      } else {
        if (bigFive.includes(name)) {
          var updateVotes = this.state.selectedVotes
          updateVotes[this.state.selectedBigFive] = null

          this.setState({
            votePercents: body.vote_percents,
            voteCounts: body.vote_counts,
            totalInteractions: body.total_interactions,
            selectedVotes: updateVotes,
            selectedBigFive: ""
          })
        } else {
          var updateVotes = this.state.selectedVotes
          updateVotes[name] = null

          this.setState({
            votePercents: body.vote_percents,
            totalInteractions: body.total_interactions,
            voteCounts: body.vote_counts,
            selectedVotes: updateVotes
          })
        }
      }
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  handleClickVote(event){
    const unique = this.props.commentId

    VoteClick(this, event)

    var percentShowSet = () => {
      this.setState({ percentShow: true })
      this.props.updateUserVoted()
    }

    if (this.state.userVoted) {

      Timeout.clear(`timer${unique}`)
      Timeout.set(`timer${unique}`, percentShowSet, 1000)
    } else {

      Timeout.clear(`timer${unique}`)
      Timeout.set(`timer${unique}`, percentShowSet, 3000)
    }
  }

  handleShowFlagModal(){
    if (this.state.flagModalShow) {
      this.setState({ flagModalShow: !this.state.flagModalShow })
      document.body.classList.remove("cf-modal-locked");
    } else {
      this.setState({ flagModalShow: !this.state.flagModalShow })
      document.body.classList.add("cf-modal-locked");
    }
  }

  handleFlagCommentModal(event){
    this.handleShowFlagModal()
    this.handleClickVote(event)
  }

  render(){

    var voteButtonsRowOne = RowOneVoteButtons(this)
    var voteButtonsRowTwo, flagModal;

    if (this.state.userVoted) {
      voteButtonsRowTwo = RowTwoVoteButtons(this)
    }

    if (this.state.flagModalShow) {
      flagModal =
      <Modal
        handleClose={this.handleShowFlagModal}
        modalTitle={"Flag this comment?"}
      >
      If you wish to flag this comment please click flag comment button !
      <div className="">
        <button className="btn btn-med btn-dark" name="warn" onClick={this.handleFlagCommentModal}>
          Flag Comment
        </button>
      </div>
      </Modal>
    }

    return(
      <div className="cf-votes-container" >
        {flagModal}
        <div className="cf-votes-top-row row ">
          {voteButtonsRowOne}
        </div>
        <div className="cf-votes-bot-row row ">
          {voteButtonsRowTwo}
        </div>
      </div>
    );
  }
};

export default VotingContainerBase;
