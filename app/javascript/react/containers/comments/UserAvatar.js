import React from 'react';

import { AgeRangeImageSelector } from '../../components/general/General';

class UserAvatar extends React.Component {
  state = {
    showInfoTile: false
  }


  render(){
    var { user_name, gender, age_range, base_image } = this.props.userInfo

    var { followStar, blockSym } = this.props
    var avatarImage = '/images/avatars/guest.png';

    if (user_name === 'Anonymous') {
      avatarImage = `/images/avatars/anonymous.png`
    }
    else if (base_image) {
      avatarImage = `/images/avatars/${base_image}.png`
    }

    var ageRangeImage;
    if (age_range != "") {
      const style = {
        height: "50px",
        width: "50px"
      }
      if (age_range === "15-19") { age_range = "13-19" }
      ageRangeImage =
      <div className="col-sm-6">
        <img style={style} src={`/images/icons-v2/age-ranges/${age_range}.png`} />
      </div>
    }

    var genderImage;
    if (gender != "") {
      const style = {
        height: "50px",
        width: "50px"
      }
      genderImage =
      <div className="col-sm-6">
        <img style={style} src={`/images/icons-v2/genders/gender-${gender}.png`} />
      </div>
    }

    var infoTile;
    if (this.state.showInfoTile) {
      infoTile=
      <div className="cf-avatar-infoTile">
        <div className="cf-avatar-infoTile-content">
          <div className="border-1px-bot">
            <div className="row">
              <div className="col-sm-12">
                <h4 className="user-name-avatar">{user_name}</h4>
              </div>
            </div>
            <div className="row">
                {followStar}
                {blockSym}
              <div className="col-sm-10" />
            </div>
          </div>
          <div className="row margin-top-10px gender-image-box">
            {genderImage}
            {ageRangeImage}
          </div>
        </div>
      </div>
    }

    var avatarOpacity = "translucent";
    if (this.props.userVoted) { avatarOpacity = "" }

    return(
      <div className="user-avatar-container">
        <div className="cf-comment-user-meta"
          onMouseEnter={() => this.setState({ showInfoTile: true })}
          onMouseLeave={() => this.setState({ showInfoTile: false })}
        >
          <div className="cf-comment-user-avatar">
            <span className="avatar-helper"></span>
            <img className={`avatar-image ${avatarOpacity}`} src={avatarImage} />
          </div>
          {infoTile}
        </div>
      </div>
    )
  }
}

export default UserAvatar;
