import React from 'react';

import { FetchBasic, FetchDidMount, FetchDeleteBasic } from '../../util/CoreUtil';
import { VoteClick, ImageSelector, RowOneVoteButtons, RowTwoVoteButtons, bigFive } from '../../util/VoteUtil';
import { Timeout } from '../../util/CommentUtil';
import { ConfirmCancelModal } from '../modals/ConfirmCancelModal';

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

    if (prevProps.voteCounts != this.props.voteCounts) {
      this.setState({
        voteCounts: this.props.voteCounts
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
    FetchBasic(this, `${this.props.globalSettings.baseUrl}/api/v1/votes.json`, payload, 'POST')
    .then(body => {

      if (body.errors) {
        var artErrors = body.errors["art"]
        if (artErrors) {
          alert(artErrors[0])

          var artSettings = this.props.artSettings
          artSettings[artErrors[1]] = true
          this.props.updateAppState("artSettings", artSettings)
        } else if (body.errors["comment"]) {
          var message = body.errors["comment"][1]
          var r = confirm(message);

          if (r == true) {
            var old_top_id = body.errors["comment"][3]
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
    FetchBasic(this, `${this.props.globalSettings.baseUrl}/api/v1/votes/${id}.json`, payload, 'PATCH')
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
    FetchDeleteBasic(this, `${this.props.globalSettings.baseUrl}/api/v1/votes/${id}.json`)
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

  handleShowFlagModal(event){
    if (this.state.selectedVotes.warn === null) {
      if (this.state.flagModalShow) {
        document.body.classList.remove("cf-modal-locked");
      } else {
        document.body.classList.add("cf-modal-locked");
      }
      this.setState({ flagModalShow: !this.state.flagModalShow })
    } else {
      this.handleClickVote(event)
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
      <ConfirmCancelModal
        closeAction={this.handleShowFlagModal}
        confirmAction={this.handleFlagCommentModal}
        modalTitle={"Flag this comment?"}
        name="warn"
      >
        If you wish to flag this comment please click OK or cancel to leave unflagged.
      </ConfirmCancelModal>
    }

    return(
      <div className="cf-votes-container" >
        {flagModal}
        <div className="cf-votes-top-row row justify-content-center">
          {voteButtonsRowOne}
        </div>
        <div className="cf-votes-bot-row row justify-content-center">
          {voteButtonsRowTwo}
        </div>
      </div>
    );
  }
};

export default VotingContainerBase;
