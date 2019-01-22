import React from 'react';

export const AgeRangeImageSelector = (props) => {
  var age = props.age
  var ageRange, ageImage;

  switch (age.toString()) {
    case "":
      ageRange = "Prefer Not To Say"
      age = "10"
      break;
    case "10":
      ageRange = "Prefer Not To Say"
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
      ageRange = "60-64"
      break;
    case "65":
      ageRange = "65-69"
      break;
    case "70":
      ageRange = "70-74"
      break;
    case "75":
      ageRange = "75+"
      break;
  }

  if (
    props.age != "" &&
    props.age != "10"
  ) {
    if (ageRange === "75+") {
      ageImage =
      <div>
        <img className="cf-age-image" src={`${props.baseUrl}/images/icons-v2/age-ranges/75-plus.png`} />
      </div>
    } else {
      ageImage =
      <div>
        <img className="cf-age-image" src={`${props.baseUrl}/images/icons-v2/age-ranges/${ageRange}.png`} />
      </div>
    }
  } else {
    ageImage =
    <div>
      <img className="cf-age-image" src={`${props.baseUrl}/images/question-mark.png`} />
    </div>
  }

  return ageImage
}
