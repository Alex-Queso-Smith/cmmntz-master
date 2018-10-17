import React from 'react';

const RadioButton = props => {
  return(
    <label htmlFor={props.id} className="">
      <input onChange={props.onChange} type="radio" name={props.name} id={props.id} autoComplete="off" value={props.value} /> {props.label}
    </label>
  );
};

export default RadioButton;
