import React from 'react';
import BottomScollListener from 'react-bottom-scroll-listener'

import CommentFormContainer from './CommentFormContainer';
import CommentsList from './CommentsList';
import CommentFilters from './CommentFilters';
import { FetchDidMount, FetchWithUpdate, FetchBasic, FetchIndividual } from '../../util/CoreUtil';
import CommentEtiquette from '../../components/modals/CommentEtiquette'

class CommentingContainer extends React.Component {
  state = {
    userSettings: {
      font: 'serif',
      colorTheme: 'light'
    },
    totalComments: 0,
    followedUsers: [],
    blockedUsers: [],
    comments: [],
    userId: '',
    artId: '',
    artType: '',
    commentFormErrors: {},
    sortOpts: {
      sortDir: 'desc',
      sortType: 'created_at',
      notFilterList: [],
      filterList: [],
      page: 1,
      commentsFrom: "",
      votesFrom: ""
    }
  }

  handleCommentForm = this.handleCommentForm.bind(this);
  commentFormSubmitter = this.commentFormSubmitter.bind(this);
  handleFilterSubmit = this.handleFilterSubmit.bind(this);
  handleTopChange = this.handleTopChange.bind(this);
  handleLoadMoreClick = this.handleLoadMoreClick.bind(this);
  handleFilterByClick = this.handleFilterByClick.bind(this);

  handleChange = this.handleChange.bind(this);
  handleFilterSubmitMan = this.handleFilterSubmitMan.bind(this);
  handleSortDirClick = this.handleSortDirClick.bind(this);
  handleFilterClick = this.handleFilterClick.bind(this);
  submitterMan = this.submitterMan.bind(this);

  componentWillMount(){
    var commentRoot = this.props.commentRoot
    var userId = commentRoot.getAttribute('data-user-id')
    if (userId.length > 0){
      FetchDidMount(this, `/api/v1/users/${userId}.json`)
      .then(body => {

        var oldUserSettings = this.state.userSettings
        oldUserSettings.font = body.user.font;
        oldUserSettings.colorTheme = body.user.color_theme
        this.setState({
          userSettings: oldUserSettings,
          followedUsers: body.user.followed_users,
          blockedUsers: body.user.blocked_users
        })
      })
      .catch(error => console.error(`Error in fetch: ${error.message}`));
    }
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

  handleChange(event){
    event.preventDefault();
    const target = event.target;
    const name = target.name;

    var value;
    if (target.type === "checkbox") {
      value = target.checked
    } else if (target.getAttribute('data-value')) {
      value = target.getAttribute('data-value')
    } else {
      value = target.value
    };

    var opts = this.state.sortOpts
    opts[name] = value
    opts.page = 1

    this.setState({ sortOpts: opts })
  };

  // repetetive with handleFilterSubmit
  handleCommentForm(event, text, anonymous, formInvalid, selfVotes = [], handleClear){
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

      this.commentFormSubmitter(newComment, handleClear)
    }
  }

