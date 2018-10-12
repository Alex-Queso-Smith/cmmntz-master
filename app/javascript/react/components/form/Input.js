import React from 'react';

const Input = props => {
  return(
    <div>
      <label htmlFor={props.name}>{props.label}</label>
      <input type={props.type} name={props.name} value={props.content} onChange={props.handleChange}></input>
    </div>
  );
};

export default Input;
