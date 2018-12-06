import React from 'react'

class UserAvatar extends React.Component {
  state = {
    showInfoTile: false
  }

  handleAvatarClick = this.handleAvatarClick.bind(this);

  handleAvatarClick(event) {
    event.preventDefault()

    this.setState({ showInfoTile: !this.state.showInfoTile })
  }

  render(){
    var { user_name, gender, age_range, base_image } = this.props.userInfo
    var { followStar, blockSym } = this.props
    var avatarImage = '/assets/avatar-default';
    if (base_image) {
      avatarImage = `/assets/avatar-${base_image}`
    }

    var infoTile;
    if (this.state.showInfoTile) {
      infoTile=
      <div className="cf-avatar-infoTile">
        <div className="cf-avatar-infoTile-content">
          <div className="border-1px-bot">
            <div className="row">
              <div className="col-7">
                <h4>{user_name}</h4>
              </div>
              {followStar}
              {blockSym}
            </div>
          </div>
          <div className="text-center margin-top-10px">
            {gender}
          </div>
          <div className="text-center margin-top-10px">
            {age_range}
          </div>
        </div>
      </div>
    }

    return(
      <div className="user-avatar-container">
        <div className="cf-comment-user-meta" onClick={this.handleAvatarClick}>
          <div className="cf-comment-user-avatar">
            <span className="avatar-helper"></span>
            <img className="avatar-image" src={avatarImage} />
          </div>
          {infoTile}
        </div>
      </div>
    )
  }
}

export default UserAvatar;
