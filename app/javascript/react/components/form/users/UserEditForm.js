import React from 'react';

import { Input, NukaCarousel as Carousel } from '../FormComponents';
import { ErrorClassValidation } from '../../../util/CoreUtil';
import { AgeRangeSelector, AgeSlider, GenderSelector } from '../FormComponents';
import UserThemeSelector from '../UserThemeSelector';

const UserEditForm = props => {

  var userNameClass, emailClass, selectedAvatar;

  userNameClass = ErrorClassValidation(props.userNameError);
  emailClass = ErrorClassValidation(props.emailError);

  if (props.avatar) {
    selectedAvatar =
    <div className="text-center">
      <h5>Selected Avatar</h5>
      <img src={`/assets/avatar-${props.avatar}`} />
    </div>
  }

  return(
    <div>
      <div id="reg-required" className="form-group">
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
      </div>
      <div id="reg-optional-1" className="form-group">
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
        <Input
          name="latitude"
          label="Latitude"
          onChange={props.onChange}
          content={props.latitude}
          type="text"
        />
        <Input
          name="longitude"
          label="Longitude"
          onChange={props.onChange}
          content={props.longitude}
          type="text"
        />
        <div className="custom-control custom-checkbox margin-top-10px">
          <input type="checkbox" className="custom-control-input" id='location-opt-out' autoComplete="off" />
          <label className="custom-control-label text-medium" htmlFor='location-opt-out' >None of Your Business</label>
        </div>

        <hr />
        <UserThemeSelector
          onChange={props.handleThemeSelectorChange}
          font={props.font}
          colorTheme={props.colorTheme}
        />
      </div>
      <div id="reg-optional-2" className="form-group ">
        <hr />
        <div className="form-group margin-top-10px">
          <label className="text-large text-center" htmlFor="avatar">Choose Your Avatar</label>
          <br />
          {selectedAvatar}
          <Carousel
            onChange={props.handleAvatarClick}
            />
        </div>
        <input type="hidden"/>
      </div>
    </div>
  );
};

export default UserEditForm;
