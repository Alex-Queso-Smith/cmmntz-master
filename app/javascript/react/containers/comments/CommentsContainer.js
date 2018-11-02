import React from 'react';

import CommentsFormContainer from './CommentsFormContainer';
import CommentsList from './CommentsList';
import CommentFilters from './CommentFilters';
import { FetchDidMount, SetStateWithValidation, FetchWithUpdate, FetchBasic, FetchIndividual } from '../../util/CoreUtil';
import BasicModal from '../../components/general/BasicModal'

class CommentsContainer extends React.Component {
  state = {
    userSettings: {
      font: 'serif',
      colorTheme: 'light'
    },
    totalComments: 0,
    comments: [],
    userId: '',
    artId: '',
    artType: '',
    commentFormErrors: {},
    sortOpts: {
      sortDir: 'desc',
      sortType: 'created_at',
      filterList: [],
      page: 1
    }
  }

  handleFormSubmit = this.handleFormSubmit.bind(this);
  commentFormSubmitter = this.commentFormSubmitter.bind(this);
  handleFilterSubmit = this.handleFilterSubmit.bind(this);
  handleTopChange = this.handleTopChange.bind(this);
  handleLoadMoreClick = this.handleLoadMoreClick.bind(this);

  handleChange = this.handleChange.bind(this);
  handleFilterSubmitMan = this.handleFilterSubmitMan.bind(this);
  handleSortDirClick = this.handleSortDirClick.bind(this);
  handleFilterClick = this.handleFilterClick.bind(this);
  submitterMan = this.submitterMan.bind(this);

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
          userSettings: oldUserSettings
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

