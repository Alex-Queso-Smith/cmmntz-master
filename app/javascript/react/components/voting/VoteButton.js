import React from 'react'

const VoteButton = props => {
  return(
    <button className={`vote-btn vote-${props.name} ${props.toggleClass}`} data-group={props.group}>
      <span className={`vote-span ${props.name}`}>{props.label}</span>
    </button>
  )
};

export default VoteButton
