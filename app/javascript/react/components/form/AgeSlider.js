import React from 'react';

const AgeSlider = props => {
  return(
    <div className="slidecontainer">
      <label className="text-medium" htmlFor={props.name}>
        Select Age Range: {props.value}
      </label>
      <input onChange={props.onChange} type="range" min="10" max="60" step="5" defaultValue={props.value} name={props.name} className="slider" id="age-range-slider" />
    </div>

  )
}


export default AgeSlider;