  // repetetive with handleFilterSubmit
  handleFormSubmit(event, text, anonymous, formInvalid, selfVotes = [], handleClear){
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

  // repetetive with handleFormSubmit
  handleFilterSubmit(){
    var search = new FormData();
    var commentRoot = this.props.commentRoot
    var {sortDir, page, sortType, filterList } = this.state.sortOpts;
    search.append("art_type", commentRoot.getAttribute('data-art-type'))
    search.append("art_id", commentRoot.getAttribute('data-art-id'))
    search.append("page", page);
    search.append("search[sort_dir]", sortDir);
    search.append("search[sort_type]", sortType);
    search.append("search[filter_list]", filterList.join());

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

  handleChange(event){
    event.preventDefault();
    const target = event.target;

    var value;
    if (target.type === "checkbox") {
      value = target.checked
    } else if (target.getAttribute('data-value')) {
      value = target.getAttribute('data-value')
    } else {
      value = target.value
    };

    const name = target.name;
    var opts = this.state.sortOpts
    opts[name] = value
    opts.page = 1

    this.setState({
      sortOpts: opts
    })
  };

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

  handleFilterClick(event){
    event.preventDefault();
    const target = event.target;
    const name = target.getAttribute('data-value');

    var updatedFilters = this.state.sortOpts.filterList

    if (updatedFilters.includes(name)){
      updatedFilters = updatedFilters.filter(v => v != name)
    } else {
      updatedFilters.push(name)
    }
    var opts = this.state.sortOpts
    opts.filterList = updatedFilters
    opts.page = 1

    this.setState({
      sortOpts: opts
    })
    this.submitterMan(event)
  }

  render(){

    var { commentRoot } = this.props;
    var { totalComments, comments, commentFormErrors, userSettings} = this.state;

    return(
      <div className={`cf-comments-main ${userSettings.font} ${userSettings.colorTheme}`}>
        <BasicModal
          modalButtonText="Commenting Etiquette"
          modalTitle="Commenting Etiquette"
        >
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec luctus odio nec magna consequat, et cursus turpis placerat. Sed at tristique nisl, in pharetra urna. Vestibulum nec tortor eget velit eleifend ullamcorper eget at purus. Fusce consequat magna tellus, vitae laoreet tortor aliquam quis. Pellentesque finibus diam lacinia, euismod libero vitae, faucibus risus. Etiam a nunc sed quam semper eleifend vitae et ex. Cras volutpat, lectus et porta elementum, nibh nisl condimentum augue, nec tempus lectus lectus nec ligula. Pellentesque sed commodo eros, vel feugiat magna. Nam eleifend pellentesque pretium. Nam lacus sapien, bibendum sit amet diam volutpat, ornare feugiat arcu. Proin tempus aliquet enim, quis pellentesque tortor hendrerit a. Nunc vel metus pulvinar, ultrices sapien ut, sagittis sem. Pellentesque luctus consectetur suscipit. Curabitur luctus condimentum scelerisque. Integer vitae imperdiet nulla, sed placerat tellus.</p>

        <p>Fusce non ante nec mi sagittis pellentesque. Quisque nulla elit, auctor quis augue sed, porttitor scelerisque nulla. Nullam sit amet placerat lacus. Donec massa lacus, maximus ut pretium cursus, efficitur in eros. Aenean urna ex, ornare sit amet quam quis, efficitur congue risus. Nunc faucibus eget nibh nec scelerisque. Phasellus commodo congue augue, eget ultricies enim. Suspendisse vehicula nunc consequat risus tempus, nec consequat nulla interdum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent mattis ante finibus, cursus leo tempor, maximus turpis. Phasellus lectus leo, auctor quis mauris a, rutrum dictum urna. Vestibulum eu molestie elit. Phasellus convallis porta diam, in fermentum orci. Ut quis eleifend nulla, eu lacinia ex. Quisque tempus tellus vel ipsum feugiat, ut euismod nunc consectetur. Fusce dictum dignissim ultrices.</p>

        <p>Donec consectetur, nisi eu placerat vestibulum, nunc nulla vestibulum neque, eget rutrum velit eros blandit eros. Duis aliquet massa et maximus rhoncus. Nunc in justo ligula. Fusce sed arcu blandit, consequat tellus vel, aliquet ex. Fusce ac varius libero. In ac scelerisque odio, nec euismod tellus. Maecenas laoreet odio lectus, ut tempor nulla tristique non. Sed commodo, odio at congue tempus, sem nulla volutpat nibh, a fringilla dolor arcu ac turpis. Nam egestas egestas metus dapibus fermentum. Aenean vestibulum lacus eu faucibus eleifend. Nunc eu arcu auctor, luctus lacus a, lobortis erat. Morbi vel venenatis leo. Suspendisse fermentum condimentum dolor in accumsan. Praesent tincidunt varius lacinia. Vivamus egestas tellus et eleifend viverra.</p>

        <p>Cras hendrerit elementum ipsum in faucibus. Cras porta pharetra urna sit amet pretium. Etiam convallis suscipit velit nec mattis. Donec commodo placerat libero, eu vulputate nibh semper vel. Etiam porta, nunc cursus tempor interdum, sapien magna dapibus augue, sed ultrices magna enim quis libero. Donec et egestas magna. In semper sem est, id congue enim lacinia at. Nullam posuere est sed accumsan viverra. Donec in elit sed mi vestibulum vulputate. In at libero sed elit finibus ultrices ut nec leo. In vestibulum hendrerit lectus, ac vestibulum nisl posuere non. Proin quis ligula dui.</p>

        <p>Pellentesque lacinia neque ut tincidunt scelerisque. Praesent commodo lectus risus, sed blandit nibh lacinia ut. In fermentum hendrerit velit quis condimentum. Sed rutrum volutpat urna, vel ornare elit finibus nec. Nam mattis imperdiet velit, et pulvinar ante convallis ut. Sed at dolor pulvinar lorem ullamcorper venenatis. Donec maximus auctor nulla et blandit. Etiam tincidunt lacus eget porta interdum. Curabitur ut rhoncus magna. Vivamus placerat ornare lacinia. Nulla viverra mauris vel nisl molestie faucibus. Quisque imperdiet ipsum in neque aliquet faucibus fermentum in enim.</p>
      </BasicModal>
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
          sortOpts={this.state.sortOpts}
          handleFilterSubmit={this.handleFilterSubmitMan}
          handleSortDirClick={this.handleSortDirClick}
          handleFilterClick={this.handleFilterClick}

        />
        <hr />
        <CommentsList
          allComments={comments}
          commentRoot={commentRoot}
          handleDelayClick={this.handleDelayClick}
          handleTopChange={this.handleTopChange}
        />

      <button className="btn btn-block btn-large btn-primary" onClick={this.handleLoadMoreClick}>Load More</button>
      </div>
    )
  }
}

export default CommentsContainer;
