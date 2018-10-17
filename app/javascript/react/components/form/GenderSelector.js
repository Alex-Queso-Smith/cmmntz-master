import React from 'react';

const GenderSelector = props => {
  return(
    <div className="form-group">
      <label className="text-medium">
        Select Gender:
        <br />
        <br />
        <select name={props.name} value={props.content} onChange={props.handleChange}>
          <option value="">None of your business!</option>
          <option value="2">Female</option>
          <option value="1">Other</option>
          <option value="0">Male</option>
        </select>
      </label>
    </div>
  );
};

export default GenderSelector;
