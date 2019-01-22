import React from 'react';

class GeoInfo extends React.Component {
  state = {}

  render(){
    var {geoPin} = this.props;

    if (this.props.geoPin) {
      const geoPinStyle = {
        top: geoPin.y,
        left: geoPin.x
      }

      var geoMarker = <div className="cf-geomarker-small" style={geoPinStyle} />

    }

    return(
      <div className="cf-geomap-wrapper">
        <div className="cf-geo-info-container" >
          {geoMarker}
        </div>
      </div>
    )
  }
}

export default GeoInfo;
