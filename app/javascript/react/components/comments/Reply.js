import React from 'react';

const Reply = props => {
  var userInfo;

  if (props.user.user_name == '') {
    userInfo = "Anonymous"
  } else {
    userInfo = `${props.user.user_name} - ${props.user.gender} - ${props.user.age_range}`
  }

  return(
    <div className="cf-comment-reply margin-top-10px">
      <div>
        User: {userInfo}
      </div>
      <div>
        Posted: {props.posted}
      </div>
      <div>
        {props.reply}
      </div>
    </div>
  )
}

export default Reply;
