import React from 'react';
import Rheostat from 'rheostat'

class AgeSlider extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      ageRange: 0
    }
    this.handleSliderDrag = this.handleSliderDrag.bind(this);
    this.handleSliderRelease = this.handleSliderRelease.bind(this);
  }

  handleSliderRelease(){

  }

  handleSliderDrag(){

  }

  render(){
    return(
      <Rheostat
        min={13}
        max={60}
        
      />
    )
  }
}

export default AgeSlider;
