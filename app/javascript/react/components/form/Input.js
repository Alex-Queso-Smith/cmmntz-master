import React from 'react';

const Input = props => {
  return(
    <div className="form-group">
      <label className="text-large" htmlFor={props.name}>{props.label}</label>
      <input className={`form-control margin-top-10px ${props.addClass}`} type={props.type} name={props.name} value={props.content} onChange={props.handleChange}></input>
    </div>
  );
};

export default Input;
