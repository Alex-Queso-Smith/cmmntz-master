import React from 'react';
import Carousel from 'nuka-carousel';
import { AgeRangeImageSelector } from '../general/General'


export const AgeSlider = props => {
  var selectedRange = props.value;
  var ageRange;
  var ageImage =
  <AgeRangeImageSelector
    age={selectedRange}
    baseImageUrl={props.baseImageUrl}
  />

  var { noRangeMessageOverride } = props
  if (selectedRange == "") {
    ageRange = noRangeMessageOverride ? noRangeMessageOverride : "Prefer Not To Say"
    selectedRange = "10"
  } else {
    var age = parseInt(selectedRange)

    if (age === 75) {
      ageRange = "75+"
    } else if (age === 13){
      ageRange = "13-19"
    } else {
      ageRange = `${age}-${age+4}`
    }
  }

  return(
    <div className="cf-slider-container cf-text-center">
      <label className="cf-slider-label cf-text-medium" htmlFor={props.name}>
        {ageImage}
        <div className="cf-slider-age-range">
          Age Range: {ageRange}
        </div>
      </label>
      <input autoFocus={props.focus} onChange={props.onChange} type="range" min="10" max="75" step="5" value={selectedRange} name={props.name} className="cf-age-slider" id="age-range-slider" />
    </div>

  )
}

export const Checkbox = props => {
  return(
    <div className={`custom-control custom-checkbox cf-margin-top-10px ${props.className}`}>
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
  var translucency = "cf-translucent";
  var genders = [
    ["0", "female", "Female"],
    ["2", "male", "Male"],
    ["1", "other", "Other"]
  ];

  var genderButtons = genders.map((gender) => {
    var translucency = gender[1] === props.value ? "" : "cf-translucent"

    return(
      <GenderButton
        key={`gender-${gender[1]}`}
        translucency={translucency}
        onChange={props.onChange}
        imageName={gender[1]}
        value={gender[1]}
        label={gender[2]}
        name={"gender"}
        baseImageUrl={props.baseImageUrl}
      />
    )
  })

  return(
    <div>
      <h4 className="cf-text-medium">{props.label}</h4>
      <div id="gender-selector" className="row cf-margin-top-bottom-10px justify-content-center">
        {genderButtons}
      </div>
    </div>
  );
};

const GenderButton = props => {
  return(
    <div className={`col-3`}>
      <img className={`cf-gender-btn ${props.translucency}`} onClick={props.onChange} name={props.name} value={props.value} src={`${props.baseImageUrl}/images/icons-v2/genders/gender-${props.imageName}.png`} />
      <div className="cf-text-center">
        {props.label}
      </div>
    </div>
  );
};

export const Input = props => {
  var labelStyle = {
    marginBottom: "5px"
  }

  return(
    <div className="form-group">
      <label style={labelStyle} className="cf-text-medium" htmlFor={props.name}>{props.label}</label>
      <input autoFocus={props.focus} className={`form-control cf-margin-top-5px ${props.addClass}`} type={props.type} name={props.name} value={props.content} onChange={props.onChange}></input>
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

const randomAvatars = [
  "bat_924885_92a6dd",
  "bunny_4dce74_9279a5",
  "cat_9e6bc6_c4c4c4",
  "chicken_c485d3_e2c89f",
  "cow_79e8c3_e88e8e",
  "crab_b24949_14a9dd",
  "deer_9e844f_94c472",
  "dog_e8c972_649e93",
  "duck_dbdb6b_7d64ba",
  "flower_efe778_9ad5e5",
  "goat_956fce_83ddb4",
  "owl_d36363_4f5872",
  "pig_247ee0_c1e293",
  "potted_plant_93835f_255e1b",
  "rat_688e4f_bababa",
  "rooster_d37272_9fd88f",
  "sheep_dddddd_629698",
  "snake_4cc151_cfe053",
  "tree_6d643c_81cc71"
]

export const NukaCarousel = props => {

  var style = {
    height: '55px',
    width: '55px'
  }

  var avatarImages = newAvatars.map((a) => {

    return(
      <img style={style} onClick={props.onChange} name={`${a}_ffffff_000000`} key ={a} src={`${props.baseImageUrl}/images/avatars/${a}_ffffff_000000.png`} />
    )
  })

  var redImages = newAvatars.map((a) => {

    return(
      <img style={style} onClick={props.onChange} name={`${a}_ffffff_ff0000`} key ={a} src={`/images/avatars/${a}_ffffff_ff0000.png`} />
    )
  })

  var allImages = []

  for (var i = 0; i < avatarImages.length; i++) {
    allImages.push(avatarImages[i])
    allImages.push(redImages[i])
  }

  var randomImages = randomAvatars.map((a) => {

    return(
      <img style={style} onClick={props.onChange} name={`${a}`} key ={a} src={`/images/avatars/${a}.png`} />
    )
  })

  var everything = randomImages.concat(allImages)

  return(
    <Carousel slidesToShow={7} renderBottomCenterControls={function(){}} slidesToScroll={4} wrapAround={true}>
      {everything}
    </Carousel>
  )
}
