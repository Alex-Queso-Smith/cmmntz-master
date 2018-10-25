import React from 'react'

const VoteButton = props => {
  return(
    <div className="col-sm">
      <div>{props.percentage}</div>
      <button name={props.name} className={`vote-btn vote-${props.name} ${props.visibility}`} onClick={props.onClick}>
        <img name={props.name} src={props.image} />
      </button>
    </div>
  )
};

export default VoteButton
