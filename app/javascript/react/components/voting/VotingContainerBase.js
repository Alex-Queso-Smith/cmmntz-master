import React from 'react';
import VoteButton from './VoteButton'

const VotingContainerBase = props => {

  const voteTypes = [["like", "Like", "exclusive", "btn toggled"], ["indifferent", "Indifferent", "exclusive", ""], ["dislike", "Dislike", "exclusive", ""]]

  var voteButtons = voteTypes.map((type) => {
    return(
      <VoteButton
        key={type[0]}
        name={type[0]}
        label={type[1]}
        group={type[2]}
        toggleClass={type[3]}
      />
    )
  })

  return(
    <div className="cf-votes-container margin-top-10px" >
      {voteButtons}
    </div>
  );
};

export default VotingContainerBase;
