import React from 'react'

const VoteButton = props => {
  return(
    <button name={props.name} className={`vote-btn vote-${props.name} ${props.toggleClass} ${props.visibility}`} onClick={props.onClick}>
      {props.label}
    </button>
  )
};

export default VoteButton
