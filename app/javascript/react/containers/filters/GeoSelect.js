import React from 'react'

class GeoSelect extends React.Component {
  state = {
    rawGeoData: this.props.sortOpts.rawGeoData,
    processedGeoData: [],
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

  processGeoData = this.processGeoData.bind(this);

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
    this.processGeoData(this.state.rawGeoData)
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

  processGeoData(geoData) {
    var range = new CfRectangle(150, 100, 150, 100)
    var tree = new CfQuadTree(range, 1, 6)
    var p;
    for (var i = 0; i < geoData.length; i++) {
      var x = Math.round( (geoData[i].long + 180) / (180 / 150) )
      var y = Math.round( ((geoData[i].lat / -1) + 180) / (180 / 100) )
      p = new CfPoint(x, y)
      tree.insert(p)
    }
    var dataPoints = [];
    tree.getResBreakdown(dataPoints)
    this.setState({ processedGeoData: dataPoints})
  }

  render() {
    const { x, y, latitude, longitude, geoPin, radius, processedGeoData, rawGeoData } = this.state

    var buttonTypes = [
      ['', 'Anywhere', 0],
      ['huge', "Huge", 48],
      ['medium', "Big", 24],
      ['small', "Small", 0]
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

    var heatMarkers;
    if (processedGeoData) {
      var i = 0
      heatMarkers=
      processedGeoData.map((geo) => {
        var style;
        var r = (geo.val / rawGeoData.length) * 40

        style = {
          top: geo.y - r/2 ,
          left: geo.x - r/2,
          height: `${r}px`,
          width: `${r}px`
        }
        i++
        return(
          <div key={`heat_${i}`}  className={`cf-heatmap-marker`} style={style} />
        )
      })
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

        <div className="row cf-margin-top-5px">
          <div className="col-sm-12">
            <div className="cf-geomap-wrapper">
              <div className="cf-geomap-container" onMouseMove={this._onMouseMove} onClick={this.setLatLongClick}>
                {geoMarker} {heatMarkers}
              </div>
            </div>
          </div>
        </div>

        <div className="row cf-margin-top-10px">
          <div className="col-sm-12 cf-text-center">
            Search Within
          </div>
        </div>

        <div className="row cf-margin-top-5px">
          <div className="col-sm-12 cf-text-center">
            {radiusButtons}
          </div>
        </div>
      </div>
    )
  }
}
export default GeoSelect
