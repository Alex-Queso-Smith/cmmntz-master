import React from 'react';

import { AgeRangeSelector, AgeSlider, GenderSelector, Checkbox } from '../../components/form/FormComponents';
import { FetchDidMount, FetchWithPush } from '../../util/CoreUtil';
import GeoPicker from '../../components/form/GeoPicker';

class UserEditDemographicsContainer extends React.Component {
  state = {}

  render(){
    var { ageRange, gender, x, y, latitude, longitude, geoPin, locationAnon, genderAnon, ageRangeAnon } = this.props;

    return(
      <div id="cf-user-edit-demographics-container">
        <form className="form" id="cf-user-edit-demographics-form" onSubmit={this.props.handleSubmit}>
          <AgeSlider
            name="ageRange"
            label="Age Range"
            onChange={this.props.handleSliderChange}
            value={ageRange}
            baseUrl={this.props.globalSettings.baseUrl}
            baseImageUrl={this.props.globalSettings.baseImageUrl}
          />
          <Checkbox
            name="ageRangeAnon"
            onChange={this.props.handleDemoChange}
            label="Prefer Not To Say"
            checked={ageRangeAnon}
          />
          <hr />
          <GenderSelector
            name="gender"
            label="Gender"
            onChange={this.props.handleDemoChange}
            value={gender}
            baseUrl={this.props.globalSettings.baseUrl}
            baseImageUrl={this.props.globalSettings.baseImageUrl}
          />
          <Checkbox
            name="genderAnon"
            onChange={this.props.handleDemoChange}
            label="Prefer Not To Say"
            checked={genderAnon}
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
            handleChange={this.props.handleDemoChange}
            locationAnon={locationAnon}
          />
        <hr />
          <div className="form-group actions">
            <button id="cf-user-edit-demographics-button" type="submit" className="btn btn-sm cf-float-right btn-dark" value="Submit">
              Update
            </button>
            <button className="btn btn-sm btn-dark cf-float-left" onClick={ this.props.updateDisplay }>
              Close
            </button>
          </div>
        </form>
      </div>
    )
  }
}

export default UserEditDemographicsContainer
