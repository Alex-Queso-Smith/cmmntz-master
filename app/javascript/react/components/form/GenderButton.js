import React from 'react';

const GenderButton = props => {
  return(
    <div className="form-group">
      <label htmlFor={props.name}>{props.label}</label>
      <br />
      <input type="hidden" name={props.name} value="" />
      <div className="btn-group btn-group-toggle" data-toggle="buttons">
        <label className="btn btn-secondary">
          <input onChange={props.handleChange} type="radio" name={props.name} id={`${props.name}_0`} autoComplete="off" value="0" /> Male
        </label>
        <label className="btn btn-secondary">
          <input onChange={props.handleChange} type="radio" name={props.name} id={`${props.name}_1`} autoComplete="off" value="1" /> Other
        </label>
        <label className="btn btn-secondary">
          <input onChange={props.handleChange} type="radio" name={props.name} id={`${props.name}_2`} autoComplete="off" value="2" /> Female
        </label>
      </div>
      <br />
      <div className="custom-control custom-checkbox">
        <input type="checkbox" className="custom-control-input" id={`${props.name}-opt-out`} autoComplete="off" />
        <label className="custom-control-label" htmlFor={`${props.name}-opt-out`}>Prefer not to say</label>
      </div>
    </div>
  )
}

export default GenderButton;
