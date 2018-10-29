import React from 'react';

import CommentsFormContainer from './CommentsFormContainer';
import CommentsList from './CommentsList';
import CommentFilters from './CommentFilters';
import { FetchDidMount, SetStateWithValidation, FetchWithUpdate, FetchBasic, FetchIndividual } from '../../util/CoreUtil';

class CommentsContainer extends React.Component {
  state = {
    totalComments: 0,
    comments: [],
    userId: '',
    artId: '',
    artType: '',
    commentFormErrors: []
  }

  handleFormSubmit = this.handleFormSubmit.bind(this);
  handleFilterSubmit = this.handleFilterSubmit.bind(this);
  handleTopChange = this.handleTopChange.bind(this);

  handleTopChange(oldTopCommentId){
    setTimeout(function() { //Start the timer
      if (this.state.comments.find( c => c.id === oldTopCommentId)) {
        // replace comment with updated version
        FetchIndividual(this, `/api/v1/comments/${oldTopCommentId}.json`, "GET")
        .then(body => {
          var updatedComments = this.state.comments
          var comment = updatedComments.find( c => c.id === oldTopCommentId);

          comment.current_users_votes.top = null;
          comment.vote_percents.top = body.comment.vote_percents.top;

          // debugger
          this.setState({ comments: updatedComments });
        })

      }
    }.bind(this), 50)
  }

  componentDidMount(){
    var commentRoot = this.props.commentRoot
    var artType = commentRoot.getAttribute('data-art-type')
    var artId = commentRoot.getAttribute('data-art-id')

    FetchDidMount(this, `/api/v1/comments.json?art_type=${artType}&art_id=${artId}`)
    .then(body => {
     this.setState({
       comments: body.comments,
       totalComments: body.total_comments
      })
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  handleFormSubmit(event, text, anonymous, formInvalid, selfVotes = []){
    event.preventDefault();
    if (!formInvalid) {
      var newComment = new FormData();
      var commentRoot = this.props.commentRoot
      newComment.append("comment[user_id]", commentRoot.getAttribute('data-user-id'))
      newComment.append("comment[art_type]", commentRoot.getAttribute('data-art-type'))
      newComment.append("comment[art_id]", commentRoot.getAttribute('data-art-id'))
      newComment.append("comment[text]", text)
      newComment.append("comment[anonymous]", anonymous)
      newComment.append("comment[vote_types]", selfVotes.join(','))

      var commentRoot = this.props.commentRoot
      var artType = commentRoot.getAttribute('data-art-type')
      var artId = commentRoot.getAttribute('data-art-id')

      FetchWithUpdate(this, `/api/v1/comments.json?art_type=${artType}&art_id=${artId}`, 'POST', newComment )
      .then(body => {
        if (body.errors) {
          this.setState({ commentFormErrors: body.errors})
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

  handleFilterSubmit(event, sortDir, sortType, filterList, page){
    var search = new FormData();
    var commentRoot = this.props.commentRoot
    search.append("art_type", commentRoot.getAttribute('data-art-type'))
    search.append("art_id", commentRoot.getAttribute('data-art-id'))
    search.append("page", page);
    search.append("search[sort_dir]", sortDir);
    search.append("search[sort_type]", sortType);
    search.append("search[filter_list]", filterList.join());

    FetchBasic(this, '/api/v1/comment_filters.json', search, 'POST')
    .then(body => {
      this.setState({
        comments: body.comments,
        totalComments: body.total_comments
      })
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  render(){

    var { commentRoot } = this.props;
    var { totalComments, comments, commentFormErrors} = this.state;

    return(
      <div>
        <div>
          {totalComments} comments for this article
        </div>
        <CommentsFormContainer
          commentRoot={commentRoot}
          handleSubmit={this.handleFormSubmit}
          commentFormErrors={commentFormErrors}
        />
        <hr />
        <CommentFilters
          commentRoot={commentRoot}
          handleSubmit={this.handleFilterSubmit}
        />
        <hr />
        <CommentsList
          allComments={comments}
          commentRoot={commentRoot}
          handleDelayClick={this.handleDelayClick}
          handleTopChange={this.handleTopChange}
        />
      </div>
    )
  }
}

export default CommentsContainer;