  commentFormSubmitter(newComment, handleClear) {
    var commentRoot = this.props.commentRoot
    var artType = commentRoot.getAttribute('data-art-type')
    var artId = commentRoot.getAttribute('data-art-id')

    FetchWithUpdate(this, `/api/v1/comments.json?art_type=${artType}&art_id=${artId}`, 'POST', newComment )
    .then(body => {
      if (body.errors) {
        var voteErrors = body.errors["votes.base"]
        if (voteErrors){
          var message = voteErrors[1]
          var r = confirm(message);

          if (r == true) {
            var old_top_id = voteErrors[3]
            newComment.append("comment[force]", "true")
            newComment.append("comment[old_top_id]", old_top_id )

            this.commentFormSubmitter(newComment, handleClear)
          }
        }
        this.setState({ commentFormErrors: body.errors})
      } else {
        var append = this.state.sortOpts.page > 1
        var newComments;
        if (append) {
          newComments = this.state.comments.concat(body.comments)
        } else {
          newComments = body.comments
        }

        this.setState({
          comments: newComments,
          totalComments: body.total_comments
        })

        if (body.old_top_id){
          this.handleTopChange(body.old_top_id)
        }
        handleClear()
      }
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  // repetetive with handleCommentForm
  handleFilterSubmit(){
    var search = new FormData();
    var commentRoot = this.props.commentRoot
    var {sortDir, page, sortType, filterList, notFilterList, commentsFrom, votesFrom } = this.state.sortOpts;
    search.append("art_type", commentRoot.getAttribute('data-art-type'))
    search.append("art_id", commentRoot.getAttribute('data-art-id'))
    search.append("page", page);
    search.append("search[sort_dir]", sortDir);
    search.append("search[sort_type]", sortType);
    search.append("search[filter_list]", filterList.join());
    search.append("search[not_filter_list]", notFilterList.join());
    if (commentsFrom) {
      search.append("search[comments_from]", commentsFrom)
    }
    if (votesFrom) {
      search.append("search[votes_from]", votesFrom)
    }

    FetchBasic(this, '/api/v1/comment_filters.json', search, 'POST')
    .then(body => {
      var append = this.state.sortOpts.page > 1
      var newComments;
      if (append) {
        newComments = this.state.comments.concat(body.comments)
      } else {
        newComments = body.comments
      }
      this.setState({
        comments: newComments,
        totalComments: body.total_comments
      })
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  handleFilterSubmitMan(event){
    this.handleChange(event)
    this.submitterMan(event)
  }

  handleSortDirClick(event){
    event.preventDefault();
    var value = (this.state.sortOpts.sortDir == "asc") ? "desc" : "asc"

    var opts = this.state.sortOpts
    opts.sortDir = value
    opts.page = 1

    this.setState({
      sortOpts: opts
    })

    this.submitterMan(event)
  }

  submitterMan(event){
    setTimeout(function() { //Start the timer
      this.handleFilterSubmit();
    }.bind(this), 1)
  }

  handleFilterByClick(event){
    const target = event.target;
    const name = target.name;
    const value = target.value;

    var opts = this.state.sortOpts
    opts[name] = value;
    opts.page = 1

    this.setState({
      sortOpts: opts
    })

    this.submitterMan(event);
  }

  handleFilterClick(event){
    event.preventDefault();
    const target = event.target;
    const name = target.getAttribute('data-value');
    var opts = this.state.sortOpts

    if (opts.filterList.includes(name)){
      var newFilters = opts.filterList.filter(v => v != name)
      opts.filterList = newFilters
      opts.notFilterList.push(name)
    } else if (opts.notFilterList.includes(name)) {
      var newFilters = opts.notFilterList.filter(v => v != name)
      opts.notFilterList = newFilters
    } else {
      opts.filterList.push(name)
    }

    opts.page = 1

    this.setState({
      sortOpts: opts
    })

    this.submitterMan(event)
  }

  handleLoadMoreClick(event){
    var opts = this.state.sortOpts
    opts.page += 1

    this.setState({
      sortOpts: opts
    })

    setTimeout(function() { //Start the timer
      this.handleFilterSubmit();
    }.bind(this), 1)
  }

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

          this.setState({ comments: updatedComments });
        })

      }
    }.bind(this), 50)
  }

  render(){

    var { commentRoot } = this.props;
    var { totalComments, comments, commentFormErrors, userSettings, sortOpts, followedUsers, blockedUsers} = this.state;

    return(
      <div id="cf-comments-main" className={`${userSettings.font} ${userSettings.colorTheme}`}>
        <CommentEtiquette />
        <div>
          {totalComments} comments for this article
        </div>
        <CommentFormContainer
          commentRoot={commentRoot}
          handleSubmit={this.handleCommentForm}
          commentFormErrors={commentFormErrors}
        />
        <hr />
        <CommentFilters
          sortOpts={this.state.sortOpts}
          handleFilterSubmit={this.handleFilterSubmitMan}
          handleSortDirClick={this.handleSortDirClick}
          handleFilterClick={this.handleFilterClick}
          handleFilterByClick={this.handleFilterByClick}
        />
        <hr />
        <CommentsList
          allComments={comments}
          commentRoot={commentRoot}
          handleTopChange={this.handleTopChange}
          followedUsers={followedUsers}
          blockedUsers={blockedUsers}
        />

        <button className="btn btn-block btn-large btn-primary" onClick={this.handleLoadMoreClick}>Load More</button>
        <BottomScollListener
          onBottom={this.handleLoadMoreClick}
          offset={500}
        />
      </div>
    )
  }
}

export default CommentingContainer;
