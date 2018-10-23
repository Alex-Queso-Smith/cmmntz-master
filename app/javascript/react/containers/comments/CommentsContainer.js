import React from 'react';

import CommentsFormContainer from './CommentsFormContainer';
import CommentsList from './CommentsList';
import { FetchWithPull, SetStateWithValidation, FetchWithUpdate } from '../../util/CoreUtil';

class CommentsContainer extends React.Component {
  state = {
    comments: [],
    userId: '',
    artId: '',
    artType: '',
    text: '',
    anonymous: false,
    formInvalid: true,
    commentFormErrors: {}
  }

  handleChange = this.handleChange.bind(this);
  handleSubmit = this.handleSubmit.bind(this);
  handleClear = this.handleClear.bind(this);

  componentDidMount(){
    var commentRoot = this.props.commentRoot
    var artType = commentRoot.getAttribute('data-art-type')
    var artId = commentRoot.getAttribute('data-art-id')

    FetchWithPull(this, `/api/v1/comments.json?art_type=${artType}&art_id=${artId}`)
    .then(body => {
     this.setState({ comments: body.comments })
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  handleChange(event){
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (this.state.text.length != 0) {
      SetStateWithValidation(this, false, name, value)
    } else {
      SetStateWithValidation(this, true, name, value)
    }
  }

  handleSubmit(event){
    event.preventDefault();
    if (!this.state.formInvalid) {
      var newComment = new FormData();
      var commentRoot = this.props.commentRoot
      newComment.append("comment[user_id]", commentRoot.getAttribute('data-user-id'))
      newComment.append("comment[art_type]", commentRoot.getAttribute('data-art-type'))
      newComment.append("comment[art_id]", commentRoot.getAttribute('data-art-id'))
      newComment.append("comment[text]", this.state.text)
      newComment.append("comment[anonymous]", this.state.anonymous)

      var commentRoot = this.props.commentRoot
      var artType = commentRoot.getAttribute('data-art-type')
      var artId = commentRoot.getAttribute('data-art-id')

      FetchWithUpdate(this, `/api/v1/comments.json?art_type=${artType}&art_id=${artId}`, 'POST', 'commentFormErrors', newComment )
      .then(body => {
        if (body.errors) {
          this.setState({ [errors]: body.errors})
        } else {
          this.setState({ comments: body.comments })
        }
      })
      .catch(error => console.error(`Error in fetch: ${error.message}`));

      if (Object.keys(this.state.commentFormErrors).length === 0) {
        this.handleClear();
      }
    }
  }

  handleClear(){
    this.setState({
      text: '',
      anonymous: false,
      formInvalid: true
    })
  }

  render(){
    
    var { commentRoot } = this.props;
    var { comments, text, commentFormErrors } = this.state;

    return(
      <div>
        <CommentsFormContainer
          commentRoot={commentRoot}
          onChange={this.handleChange}
          handleSubmit={this.handleSubmit}
          text={text}
          commentFormErrors={commentFormErrors}
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
