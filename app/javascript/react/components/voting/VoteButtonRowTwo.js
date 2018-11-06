import React from 'react';

const VoteButtonRowTwo = props => {
  return(
    <div className={`col-sm ${props.className}`}>
        <img className={`vote-btn cursor-pointer vote-${props.name} ${props.visibility} ${props.opacity}`} onClick={props.onClick} name={props.name} src={props.image} />
        <div>{props.percentage}</div>
    </div>
  )
};

export default VoteButtonRowTwo;
