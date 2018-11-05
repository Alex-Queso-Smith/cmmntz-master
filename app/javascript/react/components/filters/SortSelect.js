import React from 'react';

export const SortDir = props => {
  return(
    <div className="col-sm">
      <img className={`sort-btn margin-top-10px vote-btn sort-${props.name}`} onClick={props.onClick} name="sortDir" data-value={props.value} src={props.image} />
    </div>
  );
};

export const SortButton = props => {
  return(
    <div className="col-sm">
      <img className={`sort-btn margin-top-10px vote-btn sort-${props.name} ${props.visibility} ${props.opacity}`} onClick={props.onClick} name="sortType" data-value={props.value} src={props.image} />
    </div>
  )
};

export default {
  SortDir,
  SortButton
};
