import React from 'react';

const RadioButton = props => {
  return(
    <label className="btn btn-secondary">
      <input onChange={props.handleChange} type="radio" name={props.name} id={props.id} autoComplete="off" value={props.value} /> {props.label}
    </label>
  )
}

export default RadioButton;
