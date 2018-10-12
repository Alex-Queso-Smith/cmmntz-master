import React from 'react';

import RadioButton from './RadioButton';

const GenderButton = props => {
  return(
    <div className="form-group">
      <label className="text-large" htmlFor={props.name}>{props.label}</label>
      <input type="hidden" name={props.name} value="" />
      <div className="btn-group btn-group-toggle margin-top-10px" data-toggle="buttons">
        <RadioButton
          onChange={props.handleChange}
          id={`${props.name}_2`}
          name={props.name}
          label={"Female"}
          value={2}
        />
        <RadioButton
          onChange={props.handleChange}
          id={`${props.name}_1`}
          name={props.name}
          label={"Other"}
          value={1}
        />
        <RadioButton
          onChange={props.handleChange}
          id={`${props.name}_0`}
          name={props.name}
          label={"Male"}
          value={0}
        />
      </div>
      <br />
      <div className="custom-control custom-checkbox margin-top-10px">
        <input type="checkbox" className="custom-control-input" id={`${props.name}-opt-out`} autoComplete="off" />
        <label className="custom-control-label text-medium" htmlFor={`${props.name}-opt-out`}>None of Your Business</label>
      </div>
    </div>
  )
}

export default GenderButton;
