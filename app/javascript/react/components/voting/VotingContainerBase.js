import React from 'react';
import VoteButton from './VoteButton';

class VotingContainerBase extends React.Component {
  state = {
    selectedType: ''
  }

  handleClick = this.handleClick.bind(this);

  handleClick(event){
    const target = event.target;
    const name = target.name;

    this.setState({ selectedType: name })
  }

  render(){
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

      if (type[0] === this.state.selectedType) {
        toggled = "btn toggled"
      }
      return(
        <VoteButton
          key={`${this.props.commentId}_${type[0]}`}
          name={type[0]}
          label={type[1]}
          toggleClass={toggled}
          onClick={this.handleClick}
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
          onClick={this.handleClick}
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
