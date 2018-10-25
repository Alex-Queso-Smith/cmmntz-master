import React from 'react';

export const SortDir = props => {
  return(
    <div className="col-sm">
      <select name="sortDir" value={props.content} onChange={props.onChange}>
        <option value="desc">Desc</option>
        <option value="asc">Asc</option>
      </select>
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
