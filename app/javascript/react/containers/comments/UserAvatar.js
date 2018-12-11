import React from 'react'

class UserAvatar extends React.Component {
  state = {
    showInfoTile: false
  }


  render(){
    var { user_name, gender, age_range, base_image } = this.props.userInfo
    var { followStar, blockSym } = this.props
    var avatarImage = '/assets/avatar-default';
    if (base_image) {
      avatarImage = `/assets/${base_image}`
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
        <div className="cf-comment-user-meta"
          onMouseEnter={() => this.setState({ showInfoTile: true })}
          onMouseLeave={() => this.setState({ showInfoTile: false })}
        >
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
