import React from 'react'

class GeoSelect extends React.Component {
  state = {
    radius: this.props.sortOpts.radius,
    geoPin: {
      x: '',
      y: ''
    },
    latitude: '',
    longitude: '',
    x: '',
    y: '',
  }

  _onMouseMove = this._onMouseMove.bind(this);
  setLatLongClick = this.setLatLongClick.bind(this);
  handleChange = this.handleChange.bind(this);

  componentDidUpdate(prevProps, prevState){
    if (this.props.radius != prevProps.radius) {

      var { radius } = this.props;

      this.setState({
        radius
      })
    }
  }

  componentDidMount(){
    if (this.props.userInfo.geoPin) {
      var { latitude, longitude, geoPin } = this.props.userInfo;

      this.setState({
        geoPin,
        latitude,
        longitude
      })
    }
  }

  handleChange(event){
    event.preventDefault();
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({ [name]: value })

    const { x, y } = this.state.geoPin
    this.props.parentSetLatLongClick(x, y, value);
  };

  _onMouseMove(event) {
    this.setState({ x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY });
  }

  setLatLongClick(event){
    const { x, y, radius } = this.state

    var longitude = Math.round((x * (180 / 150)) - 180)
    var latitude = Math.round(((y * (180 / 100)) - 180) * -1)
    var newGeoPin = this.state.geoPin

    newGeoPin.x =  x - 6
    newGeoPin.y = y - 6

    this.setState({
      latitude: latitude,
      longitude:  longitude,
      geoPin: newGeoPin
     })

     // update parent
     this.props.parentSetLatLongClick(x, y, radius);
  }

  render() {
    const { x, y, latitude, longitude, geoPin, radius } = this.state

    var buttonTypes = [
      ['', 'Anywhere', 0],
      ['huge', "Huge Circle", 48],
      ['medium', "Big Circle", 24],
      ['small', "Small Circle", 0]
    ]

    if (latitude && longitude) {
      var style;
      if (radius != "" && radius != "small") {
        var type = buttonTypes.find(t => t[0] == radius)
        style = {
          top: (geoPin.y + 6) - (type[2]/2),
          left: (geoPin.x + 6) - (type[2]/2)
        }
      } else {
        style = {
          top: geoPin.y,
          left: geoPin.x
        }
      }


      var geoMarker =
        <div className={`cf-geomarker ${radius}`} style={style} />
    }

    var radiusButtons = buttonTypes.map((type) => {
      var btnClass = 'cf-translucent'
      if (this.state.radius === type[0]) {
        btnClass = ""
      }

      return(
        <button key={type[0]} className={`btn-sm btn-dark ${btnClass} cf-geo-filter-button`} name="radius" value={type[0]} onClick={this.handleChange}>
          {type[1]}
        </button>
      )
    })

    return(
      <div className="geo-select-container">

        <div className="row">
          <div className="col-sm-12">
            Click an Area of the map to center your search
          </div>
        </div>

        <div className="row cf-margin-top-5px">
          <div className="col-sm-12">
            <div className="cf-geomap-wrapper">
              <div className="cf-geomap-container cf-margin-0" onMouseMove={this._onMouseMove} onClick={this.setLatLongClick}>
                {geoMarker}
              </div>
            </div>
          </div>
        </div>

        <div className="row cf-margin-top-10px">
          <div className="col-sm-12">
            Search Within
          </div>
        </div>

        <div className="row cf-margin-top-5px">
          <div className="col-sm-12">
            {radiusButtons}
          </div>
        </div>
      </div>
    )
  }
}
export default GeoSelect
