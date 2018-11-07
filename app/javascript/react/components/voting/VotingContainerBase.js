import React from 'react';

import { FetchBasic, FetchDidMount, FetchDeleteBasic } from '../../util/CoreUtil';
import { VoteClick, ImageSelector, RowOneVoteButtons, RowTwoVoteButtons } from '../../util/VoteUtil';
import { Timeout } from '../../util/CommentUtil';

class VotingContainerBase extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      selectedBigFive: '',
      selectedVotes: this.props.commentVotes,
      votePercents: this.props.votePercents,
      userVoted: this.props.userVoted,
      percentShow: this.props.userVoted
    }
    this.handleClickVote = this.handleClickVote.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDestroy = this.handleDestroy.bind(this);
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
    // if ( prevProps.selectedVotes.top != this.state.selectedVotes.top ) {
    //   FetchDidMount(this, `/api/v1/comments/${this.props.commentId}.json`)
    //   .then(body => {debugger})
    // }
  }

  handlePost(payload){
    FetchBasic(this, '/api/v1/votes.json', payload, 'POST')
    .then(body => {

      if (body.errors) {
        var message = body.errors[1]
        var r = confirm(message);

        if (r == true) {
          var old_top_id = body.errors[3]
          payload.append("vote[force]", true)
          payload.append("vote[old_top_id]",old_top_id )
          this.handlePost(payload)
        }
      } else {
        var updateVotes = this.state.selectedVotes
        updateVotes[body.vote_type] = body.vote_id

        this.setState({
          selectedVotes: updateVotes,
          votePercents: body.vote_percents
        })

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
      var updateVotes = this.props.commentVotes
      updateVotes[body.vote_type] = body.vote_id

      this.setState({
        selectedVotes: updateVotes,
        votePercents: body.vote_percents
      })
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  handleDestroy(id){
    FetchDeleteBasic(this, `/api/v1/votes/${id}.json`)
    .then(body => {
      this.setState({ votePercents: body.vote_percents })
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  handleClickVote(event){
    VoteClick(this, event)

    var percentShowSet = () => {
      this.setState({ percentShow: true })
    }

    if (this.state.userVoted) {
      Timeout.clear('timer')
      Timeout.set('timer', percentShowSet, 1500)
    } else {
      this.setState({ userVoted: true })

      Timeout.clear('timer')
      Timeout.set('timer', percentShowSet, 3000)
    }
  }

  render(){

    var voteButtonsRowOne = RowOneVoteButtons(this)
    var voteButtonsRowTwo = RowTwoVoteButtons(this)

    return(
      <div className="cf-votes-container margin-top-10px container" >
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
