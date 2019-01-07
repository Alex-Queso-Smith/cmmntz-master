import React from 'react';
import BottomScollListener from 'react-bottom-scroll-listener';
import { CircleArrow as ScrollUpButton } from "react-scroll-up-button";

import CommentFormContainer from './CommentFormContainer';
import CommentsList from './CommentsList';
import CommentFilters from './CommentFilters';
import { CreateErrorElements, FetchDidMount, FetchWithUpdate, FetchBasic, FetchIndividual, FetchDeleteBasic } from '../../util/CoreUtil';
import Modal from '../../components/modals/Modal';
import BasicModal from '../../components/modals/BasicModal';
import PreSetFilters from '../../components/filters/PreSetFilters';
import { presetOptions } from '../../components/filters/SortSelect';
import { BugForm } from '../../components/form/BetaTesting';
import FeedbackFormContainer from '../FeedbackFormContainer';

class CommentingContainer extends React.Component {
  state = {
    userThemeSettings: {
      font: 'serif',
      theme: 'light'
      },
    totalComments: 0,
    grandTotalComments: 0,
    showVoteCount: 0,
    showVoteModal: false,
    followedUsers: [],
    blockedUsers: [],
    comments: [],
    commentFormErrors: {},
    sortOpts: {
      showAdvancedFilters: false,
      sortDir: 'desc',
      sortType: 'created_at',
      notFilterList: [],
      filterList: [],
      page: 1,
      commentsFrom: "",
      votesFrom: "",
      radius: '',
      latitude: '',
      longitude: '',
      hideAnonAndGuest: false,
      setFrom: 'gallery',
      previousCommentIds: []
    },
    gallerySettings: { },
    userSettings: { },
    presetFilter: "",
    userInfo: { },
    commentEtiquette: null,
    censored: false,
    showFilterModal: false,
    filterModalShown: false,
    userFeedbackForm: false,
    userBugForm: false,
    userText: "",
    feedbackCategory: "",
    feedbackType: "",
    feedbackErrors: {}
  }

  handleCommentForm = this.handleCommentForm.bind(this);
  commentFormSubmitter = this.commentFormSubmitter.bind(this);
  handleFilterSubmit = this.handleFilterSubmit.bind(this);
  handleTopChange = this.handleTopChange.bind(this);
  handleLoadMoreComments = this.handleLoadMoreComments.bind(this);
  handleFilterByClick = this.handleFilterByClick.bind(this);
  handleAdvancedFiltershow = this.handleAdvancedFiltershow.bind(this);
  setLatLongClick = this.setLatLongClick.bind(this);

  handleChange = this.handleChange.bind(this);
  handlePresetFilterChange = this.handlePresetFilterChange.bind(this);
  handleFilterSubmitMan = this.handleFilterSubmitMan.bind(this);
  handleSortDirClick = this.handleSortDirClick.bind(this);
  handleFilterClick = this.handleFilterClick.bind(this);
  submitterMan = this.submitterMan.bind(this);
  deleteComment = this.deleteComment.bind(this);
  banUser = this.banUser.bind(this);
  clearFilters = this.clearFilters.bind(this);
  showVoteCountTrigger = this.showVoteCountTrigger.bind(this);
  handleShowVoteModal = this.handleShowVoteModal.bind(this);
  handleShowFilterModal = this.handleShowFilterModal.bind(this);

