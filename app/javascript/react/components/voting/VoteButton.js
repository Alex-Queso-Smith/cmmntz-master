import React from 'react'

const VoteButton = props => {
  return(
    <button name={props.name} className={`vote-btn vote-${props.name} ${props.toggleClass}`} data-group={props.group} onClick={props.onClick}>
      <img name={props.name} src="/assets/like" />
    </button>
  )
};

export default VoteButton
