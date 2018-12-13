import React from 'react';

export const SortDir = props => {
  return(
    <div className="col-1 col-sm-1 col-md-1">
      <img className={`sort-btn cursor-pointer margin-top-10px vote-btn sort-${props.name}`} onClick={props.onClick} name="sortDir" data-value={props.value} src={props.image} />
    </div>
  );
};

export const SortButton = props => {
  return(
    <div className={`col-1 col-sm-1 col-md-1 vote-button-box ${props.className}`}>
      <img title={`${props.title}`} className={`sort-btn cursor-pointer margin-top-10px vote-btn sort-${props.name} ${props.visibility} ${props.opacity}`} onClick={props.onClick} name="sortType" data-value={props.value} src={props.image} />
    </div>
  )
};

export const FilterFromButton = props => {
  return(
    <span className="filter-btn-container">
      <button name={props.name} value={props.value} className={`btn btn-sm btn-dark filter-btn ${props.opacityClass}`} onClick={props.onClick}>{props.title}</button>
    </span>
  )
}
