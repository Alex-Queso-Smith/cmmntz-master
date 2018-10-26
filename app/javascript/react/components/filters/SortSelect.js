import React from 'react';

export const SortDir = props => {
  return(
    <div className="col-sm">
      <button name="sortDir" data-value={props.value} className={`sort-btn sort-${props.name}`} onClick={props.onClick}>
        <img name="sortDir" data-value={props.value} src={props.image} />
      </button>
    </div>
  );
};

export const SortButton = props => {
  return(
    <div className="col-sm">
      <button name="sortType" data-value={props.value} className={`sort-btn sort-${props.name}`} onClick={props.onClick}>
        <img name="sortType" data-value={props.value} src={props.image} />
      </button>
    </div>
  )
};

export default {
  SortDir,
  SortButton
};
