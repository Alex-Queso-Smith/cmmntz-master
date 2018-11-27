import React from 'react';

import VoteButtonRowOne from '../components/voting/VoteButtonRowOne';
import VoteButtonRowTwo from '../components/voting/VoteButtonRowTwo';

export const VoteClick = (object, event) => {

  const target = event.target;
  const name = target.name;
  const bigFive = ['like', 'dislike', 'indifferent', 'like_a_lot', 'dislike_a_lot']

  var selectedVotes = object.state.selectedVotes;

  if (name === "warn" && !selectedVotes.warn) {
    object.handleShowFlagModal()
  }

  if (bigFive.includes(name)) {
    if (object.state.selectedBigFive === '') { // if there is no selected big five

      object.setState({ selectedBigFive: name })

      var newVote = new FormData();
      var commentRoot = object.props.commentRoot;

      newVote.append("vote[comment_id]", object.props.commentId)
      newVote.append("vote[user_id]", object.props.currentUserId)
      newVote.append("vote[vote_type]", name)

      object.handlePost(newVote)

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
      var updateVotes = object.state.selectedVotes
      updateVotes[object.state.selectedBigFive] = null

      object.setState({
        selectedVotes: updateVotes,
        selectedBigFive: ''
      })

      object.handleDestroy(voteId)
    }
  } else {
    if (!object.state.selectedVotes[name]) { // user clicks on non big five and is previously unselected

      var newVote = new FormData();
      var commentRoot = object.props.commentRoot;

      newVote.append("vote[comment_id]", object.props.commentId)
      newVote.append("vote[user_id]", object.props.currentUserId)
      newVote.append("vote[vote_type]", name)

      object.handlePost(newVote)

    } else { // user clicks on non big five and is previously selected

      var voteId = object.state.selectedVotes[name]
      var updateVotes = object.state.selectedVotes
      updateVotes[name] = null

      object.setState({ selectedVotes: updateVotes })
      object.handleDestroy(voteId)
    }
  }
}

export const ImageSelector = (type) => {
  
  if (type.includes('blank')) {
    return ''
  } else {
    return `/assets/${type}.png`
  }
}

export const AlwaysVisible = [
  "like",
  "indifferent",
  "dislike"
]

export const RowOneVoteTypes = [
  ["blank1", "blank1"],
  ["blank2", "blank2"],
  ["top", "Top"],
  ["love", "Love"],
  ["like_a_lot", "Like A Lot"],
  ["like", "Like"],
  ["indifferent", "Indifferent"],
  ["dislike", "Dislike"],
  ["dislike_a_lot", "Dislike A Lot"],
  ["trash", "Trash"],
  ["warn", "Warn"],
  ["blank3", "blank3"]
]

export const RowTwoVoteTypes = [
  ["blank1", "blank1"],
  ["blank2", "blank2"],
  ["blank3", "blank3"],
  ["smart", "Smart"],
  ["funny", "Funny"],
  ["happy", "Happy"],
  ["shocked", "Shocked"],
  ["sad", "Sad"],
  ["boring", "Boring"],
  ["angry", "Angry"],
  ["blank4", "blank4"]
]

const OpacityHandler = (selectedVotes, type) => {
  if(selectedVotes[type]){
    return ""
  } else {
    return "translucent"
  }
}

export const RowOneVoteButtons = (object) => {
  return RowOneVoteTypes.map((type) => {
    var visibility, image, percentage, blankClass;
    var { userVoted, percentShow, votePercents, selectedVotes } = object.state
    var opacity = OpacityHandler(selectedVotes, type[0]);

    if (
      userVoted &&
      !type[0].includes('blank') &&
      percentShow
    ) {
      percentage = `${votePercents[type[0]]}%`
    }

    if ( !userVoted || type[0].includes('blank') ) {
      if (!AlwaysVisible.includes(type[0])) {
        visibility = 'visibility-hidden'
      }
    }

    if (!type[0].includes('blank')) {
      image = ImageSelector(type[0])
    } else {
      blankClass = type[0]
    }


    return(
      <VoteButtonRowOne
        key={`${object.props.commentId}_${type[0]}`}
        className={`margin-top-bottom-10px ${blankClass}`}
        name={type[0]}
        label={type[1]}
        onClick={object.handleClickVote}
        visibility={visibility}
        opacity={opacity}
        percentage={percentage}
        image={image}
        />
    )
  })
}

export const RowTwoVoteButtons = (object) => {
  return RowTwoVoteTypes.map((type) => {
    var visibility, image, percentage, blankClass;
    var { userVoted, percentShow, votePercents, selectedVotes } = object.state
    var opacity = OpacityHandler(selectedVotes, type[0])

    if ( // show percentage if user has voted and div is not blank
      userVoted &&
      !type[0].includes('blank') &&
      percentShow
    ) {
      percentage = `${votePercents[type[0]]}%`
    }

    if ( !userVoted || type[0].includes('blank') ) {
      visibility = 'visibility-hidden'
    }

    // select image for button based on type
    if (!type[0].includes('blank')) {
      image = ImageSelector(type[0])
    } else {
      blankClass = type[0]
    }

    return(
      <VoteButtonRowTwo
        key={`${object.props.commentId}_${type[0]}`}
        className={`margin-top-bottom-10px ${blankClass}`}
        name={type[0]}
        label={type[1]}
        onClick={object.handleClickVote}
        visibility={visibility}
        opacity={opacity}
        percentage={percentage}
        image={image}
        />
    )
  })
}
