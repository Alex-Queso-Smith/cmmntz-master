import React from 'react';

const SortSelect = props => {
  return(
    <div className="form-group">
      <label className="text-medium">
        Sort:
        <br />
        <br />
        <select name={props.name} value={props.content} onChange={props.onChange}>
          <option value="desc">Newest</option>
          <option value="asc">Oldest</option>
        </select>
      </label>
    </div>
  );
};

export default SortSelect;
