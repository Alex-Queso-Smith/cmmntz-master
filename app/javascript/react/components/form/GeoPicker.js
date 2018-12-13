import React from 'react';

import { Checkbox } from './FormComponents';

class GeoPicker extends React.Component {
  state = {
    x: this.props.x,
    y: this.props.y
  }

  _onMouseMove = this._onMouseMove.bind(this);

  _onMouseMove(event) {
    this.setState({ x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY });
  }

  render(){
    var { x, y } = this.state;
    const { lat, long, geoPin } = this.props;

    var setLatLong = () => {
      this.props.setLatLongClick(x, y)
    }

    if (this.props.lat && this.props.long) {

      const style = {
        top: geoPin.y,
        left: geoPin.x
      }

      var geoMarker =
        <div className="cf-geomarker" style={style}>
        </div>
    }

    return(
      <div id="geo-picker">
        <div className="cf-geomap-wrapper">
        <h4 className="text-center">Choose your location</h4>
          <div className="cf-geomap-container" onMouseMove={this._onMouseMove} onClick={setLatLong}>
            {geoMarker}
          </div>
        </div>
        <Checkbox
          name="location"
          onChange={this.props.handleChange}
          label="None of Your Business"
          className=""
        />
      </div>
    )
  }
}

export default GeoPicker;
