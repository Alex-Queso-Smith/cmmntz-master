import React from 'react';

const VoteButtonRowOne = props => {
  return(
    <div className={`col-sm ${props.className}`}>
      <div>{props.percentage}</div>
        <img className={`vote-btn vote-${props.name} ${props.visibility} ${props.opacity}`} onClick={props.onClick} name={props.name} src={props.image} />
    </div>
  )
};

export default VoteButtonRowOne;
