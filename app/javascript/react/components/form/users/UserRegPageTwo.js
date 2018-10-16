import React from 'react';

import Input from '../Input';
import AgeRange from '../AgeRange';
import GenderButton from '../GenderButton';

const UserRegPageTwo = props => {
  return(
    <div id="reg-optional-1" className="form-group">
      <h3 className="text-center">Sign-Up Optional Information 1/2 </h3>

      <hr />

      <AgeRange
        name="ageRange"
        label="Age Range"
        handleChange={props.handleChange}
        content={props.ageRange}
        type="text"
      />
      <hr />
      <GenderButton
        name="gender"
        label="Gender"
        handleChange={props.handleChange}
        content={props.gender}
        type="text"
      />
      <hr />
      <Input
        name="latitude"
        label="Latitude"
        handleChange={props.handleChange}
        content={props.latitude}
        type="text"
      />
      <Input
        name="longitude"
        label="Longitude"
        handleChange={props.handleChange}
        content={props.longitude}
        type="text"
      />
      <div className="custom-control custom-checkbox margin-top-10px">
        <input type="checkbox" className="custom-control-input" id='location-opt-out' autoComplete="off" />
        <label className="custom-control-label text-medium" htmlFor='location-opt-out' >None of Your Business</label>
      </div>
      <div className="form-group actions margin-top-10px">
        <button id="user-registration-button-page-two" className="btn btn-block btn-large btn-dark" onClick={props.handleButtonClick} >
          <span className="text-large">Next Page (Optional)</span>
        </button>
      </div>
      <div className="form-group actions margin-top-10px">
        <button id="user-registration-button-back-two" className="btn btn-block btn-large btn-dark" onClick={props.handleBackClick}>
          <span className="text-large">Back</span>
        </button>
      </div>
    </div>
  )
}

export default UserRegPageTwo;
