import React from 'react';

const Reply = props => {
  var userInfo;

  if (props.user.user_name == '') {
    userInfo = "Anonymous"
  } else {
    userInfo = `${props.user.user_name} - ${props.user.gender} - ${props.user.age_range}`
  }

  return(
    <div className="cf-comment cf-comment-reply margin-top-10px">
      <div className="cf-comment-wrapper">
        <div className="cf-comment-user-meta">
          <div className="cf-comment-user-avatar">
          </div>
          <div className="cf-comment-user-name">
            User: {userInfo}
          </div>
        </div>

        <div className="cf-comment-w-meta">
          <div className="cf-comment-comment-meta">
            <div className="cf-comment-at" >
              Posted: {props.posted}
            </div>
          </div>
          <div className="cf-comment-text" >
            {props.reply}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reply;
