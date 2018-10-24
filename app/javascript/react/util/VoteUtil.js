export const VoteClick = (object, event) => {

  const target = event.target;
  const name = target.name;
  const bigFive = ['like', 'dislike', 'indifferent', 'like_a_lot', 'dislike_a_lot']

  var selectedVotes = object.state.selectedVotes;

  if (bigFive.includes(name)) {
    if (object.state.selectedBigFive === '') { // if there is no selected big five

      object.setState({ selectedBigFive: name })

      var newVote = new FormData();
      var commentRoot = object.props.commentRoot;

      newVote.append("vote[comment_id]", object.props.commentId)
      newVote.append("vote[user_id]", commentRoot.getAttribute('data-user-id'))
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
      newVote.append("vote[user_id]", commentRoot.getAttribute('data-user-id'))
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

export const ImageSelector = (type, state) => {
  if (type === "blank1" || type === 'blank2') {
    return ''
  } else {
    return `/assets/${type}.${state}.bmp`
  }
}

export default {
  VoteClick,
  ImageSelector
}
