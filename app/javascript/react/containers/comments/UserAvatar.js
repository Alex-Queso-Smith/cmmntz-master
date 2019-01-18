import React from 'react';

import { AgeRangeImageSelector } from '../../components/general/General';

class UserAvatar extends React.Component {
  state = {
    showInfoTile: false
  }


  render(){
    var { user_name, gender, age_range, base_image } = this.props.userInfo

    var { followStar, blockSym } = this.props
    var avatarImage = `${this.props.globalSettings.baseUrl}/images/avatars/anonymous-avatar.png`;

    if (user_name === 'Anonymous') {
      avatarImage = `${this.props.globalSettings.baseUrl}/images/avatars/anonymous-avatar.png`;
    }
    else if (base_image) {
      avatarImage = `${this.props.globalSettings.baseUrl}/images/avatars/${base_image}.png`
    }

    var ageRangeImage;
    if (age_range != "") {
      const style = {
        height: "50px",
        width: "50px"
      }
      if (age_range === "15-19") {
        age_range = "13-19"
      } else if (age_range === "75-79") {
        age_range = "75-plus"
      }
      ageRangeImage =
      <div className="col-6">
        <img style={style} src={`${this.props.globalSettings.baseUrl}/images/icons-v2/age-ranges/${age_range}.png`} />
      </div>
    }

    var genderImage;
    if (gender != "") {
      const style = {
        height: "50px",
        width: "50px"
      }
      genderImage =
      <div className="col-6">
        <img style={style} src={`${this.props.globalSettings.baseUrl}/images/icons-v2/genders/gender-${gender}.png`} />
      </div>
    }

    var blockFollowBox;
    if (followStar) {
      blockFollowBox =
      <div className="row justify-content-start cf-block-follow-box">
        {followStar}
        {blockSym}
        <div className="col-8"/>
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
                <h4 className="cf-user-name-avatar">{user_name}</h4>
              </div>
            </div>
            {blockFollowBox}
          </div>
          <div className="row cf-margin-top-10px cf-gender-image-box">
            {genderImage}
            {ageRangeImage}
          </div>
        </div>
      </div>
    }

    var avatarOpacity = "cf-translucent";
    if (this.props.userVoted) { avatarOpacity = "" }

    return(
      <div className="user-avatar-container">
        <div className="cf-comment-user-meta"
          onMouseEnter={() => this.setState({ showInfoTile: true })}
          onMouseLeave={() => this.setState({ showInfoTile: false })}
        >
          <div className="cf-comment-user-avatar">
            <span className="cf-avatar-helper"></span>
            <img className={`cf-avatar-image ${avatarOpacity}`} src={avatarImage} />
          </div>
          {infoTile}
        </div>
      </div>
    )
  }
}

export default UserAvatar;
