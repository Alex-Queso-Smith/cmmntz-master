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
        <img style={style} src={`${this.props.globalSettings.baseUrl}/images/avatars/${this.props.selectedAvatar}.png`} />
      </div>
    }

    var updateDisplayLogin = () => {
      this.props.updateDisplay("login")
    }

    var loginSpanStyle = {
      fontSize: "13px",
      fontWeight: "bold"
    }

    var loginDivStyle = {
      lineHeight: "2"
    }
    
    return(
      <div id="reg-optional-1" className="form-group">
        <hr />
        <AgeSlider
          name="ageRange"
          label="Age Range"
          onChange={this.props.handleSliderChange}
          value={this.props.ageRange}
          baseUrl={this.props.globalSettings.baseUrl}
          focus={true}
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
          baseUrl={this.props.globalSettings.baseUrl}
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
        <hr />
        <div className="form-group cf-margin-top-10px">
          <h4 className="cf-text-medium" htmlFor="avatar">Avatar</h4>
          {selectedAvatar}
          <br />
          <Carousel
            onChange={this.props.handleAvatarClick}
            baseUrl={this.props.globalSettings.baseUrl}
          />
        </div>
        <hr />
        <div className="cf-margin-top-10px">
            <div style={loginDivStyle} className="cf-float-left">
              <span style={loginSpanStyle}>Already Registered?</span>
              <button className="btn btn-sm btn-link cf-margin-right-10px" onClick={ updateDisplayLogin }>
                Login
              </button>
            </div>
            <button id="user-registration-button" type="submit" className="btn btn-sm btn-dark cf-float-right" value="Submit" disabled={this.props.disabled}>
              Register
            </button>
        </div>
      </div>
    )
  }
}

export default UserNewOptionalContainer
