import React from 'react';

import { AgeRangeSelector, AgeSlider, GenderSelector, Checkbox } from '../../components/form/FormComponents';
import { FetchDidMount, FetchWithPush } from '../../util/CoreUtil';
import GeoPicker from '../../components/form/GeoPicker';

class UserEditDemographicsContainer extends React.Component {
  state = {
      gender: '',
      ageRange: '',
      latitude: '',
      longitude: '',
      x: '',
      y: '',
      geoPin: { x: '', y: '' },
      locationAnon: false,
      ageRangeAnon: false,
      genderAnon: false
  }

  _isMounted = false
  handleSliderChange = this.handleSliderChange.bind(this);
  setLatLongClick = this.setLatLongClick.bind(this);
  handleSubmit = this.handleSubmit.bind(this);
  handleChange = this.handleChange.bind(this);

  componentDidMount(){
    this._isMounted = true;

    var { userId } = this.props;

    FetchDidMount(this, `${this.props.globalSettings.baseUrl}/api/v1/users/${userId}.json`)
    .then(body => {
      var user = body.user

      var x = ( (user.longitude + 180) / (180 / 150) )
      var y = ( ((user.latitude / -1) + 180) / (180 / 100) )

      var gender;
      switch (user.gender) {
        case 0:
            gender = "female"
          break;
        case 1:
            gender = "other"
          break;
        case 2:
            gender = "male"
          break;
        default:
          gender = ""
      }

      var noLocation = false
      if (user.latitude === "" ) {
        noLocation = true
      }

      if (this._isMounted) {
        this.setState({
          ageRange: user.age_range,
          gender: gender,
          latitude: user.latitude,
          longitude: user.longitude,
          locationAnon: noLocation,
          ageRangeAnon: user.age_range === "",
          genderAnon: user.gender === "",
          x: x,
          y: y,
          geoPin: {
            x: x - 6,
            y: y - 6
          }
        })
      }
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  handleChange(event){
    const target = event.target;
    var value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    switch (name) {
      case "location":
        this.setState({
          latitude: "",
          longitude: "",
          x: "",
          y: "",
          geoPin: { x: "", y: "" },
          locationAnon: value
        })
        break;
      case "gender":
        value = target.getAttribute('value')
        this.setState({
          [name]: value,
          genderAnon: false
        })
        break;
      case "ageRangeAnon":
        this.setState({
          ageRange: "",
          ageRangeAnon: value
        })
        break;
      case "genderAnon":
        this.setState({
          gender: "",
          genderAnon: value
        })
        break;
      default:
        this.setState({ [name]: value })
    }
  }

  handleSliderChange(event){
    const target = event.target;
    var value = target.value;
    const name = target.name;
    var anon;
    if (value === "15") {
      value = "13"
      anon = false
    } else if (value === "10") {
      value = ""
      anon = true
    } else {
      anon = false
    }
    this.setState({
      [name]: value,
      ageRangeAnon: anon
    })

  }

  setLatLongClick(x, y){

    var longitude = Math.round((x * (180 / 150)) - 180)
    var latitude = Math.round(((y * (180 / 100)) - 180) * -1)

    this.setState({
      latitude: latitude,
      longitude: longitude,
      geoPin: { x: x - 6, y: y - 6 },
      locationAnon: false
     })
  }

  handleSubmit(event){
    event.preventDefault();

    var { userId } = this.props;
    var { gender } = this.state;

    switch (gender) {
      case "female":
          gender = 0
        break;
      case "other":
          gender = 1
        break;
      case "male":
          gender = 2
        break;
    }

    var user = new FormData();
    user.append("user[age_range]", this.state.ageRange);
    user.append("user[latitude]", this.state.latitude);
    user.append("user[longitude]", this.state.longitude);
    user.append("user[gender]", gender);

    FetchWithPush(this, `${this.props.globalSettings.baseUrl}/api/v1/users/${userId}.json`, '', 'PATCH', 'saveErrors', user)
    .then(body => {
      if (!body.errors) {
        this.setState({ saveErrors: {} })
        alert(`${body.message}`)
      }
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));

  }

  render(){
    var { ageRange, gender, x, y, latitude, longitude, geoPin, locationAnon, genderAnon, ageRangeAnon } = this.state;

    return(
      <div id="cf-user-edit-demographics-container">
        <form className="form" id="cf-user-edit-demographics-form" onSubmit={this.handleSubmit}>
          <AgeSlider
            name="ageRange"
            label="Age Range"
            onChange={this.handleSliderChange}
            value={ageRange}
            baseUrl={this.props.globalSettings.baseUrl}
          />
          <Checkbox
            name="ageRangeAnon"
            onChange={this.handleChange}
            label="Prefer Not To Say"
            checked={ageRangeAnon}
          />
          <hr />
          <GenderSelector
            name="gender"
            label="Gender"
            onChange={this.handleChange}
            value={gender}
            baseUrl={this.props.globalSettings.baseUrl}
          />
          <Checkbox
            name="genderAnon"
            onChange={this.handleChange}
            label="Prefer Not To Say"
            checked={genderAnon}
          />
          <hr />
          <h4 className="cf-text-medium">Click Near Where You Live</h4>
          <GeoPicker
            setLatLongClick={this.setLatLongClick}
            x={x}
            y={y}
            lat={latitude}
            long={longitude}
            geoPin={geoPin}
            handleChange={this.handleChange}
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
