import React from 'react';

const Checkbox = props => {
  return(
    <div className="custom-control custom-checkbox margin-top-10px">
      <input type="checkbox"
      className="custom-control-input"
      name={props.name}
      id={props.name} onClick={props.handleChange}
      autoComplete="off" />
      <label className="custom-control-label text-medium" htmlFor={props.name}>{props.label}</label>
    </div>
  );
};

export default Checkbox;
