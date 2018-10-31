import React from 'react';

const AgeSlider = props => {
  var ageRange;
  var selectedRange = props.value
  var ageImage;

  switch (selectedRange.toString()) {
    case "":
      ageRange = "None of your business"
      selectedRange = "10"
      break;
    case "10":
      ageRange = "None of your business"
      break;
    case "13":
      ageRange = "13-19"
      break;
    case "15":
      ageRange = "13-19"
      break;
    case "20":
      ageRange = "20-24"
      break;
    case "25":
      ageRange = "25-29"
      break;
    case "30":
      ageRange = "30-34"
      break;
    case "35":
      ageRange = "35-39"
      break;
    case "40":
      ageRange = "40-44"
      break;
    case "45":
      ageRange = "45-49"
      break;
    case "50":
      ageRange = "50-54"
      break;
    case "55":
      ageRange = "55-59"
      break;
    case "60":
      ageRange = "60+"
      break;
  }

  if (
    props.value != "" &&
    props.value != "10"
  ) {
    if (ageRange === "60+") {
      ageImage =
      <div className="cf-age-image">
        <img src={`/assets/60-plus.png`}></img>
      </div>
    } else {
      ageImage =
      <div className="cf-age-image">
        <img src={`/assets/${ageRange}.png`}></img>
      </div>
    }
  }

  return(
    <div className="slider-container">
      <label className="cf-slider-label text-medium" htmlFor={props.name}>
        {ageImage}
        Age Range: {ageRange}
      </label>
      <input onChange={props.onChange} type="range" min="10" max="60" step="5" value={selectedRange} name={props.name} className="slider" id="age-range-slider" />
    </div>

  )
}


export default AgeSlider;
