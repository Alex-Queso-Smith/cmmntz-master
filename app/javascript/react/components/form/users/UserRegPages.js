import React from 'react';

import { Input } from '../FormComponents';
import { ErrorClassValidation } from '../../../util/CoreUtil';
import { AgeSlider, GenderSelector, NukaCarousel as Carousel } from '../FormComponents';

export const UserRegPageOne = props => {

  var userNameClass, emailClass, passwordClass, passwordConfirmationClass;

  userNameClass = ErrorClassValidation(props.userNameError);
  emailClass = ErrorClassValidation(props.emailError);
  passwordClass = ErrorClassValidation(props.passwordError);
  passwordConfirmationClass = ErrorClassValidation(props.passwordConfirmationError);


  return(
    <div id="reg-required" className="form-group">
      <h3 className="text-center">Sign-Up Required Information</h3>
      <Input
        name="userName"
        label="User Name"
        onChange={props.onChange}
        content={props.userName}
        type="text"
        addClass={userNameClass}
      />
      {props.userNameError}
      <Input
        name="email"
        label="Email"
        onChange={props.onChange}
        content={props.email}
        type="text"
        addClass={emailClass}
      />
      {props.emailError}
      <Input
        name="password"
        label="Password"
        onChange={props.onChange}
        content={props.password}
        type="password"
        addClass={passwordClass}
      />
      {props.passwordError}
      <Input
        name="passwordConfirmation"
        label="Password Confirmation"
        onChange={props.onChange}
        content={props.passwordConfirmation}
        type="password"
        addClass={passwordConfirmationClass}
      />
      {props.passwordConfirmationError}
      <div className="form-group actions margin-top-10px">
        <button id="user-registration-button-page-one" className="btn btn-block btn-medium btn-primary" onClick={props.handleButtonClick} disabled={props.disabled}>
          <span className="text-medium">Next Page (Optional)</span>
        </button>
      </div>
    </div>
  );
};

export const UserRegPageTwo = props => {

  const { x, y, latitude, longitude, geoPin } = props

  if (props.latitude && props.longitude) {
    const style = {
      top: geoPin.y,
      left: geoPin.x
    }

    var geoMarker =
      <div className="cf-geomarker" style={style} />
  }

  return(
    <div id="reg-optional-1" className="form-group">
      <h3 className="text-center">Sign-Up Optional Information 1/2 </h3>
      <hr />
      <AgeSlider
        name="ageRange"
        label="Age Range"
        onChange={props.handleSliderChange}
        value={props.ageRange}
      />
      <hr />
      <GenderSelector
        name="gender"
        label="Gender"
        onChange={props.handleGenderChange}
        value={props.gender}
      />
      <hr />
      <div className="cf-geomap-wrapper">
        <div className="cf-geomap-container" onMouseMove={props.onMouseMove} onClick={props.setLatLongClick}>
          {geoMarker}
        </div>
      </div>
      <div className="custom-control custom-checkbox margin-top-10px">
        <input type="checkbox" className="custom-control-input" id='location-opt-out' autoComplete="off" />
        <label className="custom-control-label text-medium" htmlFor='location-opt-out' >None of Your Business</label>
      </div>
      <div className="form-group actions margin-top-10px">
        <button id="user-registration-button-page-two" className="btn btn-block btn-medium btn-primary" onClick={props.handleButtonClick} >
          <span className="text-medium">Next Page (Optional)</span>
        </button>
      </div>
      <div className="form-group actions margin-top-10px">
        <button id="user-registration-button-back-two" className="btn btn-block btn-medium btn-primary" onClick={props.handleBackClick}>
          <span className="text-medium">Back</span>
        </button>
      </div>
    </div>
  );
};

export const UserRegPageThree = props => {
  var selectedAvatar;
  if (props.avatar) {
    selectedAvatar =
    <div className="text-center">
      <img src={`/assets/avatar-${props.avatar}`} />
    </div>
  }

  return(
    <div id="reg-optional-2" className="form-group ">
      <h3 className="text-center">Sign-Up Optional Information 2/2 </h3>
      <hr />
      <div className="form-group margin-top-10px">
        <label className="text-medium text-center" htmlFor="avatar">Avatar</label>
        {selectedAvatar}
        <br />
        <Carousel
          onChange={props.handleAvatarClick}
        />
      </div>
      <input type="hidden"/>
      <div className="form-group actions margin-top-10px">
        <button id="user-registration-button-back-three" className="btn btn-block btn-medium btn-primary" onClick={props.handleBackClick}>
          <span className="text-medium">Back</span>
        </button>
      </div>
    </div>
  );
};

export default {
  UserRegPageOne,
  UserRegPageTwo,
  UserRegPageThree
}
