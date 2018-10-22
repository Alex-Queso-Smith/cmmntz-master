import React from 'react';
import VoteButton from './VoteButton'

const VotingContainerBase = props => {
  return(
    <div className="cf-votes-container margin-top-10px" >
      <VoteButton
        name="like"
        display="Like"
      />
      <VoteButton
        name="indifferent"
        display="Indifferent"
      />
      <VoteButton
        name="dislike"
        display="Dislike"
      />
    </div>
  );
};

export default VotingContainerBase;