  componentDidMount(){
    FetchDidMount(this, `/api/v1/arts/${this.props.artId}.json`)
    .then(artData => {
      this.setState({
        commentEtiquette: artData.art.gallery_comment_etiquette
      })
    })
    .then(stuff => {
      var { userId, galleryId } = this.props;
      if (userId.length > 0){
        FetchDidMount(this, `/api/v1/users/${userId}.json?gallery_id=${galleryId}`)
        .then(userData => {

          var newSortOpts = this.state.sortOpts;
          var { followed_users, blocked_users, admin, guest, user_name } = userData.user
          var { sort_dir, sort_type, comments_from, votes_from, filter_list, not_filter_list, censor, hide_anon_and_guest, set_from } = userData.user.sort_opts
          var censorComments = censor === "true" || censor == true ? true : false

          newSortOpts.sortDir = sort_dir
          newSortOpts.sortType = sort_type
          newSortOpts.commentsFrom = comments_from
          newSortOpts.votesFrom = votes_from
          newSortOpts.filterList = filter_list.length != 0 ? filter_list.split(',') : []
          newSortOpts.notFilterList = not_filter_list.length != 0 ? not_filter_list.split(',') : []
          newSortOpts.censor = censor
          newSortOpts.setFrom = set_from
          newSortOpts.hideAnonAndGuest = hide_anon_and_guest

          var newUserSettings = this.state.userSettings;
          newUserSettings.admin = admin;
          newUserSettings.guest = guest;

          var newUserInfo = this.state.userInfo;
          newUserInfo.userName = user_name;

          this.setState({
            userSettings: newUserSettings,
            userInfo: newUserInfo,
            sortOpts: newSortOpts,
            censor: censorComments,
            blockedUsers: blocked_users,
            followedUsers: followed_users
           })
        })
        .then(finished => { this.handleFilterSubmit() })
        .catch(error => console.error(`Error in fetch: ${error.message}`));
      }
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  handleChange(event){
    const target = event.target;
    const name = target.name;

    if (this.state.sortOpts.setFrom == 'gallery' && name == "hideAnonAndGuest") {
      this.handleShowFilterModal()
    }

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
    opts.previousCommentIds = []
    this.setState({ sortOpts: opts })
  };

  setLatLongClick(x, y, radius){
    var longitude = Math.round((x * (180 / 150)) - 180)
    var latitude = Math.round(((y * (180 / 100)) - 180) * -1)
    var newSortOpts = this.state.sortOpts

    newSortOpts.latitude = latitude
    newSortOpts.longitude =  longitude
    newSortOpts.radius = radius

    this.setState({
      sortOpts:  newSortOpts
     })

     setTimeout(function() { //Start the timer
       this.handleFilterSubmit();
     }.bind(this), 1)
  }

  handleCommentForm(event, text, anonymous, formInvalid, selfVotes = [], handleClear){
    event.preventDefault();

    var { userId, artType, artId } = this.props;

    if (!formInvalid) {
      var newComment = new FormData();

      newComment.append("comment[user_id]", userId)
      newComment.append("comment[art_type]", artType)
      newComment.append("comment[art_id]", artId)
      newComment.append("comment[text]", text)
      newComment.append("comment[anonymous]", anonymous)
      newComment.append("comment[vote_types]", selfVotes.join(','))

      this.commentFormSubmitter(newComment, handleClear)
    }
  }

  commentFormSubmitter(newComment, handleClear) {
    var { artType, artId } = this.props;

    FetchWithUpdate(this, `/api/v1/comments.json?art_type=${artType}&art_id=${artId}`, 'POST', newComment )
    .then(body => {
      if (body.errors) {

        var artErrors = body.errors["art"]
        if (artErrors) {
          alert(artErrors[0])
          var artSettings = this.props.artSettings
          artSettings[artErrors[1]] = true
          if (artErrors[2]) {
            artSettings['disabledMessage'] = artErrors[2]
          }
          this.props.updateAppState("artSettings", artSettings)
        }

        var userErrors = body.errors["user"]
        if (userErrors) {
          var message = userErrors[0]
          alert(message)
        }

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
        if (body.comment.approved) {
          var newComments = this.state.comments
          newComments.unshift(body.comment)
          var totalComments = this.state.totalComments

          this.setState({
            comments: newComments,
            totalComments: totalComments++
          })
        }

        if (body.old_top_id){
          this.handleTopChange(body.old_top_id)
        }
        handleClear()
      }
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  deleteComment(commentId){
    var { galleryId } = this.props;
    var c = confirm("Are you sure you want to delete this comment?")
    if (c) {
      var updateComment = new FormData()
      updateComment.append("comment[deleted]", true)

      FetchWithUpdate(this, `/api/v1/comments/${commentId}.json?gallery_id=${galleryId}`, "DELETE", updateComment )
      .then(success => {
        var allComments = this.state.comments;
        var filteredComments = allComments.filter(comment => comment.id != commentId)
        this.setState({ comments: filteredComments })
      })
      .catch(error => console.error(`Error in fetch: ${error.message}`));
    }
  }

  handleFilterSubmit(){
    var search = new FormData();

    var { sortDir, page, sortType, filterList, notFilterList, commentsFrom, votesFrom, latitude, longitude, radius, hideAnonAndGuest, previousCommentIds } = this.state.sortOpts;
    var { artType, artId } = this.props;
    search.append("art_type", artType)
    search.append("art_id", artId)
    search.append("page", page);
    search.append("search[sort_dir]", sortDir);
    search.append("search[sort_type]", sortType);
    search.append("search[filter_list]", filterList);
    search.append("search[not_filter_list]", notFilterList);
    if (commentsFrom) {
      search.append("search[comments_from]", commentsFrom)
    }
    if (votesFrom) {
      search.append("search[votes_from]", votesFrom)
    }
    if (radius) {
      search.append("search[radius]", radius)
      search.append("search[lat]", latitude)
      search.append("search[lon]", longitude)
    }
    if (hideAnonAndGuest) {
      search.append("search[hide_anon_and_guest]", hideAnonAndGuest)
    }

    if (previousCommentIds.length) {
      search.append("search[previous_comment_ids]", previousCommentIds)
    }

    FetchBasic(this, '/api/v1/comment_filters.json', search, 'POST')
    .then(commentData => {

      var append = this.state.sortOpts.page > 1
      var newComments;
      if (append) {
        newComments = this.state.comments.concat(commentData.comments)
      } else {
        newComments = commentData.comments
      }

      this.setState({
        comments: newComments,
        totalComments: commentData.total_comments,
        grandTotalComments: commentData.grand_total_comments
      })
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  handleFilterSubmitMan(event){
    this.handleChange(event)
    this.submitterMan(event)
  }

  submitterMan(event){
    setTimeout(function() { //Start the timer
      this.handleFilterSubmit();
    }.bind(this), 1)
  }

  handleAdvancedFiltershow(){
    var newOpts = this.state.sortOpts
    newOpts.showAdvancedFilters = !newOpts.showAdvancedFilters
    this.setState({ sortOpts: newOpts })
  }

  clearFilters(){
    var opts = this.state.sortOpts;
    opts.notFilterList = [];
    opts.filterList = [];
    opts.hideAnonAndGuest = false;
    this.setState({
      sortOpts: opts,
      presetFilter: ""
    })
    if (this.state.sortOpts.setFrom === "gallery") {
      this.handleShowFilterModal()
    }
    this.handleFilterSubmit()
  }

  handlePresetFilterChange(event){
    const target = event.target;
    const name = target.name;
    const value = target.value;

    if (value === "0") {
      this.clearFilters()
    } else {
      var filter = presetOptions[value]
      var opts = this.state.sortOpts

      opts.filterList = filter.filterList;
      opts.notFilterList = filter.notFilterList;
      opts.radius = filter.radius;
      opts.sortType = filter.sortType;
      opts.commentsFrom = filter.commentsFrom
      opts.page = 1;
      opts.previousCommentIds = []
      this.setState({
        sortOpts: opts,
        [name]: value
      })
      this.handleFilterSubmit()
    }
  }

  handleSortDirClick(event){
    event.preventDefault();
    var value = (this.state.sortOpts.sortDir == "asc") ? "desc" : "asc"

    var opts = this.state.sortOpts
    opts.sortDir = value
    opts.page = 1
    opts.previousCommentIds = []

    this.setState({
      sortOpts: opts
    })

    this.submitterMan(event)
  }

  handleFilterByClick(event){
    const target = event.target;
    const name = target.name;
    const value = target.value;

    var opts = this.state.sortOpts
    opts[name] = value;
    opts.page = 1
    opts.previousCommentIds = []

    this.setState({
      sortOpts: opts,
      presetFilter: ""
    })

    this.submitterMan(event);
  }

  handleFilterClick(event){
    event.preventDefault()
    const target = event.target;
    const name = target.getAttribute('data-value');
    var opts = this.state.sortOpts;

    const right = [
      "dislike_percent",
      "dislike_a_lot_percent",
      "trash_percent",
      "warn_percent",
      "sad_percent",
      "boring_percent",
      "angry_percent"
    ]

    if (right.includes(name)) {
      if (opts.notFilterList.includes(name)) {
        var newFilters = opts.notFilterList.filter(v => v != name)
        opts.notFilterList = newFilters
        opts.filterList.push(name)
      } else if (opts.filterList.includes(name)) {
        var newFilters = opts.filterList.filter(v => v != name)
        opts.filterList = newFilters
      } else {
        opts.notFilterList.push(name)
      }
    } else {
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
    }

    opts.page = 1
    opts.previousCommentIds = []

    this.setState({
      sortOpts: opts,
      presetFilter: ""
    })

    this.submitterMan(event)
  }

  handleLoadMoreComments(event){
    var opts = this.state.sortOpts
    if (this.state.totalComments != this.state.comments.length) {
      var comments = this.state.comments
      var commentIds = [];

      for (var i = 0; i < comments.length; i++) {
        commentIds.push(comments[i].id)
      }

      opts.previousCommentIds = commentIds
      opts.page += 1

      this.setState({
        sortOpts: opts
      })

      setTimeout(function() { //Start the timer
        this.handleFilterSubmit();
      }.bind(this), 1)
    }
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

  banUser(userId, event){
    var c = confirm("Do you wish to ban this user? You may unban from the admin console at any time.")
    var { galleryId, artId } = this.props;

    if (c) {
      var l = event.target.previousSibling.value
      FetchIndividual(this, `/api/v1/gallery_blacklistings.json?gallery_id=${galleryId}&user_id=${userId}&dur=${l}`, "POST")
      .then(success => { alert("This user has been banned, login to admin console if you wish to unban at a future date.") })
      .then(finished => { this.handleFilterSubmit() })
      .catch(error => console.error(`Error in fetch: ${error.message}`));
    }
  }

  showVoteCountTrigger(){
    var { showVoteCount } = this.state;
    showVoteCount++
    this.setState({ showVoteCount: showVoteCount })
    if (this.state.showVoteCount === 4) {
      this.handleShowVoteModal()
    }
  }

  handleShowVoteModal(){
    if (this.state.showVoteModal) {
      document.body.classList.remove("cf-modal-locked");
      this.setState({ showVoteModal: false })
    } else {
      document.body.classList.add("cf-modal-locked");
      this.setState({ showVoteModal: true })
    }
  }

  handleShowFilterModal(){
    if (this.state.showFilterModal) {
      document.body.classList.remove("cf-modal-locked");
      this.setState({
        showFilterModal: false,
        filterModalShown: true
      })
    } else if (!this.state.filterModalShown) {
      document.body.classList.add("cf-modal-locked");
      this.setState({
        showFilterModal: true
      })
    }
  }

  render(){

    var { artId, artType, userId, artSettings, updateAppState } = this.props;
    var { totalComments, comments, commentFormErrors, userThemeSettings, sortOpts, followedUsers, blockedUsers, censored } = this.state;

    var endComments;
    if (totalComments === comments.length) {
      endComments =
      <div className="text-center">
        ---  end of comments ---
      </div>
    }

    var showVoteModal;
    if (this.state.showVoteModal) {
      showVoteModal =
      <Modal
        handleClose={this.handleShowVoteModal}
        modalTitle={"Please consider voting!"}
      >
      We’ve noticed that you’ve clicked the Show Results button a few times. Although you’re more than welcome to, please know that the full power of the Classifilter commenting widget is unlocked when users vote on comments and inform the community what they think. Also, please be aware that guests do not have to log in to leave comments or vote on comments.
      </Modal>
    }

    var filterModal;
    if (this.state.showFilterModal && !this.state.filterModalShown) {
      filterModal =
      <Modal
        handleClose={this.handleShowFilterModal}
        modalTitle={"You are leaving curated filters"}
      >
      Please be aware that by changing the filter settings, you are now leaving the curated view that the website has created. You are free to do so, but please do so with the knowledge that some of the content you might see might not be up to the standards of this site. Please click OK if you would like to proceed.
      </Modal>
    }

    var filteredCount = this.state.grandTotalComments - this.state.totalComments

    var loginStatement;
    if (this.state.userSettings.guest) {
      loginStatement =
      <div className="login-statement-container row">
        <div className="col-6 login-statement">
          Guest
        </div>
        <div className="col-3">
          <button className="btn btn-sm fade-button" onClick={ () => window.location = "/login" }>Login</button>
        </div>
        <div className="col-3">
          <button className="btn btn-sm fade-button" onClick={ () => window.location = "/register" }>Register</button>
        </div>
      </div>
    } else {
      var edit_url = `/users/${this.props.userId}/edit_settings`
      loginStatement =
      <div className="login-statement-container row">
        <div className="col-6 login-statement">
          {this.state.userInfo.userName}
        </div>
        <div className="col-3">
          <button className="btn btn-sm fade-button" onClick={ () => window.location = edit_url }>Settings</button>
        </div>
        <div className="col-3">
          <button className="btn btn-sm fade-button" onClick={ () => window.location = "/logout" }>Logout</button>
        </div>
      </div>
    }

    return(
      <div id="cf-comments-main" className={`${userThemeSettings.font} ${userThemeSettings.colorTheme}`}>
        {showVoteModal}
        {filterModal}
        <div />

        <div className="row">
          <div className="col-sm-12 col-md-6">
            <CommentFormContainer
              handleSubmit={this.handleCommentForm}
              commentFormErrors={commentFormErrors}
              artSettings={artSettings}
              commentEtiquette={this.state.commentEtiquette}
              loginStatement={loginStatement}
              />
          </div>
          <div className="d-none d-md-block col-md-6">
            <FeedbackFormContainer
              userId={this.props.userId}
            />
          </div>
        </div>

        <div>
          <PreSetFilters
            onChange={this.handlePresetFilterChange}
            option={this.state.presetFilter}
          />
        </div>

        <div className="row">
          <div className="col-sm-12 col-md-6">
            <CommentFilters
              sortOpts={sortOpts}
              onChange={this.handleFilterSubmitMan}
              handleFilterSubmit={this.handleFilterSubmitMan}
              handleSortDirClick={this.handleSortDirClick}
              handleFilterClick={this.handleFilterClick}
              handleFilterByClick={this.handleFilterByClick}
              parentSetLatLongClick={this.setLatLongClick}
              handleAdvancedFiltershow={this.handleAdvancedFiltershow}
              handleShowFilterModal={this.handleShowFilterModal}
              clearFilters={this.clearFilters}
              />
          </div>
          <div className="d-none d-md-block col-md-6 video-container">

          </div>
        </div>

        <div>
          <p>{this.state.grandTotalComments} comments | {filteredCount} filtered | {totalComments} shown</p>
        </div>

        <div className="row">

          <div className="col-sm-12 col-md-6">
            <CommentsList
              artId={artId}
              artType={artType}
              currentUserId={userId}
              allComments={comments}
              handleTopChange={this.handleTopChange}
              followedUsers={followedUsers}
              blockedUsers={blockedUsers}
              censored={censored}
              artSettings={artSettings}
              updateAppState={updateAppState}
              adminStatus={this.state.userSettings.admin}
              guestStatus={this.state.userSettings.guest}
              deleteComment={this.deleteComment}
              banUser={this.banUser}
              galleryId={this.props.galleryId}
              showVoteCountTrigger={this.showVoteCountTrigger}
              />
            {endComments}
          </div>

          <div className="d-none d-md-block col-md-6 adverts-container">
            <FeedbackFormContainer
              userId={this.props.userId}
              />
          </div>

        </div>
        <BasicModal
          modalButtonId={"feedback-button"}
          modalButtonText={"Feedback / Bugs"}
          modalButtonClass="btn-primary"
        >
          <FeedbackFormContainer
            userId={this.props.userId}
          />
        </BasicModal>
        <ScrollUpButton
          ToggledStyle={ {left: '75px'} }
        />
        <BottomScollListener
          onBottom={this.handleLoadMoreComments}
          offset={500}
        />
      </div>
    )
  }
}

export default CommentingContainer;
