import React from 'react';

class Carousel extends React.Component {
  render(){

    

    const ImageSlide = props => {
      const styles = {
        backgroundImage: `/assets/${props.avatarPath}`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }

      return (
        <div className="image-slide" style={styles}>
        </div>
      )
    }

    const Arrow = (clickFunction, image)
    return(
      <div className="cf-avatar-carousel">
        <ImageSlide imagePath={currentAvatar} />
      </div>
    )
  }
}

export default Carousel;
