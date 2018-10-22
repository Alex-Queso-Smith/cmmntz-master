import React from 'react';
import VoteButton from './VoteButton'

const VotingContainerBase = props => {
  return(
    <div className="cf-votes-container margin-top-10px" >
      <VoteButton
        name="like"
        display="Like"
        toggleClass="btn toggled"
      />
      <VoteButton
        name="indifferent"
        display="Indifferent"
        toggleClass=""
      />
      <VoteButton
        name="dislike"
        display="Dislike"
        toggleClass=""
      />
    </div>
  );
};

export default VotingContainerBase;
