import React from 'react';
import Carousel from 'nuka-carousel';


export const AgeSlider = props => {
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
      <div>
        <img className="cf-age-image" src={`/assets/60-plus.png`} />
      </div>
    } else {
      ageImage =
      <div>
        <img className="cf-age-image" src={`/assets/${ageRange}`} />
      </div>
    }
  } else {
    ageImage =
    <div>
      <img className="cf-age-image" src={`/assets/age-range-none.png`} />
    </div>
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

export const Checkbox = props => {
  return(
    <div className={`custom-control custom-checkbox margin-top-10px ${props.className}`}>
      <input
      type="checkbox"
      className="custom-control-input cf-checkbox"
      name={props.name}
      id={props.name}
      onClick={props.onChange}
      autoComplete="off"
      checked={props.checked}
      onChange={() => {}}
      />
      <label className="custom-control-label" htmlFor={props.name}>{props.label}</label>
    </div>
  );
};

export const GenderSelector = props => {
  var translucency = "translucent";
  var genders = [
    ["", "none", "None of your Biz!"],
    ["0", "female", "Female"],
    ["1", "other", "Other"],
    ["2", "male", "Male"]
  ];

  var genderButtons = genders.map((gender) => {
    var translucency;

    if (gender[0] == "") {
      translucency = props.value.length == 0 ? "" : "translucent"
    } else {
      translucency = parseInt(props.value) === parseInt(gender[0]) ? "" : "translucent"
    }
    return(
      <GenderButton
        key={`gender-${gender[1]}`}
        translucency={translucency}
        onChange={props.onChange}
        imageName={gender[1]}
        label={gender[2]}
        name={gender[0]}
      />
    )
  })

  return(
    <div>
      <label className="text-medium">Gender</label>
      <div id="gender-selector" className="row margin-top-bottom-10px">
        {genderButtons}
      </div>
    </div>
  );
};

const GenderButton = props => {
  return(
    <div className={`col-3`}>
      <img className={`gender-btn gender-none ${props.translucency}`} onClick={props.onChange} name={props.name} src={`/assets/gender-${props.imageName}.png`} />
      <div>{props.label}</div>
    </div>
  );
};

export const Input = props => {
  return(
    <div className="form-group">
      <label className="text-medium" htmlFor={props.name}>{props.label}</label>
      <input className={`form-control margin-top-10px ${props.addClass}`} type={props.type} name={props.name} value={props.content} onChange={props.onChange}></input>
    </div>
  );
};

export const RadioButton = props => {
  return(
    <label htmlFor={props.id} className="">
      <input onChange={props.onChange} type="radio" name={props.name} id={props.id} autoComplete="off" value={props.value} /> {props.label}
    </label>
  );
};

export const Avatars = [
  "boxing-glove",
  "burger",
  "butterfly",
  "deer",
  "female-superhero-0",
  "male-superhero-0",
  "female-superhero-1",
  "male-superhero-1",
  "female-superhero-2",
  "male-superhero-2",
  "female-superhero-3",
  "male-superhero-3",
  "female-wizard-0",
  "male-wizard-0",
  "female-wizard-1",
  "male-wizard-1",
  "female-wizard-2",
  "male-wizard-2",
  "fox",
  "french-fries",
  "gi",
  "gorilla",
  "hotdog",
  "mouse",
  "snail",
  "male-zombie",
  "female-zombie",
  "taco",
  "whale"
]

const newAvatars = [
  "bat",
  "bunny",
  "cactus",
  "cat",
  "c_mas_tree",
  "c_nut_tree",
  "cow",
  "crab",
  "deer",
  "dog",
  "duck",
  "flower",
  "goat",
  "lamb",
  "owl",
  "pig",
  "pot_plant",
  "rat",
  "rooster",
  "snake",
  "tree",
  "turtle"
]

export const NukaCarousel = props => {

  var avatarImages = newAvatars.map((a) => {
    var style = {
      height: '55px',
      width: '55px'
    }
    return(
      <img style={style} onClick={props.onChange} name={`${a}_ffffff_000000`} key ={a} src={`/assets/${a}_ffffff_000000`} />
    )
  })

  var redImages = newAvatars.map((a) => {
    var style = {
      height: '55px',
      width: '55px'
    }
    return(
      <img style={style} onClick={props.onChange} name={`${a}_ffffff_ff0000`} key ={a} src={`/assets/${a}_ffffff_ff0000`} />
    )
  })

  var allImages = []

  for (var i = 0; i < avatarImages.length; i++) {
    allImages.push(avatarImages[i])
    allImages.push(redImages[i])
  }

  return(
    <Carousel slidesToShow={7} renderBottomCenterControls={function(){}} slidesToScroll={4} wrapAround={true}>
      {allImages}
    </Carousel>
  )
}
