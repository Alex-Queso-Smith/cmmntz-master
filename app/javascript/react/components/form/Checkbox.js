import React from 'react';

const Checkbox = props => {
  return(
    <div className={`custom-control custom-checkbox margin-top-10px ${props.className}`}>
      <input type="checkbox"
      className="custom-control-input"
      name={props.name}
      id={props.name} onClick={props.onChange}
      autoComplete="off" />
      <label className="custom-control-label text-medium" htmlFor={props.name}>{props.label}</label>
    </div>
  );
};

export default Checkbox;
