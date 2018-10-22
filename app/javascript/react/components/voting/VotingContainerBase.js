import React from 'react';

const VotingContainerBase = props => {
  return(
    <div className="cf-votes-container margin-top-10px" >
      <div className="cf-vote-like-containter">
        <button className="vote-btn vote-like">
          <span className="vote-span like">Like</span>
        </button>
        <button className="vote-btn vote-indifferent">
          <span className="vote-span indifferent">Indifferent</span>
        </button>
        <button className="vote-btn vote-dislike">
          <span className="vote-span dislike">Dislike</span>
        </button>
      </div>
    </div>
  );
};

export default VotingContainerBase;
