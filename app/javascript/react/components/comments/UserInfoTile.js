import React from 'react';

const UserInfoTile = props => {
  var userTile;

  if (!props.userTileHover) {
    var avatarImage = '/assets/avatar-default';
    if (props.userInfo.base_image) {
      avatarImage = `/assets/avatar-${props.userInfo.base_image}`
    }
    userTile =
    <div className="cf-comment-user-meta" onMouseEnter={props.onMouseEnter} onMouseLeave={props.onMouseLeave}>
      <div className="cf-comment-user-avatar">
        <span className="avatar-helper"></span>
        <img className="avatar-image" src={avatarImage} />
      </div>
      <div className="cf-comment-user-name" >
        {props.userName}
      </div>
    </div>
  } else {
    var demoData =
    <div className="cf-comment-user-data" >
      <div>
      User Name: {`${props.userInfo.user_name}`}
      </div>
      <div>
        Gender: {`${props.userInfo.gender}`}
      </div>
      <div>
        Age Range: {`${props.userInfo.age_range}`}
      </div>
    </div>

    if (!props.userInfo.user_name) {
      demoData =
      <div className="cf-comment-user-data">
        <div>
          Anonymous
        </div>
      </div>
    }

      userTile =
      <div className="cf-comment-user-meta" onMouseEnter={props.onMouseEnter} onMouseLeave={props.onMouseLeave}>
        <div className="cf-comment-user-avatar">
          <span className="avatar-helper"></span>
        </div>
        {demoData}
      </div>
    }

  return(
    <div>
    {userTile}
    </div>
  )
}

export default UserInfoTile;
