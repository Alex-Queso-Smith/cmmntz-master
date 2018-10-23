import React from 'react';

import VoteButton from './VoteButton';
import { FetchBasic, FetchWithPull, FetchDeleteBasic } from '../../util/CoreUtil';
import { VoteClick } from '../../util/VoteUtil';

class VotingContainerBase extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      selectedBigFive: '',
      selectedVotes: this.props.commentVotes
    }
    this.handleClickVote = this.handleClickVote.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDestroy = this.handleDestroy.bind(this);
  }

  handlePost(payload){
    FetchBasic(this, '/api/v1/votes.json', payload, 'POST')
    .then(body => {
      var updateVotes = this.state.selectedVotes
      updateVotes[body.vote_type] = body.vote_id

      this.setState({ selectedVotes: updateVotes })
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  handleUpdate(payload, id){
    FetchBasic(this, `/api/v1/votes/${id}.json`, payload, 'PATCH')
    .then(body => {
      var updateVotes = this.props.commentVotes
      updateVotes[body.vote_type] = body.vote_id

      this.setState({ selectedVotes: updateVotes })
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  handleDestroy(id){
    FetchDeleteBasic(this, `/api/v1/votes/${id}.json`)
  }

  handleClickVote(event){
    VoteClick(this, event)
  }

  render(){

    const rowOneVoteTypes = [
      ["top", "Top"],
      ["love", "Love"],
      ["like_a_lot", "Like A Lot"],
      ["like", "Like"],
      ["indifferent", "Indifferent"],
      ["dislike", "Dislike"],
      ["dislike_a_lot", "Dislike A Lot"],
      ["trash", "Trash"],
      ["warn", "Warn"]
    ]

    const rowTwoVoteTypes = [
      ["smart", "Smart"],
      ["funny", "Funny"],
      ["happy", "Happy"],
      ["shocked", "Shocked"],
      ["sad", "Sad"],
      ["boring", "Boring"],
      ["angry", "Angry"]
    ]

    var voteButtonsRowOne = rowOneVoteTypes.map((type) => {
      var toggled = '';

      if (this.state.selectedVotes[type[0]]) {
        toggled = "btn toggled"
      }

      return(
        <VoteButton
          key={`${this.props.commentId}_${type[0]}`}
          name={type[0]}
          label={type[1]}
          toggleClass={toggled}
          onClick={this.handleClickVote}
          />
      )
    })

    var voteButtonsRowTwo = rowTwoVoteTypes.map((type) => {
      var toggled = '';

      if (this.state.selectedVotes[type[0]]) {
        toggled = "btn toggled"
      }
      return(
        <VoteButton
          key={`${this.props.commentId}_${type[0]}`}
          name={type[0]}
          label={type[1]}
          toggleClass={toggled}
          onClick={this.handleClickVote}
          />
      )
    })

    return(
      <div className="cf-votes-container margin-top-10px" >
        <div className="cf-votes-top-row">
          {voteButtonsRowOne}
        </div>
        <div className="cf-votes-bot-row">
          {voteButtonsRowTwo}
        </div>
      </div>
    );
  }
};

export default VotingContainerBase;
