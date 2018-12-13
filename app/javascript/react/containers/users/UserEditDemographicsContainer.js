import React from 'react';

import { AgeRangeSelector, AgeSlider, GenderSelector } from '../../components/form/FormComponents';
import { FetchDidMount, FetchWithPush } from '../../util/CoreUtil';
import GeoPicker from '../../components/form/GeoPicker';

class UserEditDemographicsContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      gender: '',
      ageRange: '',
      latitude: '',
      longitude: '',
      x: '',
      y: '',
      geoPin: { x: '', y: '' },
    }
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.setLatLongClick = this.setLatLongClick.bind(this);
    this.handleGenderChange = this.handleGenderChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount(){

    var { userId } = this.props;

    FetchDidMount(this, `/api/v1/users/${userId}.json`)
    .then(body => {
      var user = body.user

      var x = ((user.longitude + 180) / (180 / 150))
      var y = (((user.latitude / -1) + 180) / (180 / 100))

      this.setState({
        ageRange: user.age_range,
        gender: user.gender,
        latitude: user.latitude,
        longitude: user.longitude,
        x: x,
        y: y,
        geoPin: {
          x: x - 6,
          y: y - 6
        }
      })
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  handleChange(event){
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (name === "location" && value === true) {
      this.setState({
        latitude: "",
        longitude: "",
        x: "",
        y: "",
        geoPin: { x: "", y: "" }
      })
    } else {
      this.setState({ [name]: value })
    }

  }

  handleGenderChange(event){
    event.preventDefault();
    const target = event.target;
    const value = target.name;
    this.setState({ gender: value })
  }

  handleSliderChange(event){
    const target = event.target;
    var value = target.value;
    const name = target.name;

    if (value === "15") {
      value = "13"
    } else if (value === "10") {
      value = ""
    }
    this.setState({
      [name]: value
    })
  }

  setLatLongClick(x, y){

    var longitude = Math.round((x * (180 / 150)) - 180)
    var latitude = Math.round(((y * (180 / 100)) - 180) * -1)

    this.setState({
      latitude: latitude,
      longitude: longitude,
      geoPin: { x: x - 6, y: y - 6 }
     })
  }

  handleSubmit(event){
    event.preventDefault();

    var { userId } = this.props;

    var user = new FormData();
    user.append("user[age_range]", this.state.ageRange);
    user.append("user[latitude]", this.state.latitude);
    user.append("user[longitude]", this.state.longitude);
    user.append("user[gender]", this.state.gender);

    FetchWithPush(this, `/api/v1/users/${userId}.json`, '', 'PATCH', 'saveErrors', user)
    .then(body => {
      if (!body.errors) {
        this.setState({ saveErrors: {} })
        alert(`${body.message}`)
      }
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));

  }

  render(){
    var { ageRange, gender, x, y, latitude, longitude, geoPin } = this.state;

    return(
      <div id="user-edit-demographics-container">
        <form className="form" id="user-edit-demographics-form" onSubmit={this.handleSubmit}>
          <AgeSlider
            name="ageRange"
            label="Age Range"
            onChange={this.handleSliderChange}
            value={ageRange}
          />
          <hr />
          <GenderSelector
            name="gender"
            label="Gender"
            onChange={this.handleGenderChange}
            value={gender}
          />
          <hr />
          <GeoPicker
            setLatLongClick={this.setLatLongClick}
            x={x}
            y={y}
            lat={latitude}
            long={longitude}
            geoPin={geoPin}
            handleChange={this.handleChange}
          />
          <div className="form-group actions margin-top-10px">
            <button id="user-edit-demographics-button" type="submit" className="btn btn-block btn-large btn-dark" value="Submit">
              <span className="text-medium">Update</span>
            </button>
          </div>
        </form>
      </div>
    )
  }
}

export default UserEditDemographicsContainer
