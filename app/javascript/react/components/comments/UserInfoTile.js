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
    </div>
  } else {
    var demoData =
    <div className="cf-comment-user-data" >
      <div>
        {`${props.userInfo.user_name}`}
      </div>
      <div>
        {`${props.userInfo.gender}`}
      </div>
      <div>
        {`${props.userInfo.age_range}`}
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
      <div className="cf-comment-user-meta cursor-help" onMouseEnter={props.onMouseEnter} onMouseLeave={props.onMouseLeave}>
        <div className="cf-comment-user-avatar">
          <span className="avatar-helper"></span>
          {demoData}
        </div>
      </div>
    }

  return(
    <div>
    {userTile}
    </div>
  )
}

export default UserInfoTile;
