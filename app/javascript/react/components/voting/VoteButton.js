import React from 'react'

const VoteButton = props => {
  return(
    <button className="vote-btn vote-{props.name}">
      <span className="vote-span {props.name}">{props.display}</span>
    </button>
  )
};

export default VoteButton
