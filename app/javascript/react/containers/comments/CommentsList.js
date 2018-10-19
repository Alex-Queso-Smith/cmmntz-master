import React from 'react';

import { FetchWithPull } from '../../util/CoreUtil';

class CommentsList extends React.Component {
  state = {}

  render(){
    var commentsArray;
    var { allComments } = this.props

    if (allComments) {
      commentsArray = allComments.map((comment) => {
        var { user_name, gender, age_range } = comment.user
        var { text, created_at } = comment
        var userInfo;

        if (user_name == '') {
          userInfo = "Anonymous"
        } else {
          userInfo = `${comment.user.user_name} - ${comment.user.gender} - ${comment.user.age_range}`
        }
        return(
          <div className="cf-comment-div" key={text}>
            <div className="cf-comment-user" >
              {userInfo}
            </div>
            <div className="cf-comment-at" >
              {created_at}
            </div>
            <div className="cf-comment-text" >
              {text}
            </div>
            <hr />
          </div>
        )
      })
    }

    return(
      <div>
        {commentsArray}
      </div>
    )
  }
}

export default CommentsList;
