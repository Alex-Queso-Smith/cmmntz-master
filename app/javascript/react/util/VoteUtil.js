import React from 'react';

import VoteButtonRowOne from '../components/voting/VoteButtonRowOne';
import VoteButtonRowTwo from '../components/voting/VoteButtonRowTwo';

export const bigFive = ['like', 'dislike', 'indifferent', 'like_a_lot', 'dislike_a_lot']

export const VoteClick = (object, event) => {

  const target = event.target;
  const name = target.name;

  var selectedVotes = object.state.selectedVotes;

  if (bigFive.includes(name)) {
    if (object.state.selectedBigFive === '') { // if there is no selected big five

      var newVote = new FormData();

      newVote.append("vote[comment_id]", object.props.commentId)
      newVote.append("vote[user_id]", object.props.currentUserId)
      newVote.append("vote[vote_type]", name)

      object.handlePost(newVote, name)

    } else if (object.state.selectedBigFive != name) { // if there is a different selected big five

      var vote = new FormData();
      vote.append("vote[vote_type]", name)

      var voteId = object.state.selectedVotes[object.state.selectedBigFive]
      var updateVotes = object.state.selectedVotes
      updateVotes[object.state.selectedBigFive] = null
      updateVotes[name] = voteId

      object.setState({
        selectedVotes: updateVotes,
        selectedBigFive: name
      })
      object.handleUpdate(vote, voteId)

    } else { // if user clicks on same big five

      var voteId = object.state.selectedVotes[object.state.selectedBigFive]

      object.handleDestroy(voteId, name)
    }
  } else {
    if (!object.state.selectedVotes[name]) { // user clicks on non big five and is previously unselected

      var newVote = new FormData();

      newVote.append("vote[comment_id]", object.props.commentId)
      newVote.append("vote[user_id]", object.props.currentUserId)
      newVote.append("vote[vote_type]", name)

      object.handlePost(newVote, name)

    } else { // user clicks on non big five and is previously selected

      var voteId = object.state.selectedVotes[name]

      object.handleDestroy(voteId, name)
    }
  }
}

export const ImageSelector = (type, baseUrl) => {

  if (type.includes('blank')) {
    return ''
  } else {
    return `${baseUrl}/images/icons-v2/${type}.png`
  }
}

export const AlwaysVisible = [
  "like",
  "indifferent",
  "dislike"
]

export const RowOneVoteTypes = [
  ["top", "Top"],
  ["love", "Love"],
  ["like_a_lot", "Like A Lot"],
  ["like", "Like"],
  ["indifferent", "Indifferent"],
  ["dislike", "Dislike"],
  ["dislike_a_lot", "Dislike A Lot"],
  ["trash", "Trash"],
  ["warn", "Warn"]
]

export const RowTwoVoteTypes = [
  ["smart", "Smart"],
  ["funny", "Funny"],
  ["happy", "Happy"],
  ["shocked", "Shocked"],
  ["sad", "Sad"],
  ["boring", "Boring"],
  ["angry", "Angry"]
]

const OpacityHandler = (selectedVotes, type) => {
  if(selectedVotes[type]){
    return ""
  } else {
    return "cf-translucent"
  }
}

export const RowOneVoteButtons = (object) => {
  return RowOneVoteTypes.map((type) => {
    var visibility, percentage, blankClass, voteFraction;
    var { userVoted, percentShow, votePercents, selectedVotes, voteCounts, totalInteractions } = object.state
    var opacity = OpacityHandler(selectedVotes, type[0]);

    if ( userVoted && percentShow ) {
      voteFraction = `${voteCounts[type[0]]}/${totalInteractions}`
      percentage = `${votePercents[type[0]]}%`
    }

    if ( !userVoted ) {
      if (!AlwaysVisible.includes(type[0])) {
        visibility = 'cf-visibility-hidden'
      }
    }

    var image = ImageSelector(type[0], object.props.globalSettings.baseUrl)
    var clickFunction = object.handleClickVote;

    if (type[0] === "warn") {
      clickFunction = object.handleShowFlagModal;
    }

    return(
      <VoteButtonRowOne
        key={`${object.props.commentId}_${type[0]}`}
        className={`cf-margin-top-10px`}
        name={type[0]}
        label={type[1]}
        onClick={clickFunction}
        visibility={visibility}
        opacity={opacity}
        percentage={percentage}
        voteFraction={voteFraction}
        image={image}
        />
    )
  })
}

export const RowTwoVoteButtons = (object) => {
  return RowTwoVoteTypes.map((type) => {
    var visibility, percentage, blankClass, voteFraction;
    var { userVoted, percentShow, votePercents, selectedVotes, voteCounts, totalInteractions } = object.state
    var opacity = OpacityHandler(selectedVotes, type[0])

    if ( userVoted && percentShow ) {
      voteFraction = `${voteCounts[type[0]]}/${totalInteractions}`
      percentage = `${votePercents[type[0]]}%`
    }

    if ( !userVoted ) {
      visibility = 'cf-visibility-hidden'
    }

    var image = ImageSelector(type[0], object.props.globalSettings.baseUrl)

    return(
      <VoteButtonRowTwo
        key={`${object.props.commentId}_${type[0]}`}
        className={`cf-margin-top-10px`}
        name={type[0]}
        label={type[1]}
        onClick={object.handleClickVote}
        visibility={visibility}
        opacity={opacity}
        percentage={percentage}
        voteFraction={voteFraction}
        image={image}
        />
    )
  })
}
