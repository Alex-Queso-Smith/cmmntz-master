import React from 'react';

import { Input, Checkbox, AgeSlider, GenderSelector, NukaCarousel as Carousel } from '../../components/form/FormComponents';
import GeoPicker from '../../components/form/GeoPicker';

class UserNewOptionalContainer extends React.Component {
  state = {}

  render(){
    const { x, y, latitude, longitude, geoPin, locationAnon } = this.props

    if (this.props.latitude && this.props.longitude) {
      const style = {
        top: geoPin.y,
        left: geoPin.x
      }

      var geoMarker =
        <div className="cf-geomarker" style={style} />
    }

    var selectedAvatar;
    if (this.props.selectedAvatar) {
      var style = {
        height: '110px',
        width: '110px',
        marginBottom: '10px'
      }

      selectedAvatar =
      <div className="cf-text-center">
        <img style={style} src={`/images/avatars/${this.props.selectedAvatar}.png`} />
      </div>
    }
    return(
      <div id="reg-optional-1" className="form-group">
        <hr />
        <AgeSlider
          name="ageRange"
          label="Age Range"
          onChange={this.props.handleSliderChange}
          value={this.props.ageRange}
        />
        <Checkbox
          name="ageRangeAnon"
          onChange={this.props.onChange}
          label="Prefer Not To Say"
          checked={this.props.ageRangeAnon}
        />
        <hr />
        <GenderSelector
          name="gender"
          label="Gender"
          onChange={this.props.onChange}
          value={this.props.gender}
        />
        <Checkbox
          name="genderAnon"
          onChange={this.props.onChange}
          label="Prefer Not To Say"
          checked={this.props.genderAnon}
        />
        <hr />
        <h4 className="cf-text-medium">Click Near Where You Live</h4>
        <GeoPicker
          setLatLongClick={this.props.setLatLongClick}
          x={x}
          y={y}
          lat={latitude}
          long={longitude}
          geoPin={geoPin}
          handleChange={this.props.onChange}
          locationAnon={locationAnon}
        />
        <div className="form-group cf-margin-top-10px">
          <label className="cf-text-medium cf-text-center" htmlFor="avatar">Avatar</label>
          {selectedAvatar}
          <br />
          <Carousel
            onChange={this.props.handleAvatarClick}
          />
        </div>
        <div className="row actions cf-margin-top-10px">
          <div className="col-sm-6">
            <button id="user-registration-button-back" className="btn btn-sm btn-dark cf-float-left" onClick={this.props.handleBackClick}>
              Back
            </button>
          </div>
          <div className="col-sm-6">
            <button id="user-registration-button" type="submit" className="btn btn-sm btn-dark cf-float-right" value="Submit" disabled={this.props.disabled}>
              Register
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default UserNewOptionalContainer
