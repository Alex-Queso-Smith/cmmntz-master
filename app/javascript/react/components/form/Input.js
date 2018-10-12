import React from 'react';

const Input = props => {
  return(
    <div className="form-group">
      <label htmlFor={props.name}>{props.label}</label>
      <input className="form-control" type={props.type} name={props.name} value={props.content} onChange={props.handleChange}></input>
    </div>
  );
};

export default Input;
