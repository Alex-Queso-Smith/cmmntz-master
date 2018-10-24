import React from 'react';

import CommentsFormContainer from './CommentsFormContainer';
import CommentsList from './CommentsList';
import { FetchWithPull, SetStateWithValidation, FetchWithUpdate } from '../../util/CoreUtil';


class CommentsContainer extends React.Component {
  state = {
    totalComments: 0,
    comments: [],
    userId: '',
    artId: '',
    artType: ''
  }

  handleSubmit = this.handleSubmit.bind(this);

  componentDidMount(){
    var commentRoot = this.props.commentRoot
    var artType = commentRoot.getAttribute('data-art-type')
    var artId = commentRoot.getAttribute('data-art-id')

    FetchWithPull(this, `/api/v1/comments.json?art_type=${artType}&art_id=${artId}`)
    .then(body => {
     this.setState({
       comments: body.comments,
       totalComments: body.total_comments
      })
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  handleSubmit(event, text, anonymous, formInvalid){
    event.preventDefault();
    if (!formInvalid) {
      var newComment = new FormData();
      var commentRoot = this.props.commentRoot
      newComment.append("comment[user_id]", commentRoot.getAttribute('data-user-id'))
      newComment.append("comment[art_type]", commentRoot.getAttribute('data-art-type'))
      newComment.append("comment[art_id]", commentRoot.getAttribute('data-art-id'))
      newComment.append("comment[text]", text)
      newComment.append("comment[anonymous]", anonymous)

      var commentRoot = this.props.commentRoot
      var artType = commentRoot.getAttribute('data-art-type')
      var artId = commentRoot.getAttribute('data-art-id')

      FetchWithUpdate(this, `/api/v1/comments.json?art_type=${artType}&art_id=${artId}`, 'POST', 'commentFormErrors', newComment )
      .then(body => {
        if (body.errors) {
          this.setState({ [errors]: body.errors})
        } else {
          var x = this.state.totalComments + 1
          this.setState({
            comments: body.comments,
            totalComments: x
          })
        }
      })
      .catch(error => console.error(`Error in fetch: ${error.message}`));
    }
  }

  render(){

    var { commentRoot } = this.props;
    var { totalComments, comments } = this.state;

    return(
      <div>
        <div>
          {totalComments} comments for this article
        </div>
        <CommentsFormContainer
          commentRoot={commentRoot}
          handleSubmit={this.handleSubmit}
        />
        <hr />
        <CommentsList
          allComments={comments}
          commentRoot={commentRoot}
        />
      </div>
    )
  }
}

export default CommentsContainer;
