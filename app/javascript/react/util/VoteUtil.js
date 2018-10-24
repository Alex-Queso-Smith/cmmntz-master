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

export const ImageSelected = (type) => {

  var image = '';

  switch (type) {
    case 'like':
      image = '/assets/04.Like.fifty_percent.Selected.1f44d.bmp'
      break;
    case 'like_a_lot':
      image = '/assets/03.LikeALot.forty-seven_percent.Selected.1f44d.bmp'
      break;
    case 'indifferent':
      image = '/assets/05.Indifferent.fifty_percent.Modified.Selected.1f91b.bmp'
      break;
    case 'dislike':
      image = '/assets/06.Dislike.fifty_percent.Selected.1f44e.bmp'
      break;
    case 'dislike_a_lot':
      image = '/assets/07.DislikeALot.fort-seven_percent.Selected.1f44e.bmp'
      break;
    case 'top':
      image = '/assets/02.Top.fifty_percent.Modified.Selected.1f3d4.bmp'
      break;
    case 'love':
      image = '/assets/04.Like.fifty_percent.Selected.1f44d.bmp'
      break;
    case 'trash':
      image = '/assets/08.Trash.fifty_percent.Selected.1f5d1.bmp'
      break;
    case 'warn':
      image = '/assets/09.Warn.fifty_percent.Selected.1f6a9.bmp'
      break;
    case 'smart':
      image = '/assets/10.Smart.Fifty_Percent.Selected.1f914.bmp'
      break;
    case 'funny':
      image = '/assets/11.Funny.fifty_percent.Selected.1f602.bmp'
      break;
    case 'happy':
      image = '/assets/12.Happy.fifty_percent.Selected.1f642.bmp'
      break;
    case 'shocked':
      image = '/assets/13.Shocked.fifty_percent.Selected.1f62f.bmp'
      break;
    case 'sad':
      image = '/assets/14.Sad.fifty_percent.Selected.2639.bmp'
      break;
    case 'boring':
      image = '/assets/15.Boring.fifty_percent.Selected.1f634.bmp'
      break;
    case 'angry':
      image = '/assets/16.Angry.fifty_percent.Selected.1f620.bmp'
      break;
    default:
      image = ''
  }
  return image
}

export const ImageDeselected = (type) => {

  var image = '';

  switch (type) {
    case 'like':
      image = '/assets/04.Like.fifty_percent.Unselected.1f44d.bmp'
      break;
    case 'like_a_lot':
      image = '/assets/03.LikeALot.forty-seven_percent.Unselected.1f44d.bmp'
      break;
    case 'indifferent':
      image = '/assets/05.Indifferent.fifty_percent.Modified.Unselected.1f91b.bmp'
      break;
    case 'dislike':
      image = '/assets/06.Dislike.fifty_percent.Unselected.1f44e.bmp'
      break;
    case 'dislike_a_lot':
      image = '/assets/07.DislikeALot.fort-seven_percent.Unselected.1f44e.bmp'
      break;
    case 'top':
      image = '/assets/02.Top.fifty_percent.Modified.Unselected.1f3d4.bmp'
      break;
    case 'love':
      image = '/assets/04.Like.fifty_percent.Unselected.1f44d.bmp'
      break;
    case 'trash':
      image = '/assets/08.Trash.fifty_percent.Unselected.1f5d1.bmp'
      break;
    case 'warn':
      image = '/assets/09.Warn.fifty_percent.Unselected.1f6a9.bmp'
      break;
    case 'smart':
      image = '/assets/10.Smart.Fifty_Percent.Unselected.1f914.bmp'
      break;
    case 'funny':
      image = '/assets/11.Funny.fifty_percent.Unselected.1f602.bmp'
      break;
    case 'happy':
      image = '/assets/12.Happy.fifty_percent.Unselected.1f642.bmp'
      break;
    case 'shocked':
      image = '/assets/13.Shocked.fifty_percent.Unselected.1f62f.bmp'
      break;
    case 'sad':
      image = '/assets/14.Sad.fifty_percent.Unselected.2639.bmp'
      break;
    case 'boring':
      image = '/assets/15.Boring.fifty_percent.Unselected.1f634.bmp'
      break;
    case 'angry':
      image = '/assets/16.Angry.fifty_percent.Unselected.1f620.bmp'
      break;
    default:
      image = ''
  }
  return image
}

export default {
  VoteClick,
  ImageSelected,
  ImageDeselected
}
