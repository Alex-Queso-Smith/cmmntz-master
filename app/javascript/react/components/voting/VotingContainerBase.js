import React from 'react';

import VoteButton from './VoteButton';
import { FetchBasic, FetchDidMount, FetchDeleteBasic } from '../../util/CoreUtil';
import { VoteClick, ImageSelector } from '../../util/VoteUtil';

class VotingContainerBase extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      selectedBigFive: '',
      selectedVotes: this.props.commentVotes,
      userVoted: this.props.userVoted
    }
    this.handleClickVote = this.handleClickVote.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDestroy = this.handleDestroy.bind(this);
  }

  componentDidMount(){
    const bigFive = ["like", "like_a_lot", "indifferent", "dislike", "dislike_a_lot"]

    Object.keys(this.props.commentVotes).forEach((key) => {
      if (bigFive.includes(key) && this.props.commentVotes[key] != null) {
        this.setState({ selectedBigFive: key })
      }
    })
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
    this.setState({ userVoted: true })
  }

  render(){
    const alwaysVisible = [
      "like",
      "indifferent",
      "dislike"
    ]

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
      ["blank1", "blank1"],
      ["smart", "Smart"],
      ["funny", "Funny"],
      ["happy", "Happy"],
      ["shocked", "Shocked"],
      ["sad", "Sad"],
      ["boring", "Boring"],
      ["angry", "Angry"],
      ["blank2", "blank2"]
    ]

    var voteButtonsRowOne = rowOneVoteTypes.map((type) => {
      var visibility = '';
      var image;

      if (!this.state.userVoted) {
        if (!alwaysVisible.includes(type[0])) {
          visibility = 'visibility-hidden'
        }
      }

      if (this.state.selectedVotes[type[0]]) {
        image = ImageSelector(type[0], 'Selected')
      } else {
        image = ImageSelector(type[0], 'Unselected')
      }

      return(
        <VoteButton
          key={`${this.props.commentId}_${type[0]}`}
          name={type[0]}
          label={type[1]}
          onClick={this.handleClickVote}
          visibility={visibility}
          percentage='50'
          image={image}
          />
      )
    })

    var voteButtonsRowTwo = rowTwoVoteTypes.map((type) => {
      var visibility = '';
      var image;

      if (!this.state.userVoted || type[0].includes('blank')) {
        visibility = 'visibility-hidden'
      }

      if (this.state.selectedVotes[type[0]]) {
        image = ImageSelector(type[0], 'Selected')
      } else {
        image = ImageSelector(type[0], 'Unselected')
      }

      return(
        <VoteButton
          key={`${this.props.commentId}_${type[0]}`}
          name={type[0]}
          label={type[1]}
          onClick={this.handleClickVote}
          visibility={visibility}
          image={image}
          />
      )
    })

    return(
      <div className="cf-votes-container margin-top-10px container" >
        <div className="cf-votes-top-row row">
          {voteButtonsRowOne}
        </div>
        <div className="cf-votes-bot-row row">
          {voteButtonsRowTwo}
        </div>
      </div>
    );
  }
};

export default VotingContainerBase;
