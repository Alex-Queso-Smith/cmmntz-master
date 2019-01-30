import React from 'react';

export const SortDir = props => {
  return(
    <div className="col-1 cf-vote-button-box">
      <img className={`sort-btn cf-cursor-pointer cf-margin-top-10px cf-vote-btn sort-${props.name}`} onClick={props.onClick} name="sortDir" data-value={props.value} src={props.image} />
    </div>
  );
};

export const SortButton = props => {
  return(
    <div className={`col-1 cf-vote-button-box ${props.className}`}>
      <div className={`${props.tooltipClass}`}>
        <img className={`sort-btn cf-cursor-pointer cf-margin-top-10px cf-vote-btn sort-${props.name} ${props.visibility} ${props.opacity}`} onClick={props.onClick} name="sortType" data-value={props.value} src={props.image} />
        <span className={`cf-tooltip-content-${props.row}`}>{`${props.title}`}</span>
      </div>
    </div>
  )
};

export const FilterFromButton = props => {
  return(
    <span className="cf-filter-btn-container">
      <button name={props.name} value={props.value} className={`btn btn-sm btn-dark cf-filter-btn ${props.opacityClass}`} onClick={props.onClick}>{props.title}</button>
    </span>
  )
}

export const presetOptions = [
  {},
  {filterList: ["funny_percent"], notFilterList: [], radius: "small", sortType: "funny_percent", commentsFrom: ""},
  {filterList: [], notFilterList: ["warn_percent", "trash_percent", "dislike_a_lot_percent"], radius: "", sortType: "created_at", commentsFrom: ""},
  {filterList: ["love_percent"], notFilterList: ["boring_percent"], radius: "", sortType: "love_percent", commentsFrom: ""},
  {filterList: ["angry_percent", "warn_percent"], notFilterList: [], radius: "", sortType: "created_at", commentsFrom: ""},
  {filterList: ["like_a_lot_percent", "smart_percent"], notFilterList: ["trash_percent", "warn_percent"], radius: "", sortType: "smart_percent", commentsFrom: ""}
]
