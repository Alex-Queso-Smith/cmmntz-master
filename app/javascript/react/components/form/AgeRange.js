import React from 'react';

import RadioButton from './RadioButton';

const AgeRange = props => {
  return(
    <div className="form-group">
      <label className="text-large" htmlFor={props.name}>{props.label}</label>
      <input type="hidden" name="user[age_range]" value="" />
      <div id="user-age-range" className="btn-group btn-group-toggle margin-top-10px" data-toggle="buttons">
        <RadioButton
          onChange={props.handleChange}
          id={'user_age_range_15'}
          name={props.name}
          label={"15-19"}
          value={15}
          />
        <RadioButton
          onChange={props.handleChange}
          id={'user_age_range_20'}
          name={props.name}
          label={"20-24"}
          value={20}
          />
        <RadioButton
          onChange={props.handleChange}
          id={'user_age_range_25'}
          name={props.name}
          label={"25-29"}
          value={25}
          />
        <RadioButton
          onChange={props.handleChange}
          id={'user_age_range_30'}
          name={props.name}
          label={"30-34"}
          value={30}
          />
        <RadioButton
          onChange={props.handleChange}
          id={'user_age_range_35'}
          name={props.name}
          label={"35-39"}
          value={35}
          />
        <RadioButton
          onChange={props.handleChange}
          id={'user_age_range_40'}
          name={props.name}
          label={"40-44"}
          value={40}
          />
        <RadioButton
          onChange={props.handleChange}
          id={'user_age_range_45'}
          name={props.name}
          label={"45-49"}
          value={45}
          />
        <RadioButton
          onChange={props.handleChange}
          id={'user_age_range_50'}
          name={props.name}
          label={"50-54"}
          value={50}
          />
        <RadioButton
          onChange={props.handleChange}
          id={'user_age_range_55'}
          name={props.name}
          label={"55-59"}
          value={55}
          />
        <RadioButton
          onChange={props.handleChange}
          id={'user_age_range_60'}
          name={props.name}
          label={"60+"}
          value={60}
          />
      </div>
      <div className="custom-control custom-checkbox margin-top-10px">
        <input type="checkbox" className="custom-control-input" id={`${props.name}-opt-out`} autoComplete="off" />
        <label className="custom-control-label text-medium" htmlFor={`${props.name}-opt-out`}>None of Your Business</label>
      </div>
    </div>
  )
}

export default AgeRange;
