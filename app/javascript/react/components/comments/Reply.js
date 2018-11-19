import React from 'react';

import UserInfoTile from './UserInfoTile';
import { FetchWithUpdate } from '../../util/CoreUtil';
import VotingContainerBase from '../voting/VotingContainerBase';

class Reply extends React.Component {
  state = {
    userTileHover: false,
    userFollowed: this.props.userFollowed,
    userBlocked: this.props.userBlocked
  }

  onUserHover = this.onUserHover.bind(this);
  handleFollow = this.handleFollow.bind(this);
  handleBlock = this.handleBlock.bind(this);

  onUserHover(){
    this.setState({ userTileHover: !this.state.userTileHover })
  }

  handleFollow(event){
    event.preventDefault();

    var path;
    var newFollow = new FormData();
    newFollow.append("following[following_id]", this.props.user.user_id)
    newFollow.append("following[follower_id]", this.props.currentUserId)

    if (this.state.userFollowed) {
      path = `/api/v1/unfollowings.json`
    } else {
      path = `/api/v1/followings.json`
    }
    FetchWithUpdate(this, path, 'POST', newFollow)
    .then(body => {
      this.setState({ userFollowed: !this.state.userFollowed })
    })
  }

  handleBlock(event){
    event.preventDefault();

    var path;
    var newBlock = new FormData();
    newBlock.append("blocking[blocking_id]", this.props.replyUserId)
    newBlock.append("blocking[blocker_id]", this.props.currentUserId)

    if (this.state.userBlocked) {
      path = `/api/v1/unblockings.json`
    } else {
      path = `/api/v1/blockings.json`
    }
    FetchWithUpdate(this, path, 'POST', newBlock)
    .then(body => {
      this.setState({ userBlocked: !this.state.userBlocked })
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  render(){
    var { currentUserId, user } = this.props;
    var { user_name, gender, age_range } = this.props.user;
    var userInfo, starOpacity, followStar, blockSym, blockOpacity;

    if (user_name == '') {
      userInfo = "Anonymous"
    } else {
      userInfo = `${user_name} - ${gender} - ${age_range}`
    }

    if (user.user_id != currentUserId && user_name != "Anonymous") {
      if (!this.state.userFollowed) {
        starOpacity = "translucent"
      }
      if (!this.state.userBlocked) {
        blockOpacity = "translucent"
      }
      followStar =
      <div className={`col-1 col-sm-1 col-md-1 cursor-pointer ${starOpacity}`}>
        <img onClick={this.handleFollow} src="/assets/star" height="20px" width="20px" />
      </div>
      blockSym =
      <div className={`col-1 col-sm-1 col-md-1 cursor-pointer ${blockOpacity}`}>
        <img onClick={this.handleBlock} src="/assets/block" height="20px" width="20px" />
      </div>
    } else {
      blockSym =
      <div className={`col-1 col-sm-1 col-md-1`}>
      </div>
      followStar =
      <div className={`cf-comment-user-name col-1 col-sm-1 col-md-1`}>
      </div>
    }

    return(
      <div className="cf-comment cf-comment-reply margin-top-10px">
        <div className="cf-comment-wrapper">
          <UserInfoTile
            userTileHover={this.state.userTileHover}
            userInfo={this.props.user}
            onMouseEnter={this.onUserHover}
            onMouseLeave={this.onUserHover}
            userName={user_name}
            />
          <div className="cf-comment-w-meta">
            <div className="cf-comment-comment-meta row">
              {followStar}
              {blockSym}
              <div className="cf-comment-user-name col-4 col-sm-4 col-md-4">
                {user_name}
              </div>
              <div className="col-3 col-md-3"></div>
              <div className="cf-comment-at col-2" >
                <div className="float-right">
                  {this.props.posted}
                </div>
              </div>
            </div>
            <div className="cf-comment-text" >
              {this.props.reply}
            </div>
          </div>
        </div>
        <VotingContainerBase
          commentId={this.props.replyId}
          currentUserId={this.props.currentUserId}
          commentVotes={this.props.commentVotes}
          votePercents={this.props.votePercents}
          handleTopChange={this.props.handleTopChange}
          userVoted={this.props.userVoted}
        />
      </div>
    )
  }
}

export default Reply;
