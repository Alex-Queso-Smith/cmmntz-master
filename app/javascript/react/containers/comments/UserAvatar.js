import React from 'react';

import { AgeRangeImageSelector } from '../../components/general/General';

class UserAvatar extends React.Component {
  state = {
    showInfoTile: false
  }


  render(){
    var { user_name, gender, age_range, base_image } = this.props.userInfo

    var { followStar, blockSym } = this.props
    var avatarImage = '/assets/guest';

    if (user_name === 'Anonymous') {
      avatarImage = `/assets/anonymous`
    }
    else if (base_image) {
      avatarImage = `/assets/${base_image}`
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
        <img style={style} src={`/assets/age-ranges/${age_range}`} />
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
        <img style={style} src={`/assets/genders/gender-${gender}`} />
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
