import React from 'react';

import UserInfoTile from './UserInfoTile';

class Reply extends React.Component {
  state = {
    userTileHover: false
  }
  
  onUserHover = this.onUserHover.bind(this);

  onUserHover(){
    this.setState({ userTileHover: !this.state.userTileHover })
  }

  render(){
    var userInfo;

    if (this.props.user.user_name == '') {
      userInfo = "Anonymous"
    } else {
      userInfo = `${this.props.user.user_name} - ${this.props.user.gender} - ${this.props.user.age_range}`
    }

    return(
      <div className="cf-comment cf-comment-reply margin-top-10px">
        <div className="cf-comment-wrapper">

          <UserInfoTile
            userTileHover={this.state.userTileHover}
            userInfo={this.props.user}
            onMouseEnter={this.onUserHover}
            onMouseLeave={this.onUserHover}
            userName={this.props.user.user_name}
            />
          <div className="cf-comment-w-meta">
            <div className="cf-comment-comment-meta">
              <div className="cf-comment-at" >
                {this.props.posted}
              </div>
            </div>
            <div className="cf-comment-text" >
              {this.props.reply}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Reply;
