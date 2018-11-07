import React from 'react';

const VoteButtonRowOne = props => {
  return(
    <div className={`col-1 col-sm-1 col-md-1 justify-content-center ${props.className}`}>
      <div>{props.percentage}</div>
        <img className={`vote-btn cursor-pointer vote-${props.name} ${props.visibility} ${props.opacity}`} onClick={props.onClick} name={props.name} src={props.image} />
    </div>
  )
};

export default VoteButtonRowOne;
