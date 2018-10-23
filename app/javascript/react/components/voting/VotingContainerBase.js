import React from 'react';

import VoteButton from './VoteButton';
import { FetchBasic, FetchWithPull } from '../../util/CoreUtil';

class VotingContainerBase extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      selectedBigFive: '',
      selectedVotes: this.props.commentVotes
      // selectedVotes: {
      // top: null,
      // love: null,
      // likeALot: null,
      // like: null,
      // indifferent: null,
      // dislike: null,
      // dislikeALot: null,
      // trash: null,
      // warn: null,
      // smart: null,
      // funny: null,
      // happy: null,
      // shocked: null,
      // sad: null,
      // boring: null,
      // angry: null
      // }
    }
    this.handleClickBigFive = this.handleClickBigFive.bind(this);
    this.handleClickOthers = this.handleClickOthers.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);

  }


  handlePost(payload){
    FetchBasic(this, '/api/v1/votes.json', payload, 'POST')
    .then(body => this.setState({
      selectedVotes: {
        [body.vote_type]: body.vote_id
      }
    }))
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  handleUpdate(payload, id){
    FetchBasic(this, `/api/v1/votes/${id}`, payload, 'PATCH')
    .then(body => this.setState({
      selectedVotes: {
        [body.vote_type]: body.vote_id
      }
    }))
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  handleClickBigFive(event){
    const target = event.target;
    const name = target.name;
    const bigFive = ['like', 'dislike', 'indifferent', 'likeALot', 'dislikeALot']

    var selectedVotes = this.state.selectedVotes;

    if (bigFive.includes(name)) {
      if (this.state.selectedBigFive === '') { // if there is no selected big five
        this.setState({ selectedBigFive: name })

        var newVote = new FormData();
        var commentRoot = this.props.commentRoot;
        newVote.append("vote[comment_id]", this.props.commentId)
        newVote.append("vote[user_id]", commentRoot.getAttribute('data-user-id'))
        newVote.append("vote[vote_type]", name)

        this.handlePost(newVote)
      } else if (this.state.selectedBigFive != name) { // if there is a different selected big five

        var vote = new FormData();
        vote.append("vote[vote_type]", name)

        var voteId = this.state.selectedVotes[this.state.selectedBigFive]
        var updateVotes = this.state.selectedVotes
        updateVotes[this.state.selectedBigFive] = null

        this.setState({
          selectedVotes: updateVotes,
          selectedBigFive: name
        })
        handleUpdate(vote, voteId)
      } else { // if user clicks on same big five

      }
    } else {
      if (this.state.selectedVotes[name] === null) { // user clicks on non big five and is previously unselected
        var newVote = new FormData();
        var commentRoot = this.props.commentRoot;
        newVote.append("vote[comment_id]", this.props.commentId)
        newVote.append("vote[user_id]", commentRoot.getAttribute('data-user-id'))
        newVote.append("vote[vote_type]", name)

        this.handlePost(newVote)
      } else { // user clicks on non big five and is previously selected

      }
    }
  }

  handleClickOthers(event){
    const target = event.target;
    const name = target.name;

    this.setState({ selectedUpdate: name })

    var selectedUpdate = this.state.selectedUpdate;
    var selectedVotes = this.state.selectedVotes;

    // if (selectedVotes.includes(selectedUpdate)) {
    //   this.handleUpdate(selectedUpdate)
    // } else {
    //   this.handlePost(selectedUpdate)
    // }
  }

  render(){
    debugger
    const rowOneVoteTypes = [
      ["top", "Top"],
      ["love", "Love"],
      ["likeALot", "Like A Lot"],
      ["like", "Like"],
      ["indifferent", "Indifferent"],
      ["dislike", "Dislike"],
      ["dislikeALot", "Dislike A Lot"],
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
      var handleClick;

      if (
        type[0] == "top" ||
        type[0] == "love" ||
        type[0] == "trash" ||
        type[0] == "warn"
      ) {
        handleClick = this.handleClickOthers
      } else {
        handleClick = this.handleClickBigFive
      }

      if (type[0] === this.state.selectedBigFive) {
        toggled = "btn toggled"
      }

      return(
        <VoteButton
          key={`${this.props.commentId}_${type[0]}`}
          name={type[0]}
          label={type[1]}
          toggleClass={toggled}
          onClick={handleClick}
          />
      )
    })

    var voteButtonsRowTwo = rowTwoVoteTypes.map((type) => {
      var toggled = '';

      if (type[0] === this.state.selectedType) {
        toggled = "btn toggled"
      }
      return(
        <VoteButton
          key={`${this.props.commentId}_${type[0]}`}
          name={type[0]}
          label={type[1]}
          toggleClass={toggled}
          onClick={this.handleClickOthers}
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
