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
    const voteTypes = [["like", "Like", "exclusive"], ["indifferent", "Indifferent", "exclusive"], ["dislike", "Dislike", "exclusive"]]

    var voteButtons = voteTypes.map((type) => {
      var toggled = '';

      if (type[0] === this.state.selectedType) {
        toggled = "btn toggled"
      }
      return(
        <VoteButton
          key={`${this.props.commentId}_${type[0]}`}
          name={type[0]}
          label={type[1]}
          group={type[2]}
          toggleClass={toggled}
          onClick={this.handleClick}
          />
      )
    })

    return(
      <div className="cf-votes-container margin-top-10px" >
        {voteButtons}
      </div>
    );
  }
};

export default VotingContainerBase;
