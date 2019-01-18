import React from 'react';

import CommentFilters from '../comments/CommentFilters';
import { FetchWithPush, FetchDidMount } from '../../util/CoreUtil';
import { Checkbox } from '../../components/form/FormComponents';
import { UserSortButtons } from '../../util/FilterUtil';
import { ImageSelector } from '../../util/VoteUtil';
import { SortDir } from '../../components/filters/SortSelect'

class UserEditSettingsContainer extends React.Component {
  state = {
    sortOpts: {
      sortDir: 'desc',
      sortType: 'created_at',
      notFilterList: [],
      filterList: [],
      commentsFrom: "",
      votesFrom: "",
      gender: "",
      ageRange: "",
      hideAnonAndGuest: false
    },
    censor: "",
    showCensoredComments: true,
    useGalleryDefault: false,
    display: ""
  }

  _isMounted = false;
  handleFilterByClick = this.handleFilterByClick.bind(this);
  handleFilterClick = this.handleFilterClick.bind(this);
  handleSortDirClick = this.handleSortDirClick.bind(this);
  handleChange = this.handleChange.bind(this);
  handleSubmit = this.handleSubmit.bind(this);
  handleRevertSettings = this.handleRevertSettings.bind(this);
  clearFilters = this.clearFilters.bind(this);
  handleSortOptCheckChange = this.handleSortOptCheckChange.bind(this);

  componentDidMount(){
    this._isMounted = true;

    FetchDidMount(this, `${this.props.globalSettings.baseUrl}/api/v1/users/${this.props.userId}.json`)
    .then(userData => {
      var opts = this.state.sortOpts
      var { sort_dir, sort_type, comments_from, votes_from, filter_list, not_filter_list, censor, show_censored_comments, hide_anon_and_guest, age_range_search, gender_search } = userData.user.sort_opts
      var censored = censor === "true" || censor == true ? true : false;
      var showCenComment = show_censored_comments === "false" ? false : true;

      opts.sortDir = sort_dir.length != 0 ? sort_dir : "desc"
      opts.sortType = sort_type.length != 0 ? sort_type : "created_at"
      opts.commentsFrom = comments_from
      opts.votesFrom = votes_from
      opts.filterList = filter_list.length != 0 ? filter_list.split(',') : []
      opts.notFilterList = not_filter_list.length != 0 ? not_filter_list.split(',') : []
      opts.hideAnonAndGuest = hide_anon_and_guest
      opts.ageRange = age_range_search

      switch (gender_search) {
        case "0":
            gender_search = "female"
          break;
        case "1":
            gender_search = "other"
          break;
        case "2":
            gender_search = "male"
          break;
        default:
          gender_search = ""
      }
      opts.gender = gender_search

      if (this._isMounted) {
        this.setState({
          sortOpts: opts,
          censor: censored,
          showCensoredComments: showCenComment
        })
      }
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  handleSortOptCheckChange(event) {
    var target = event.target
    var newOpts = this.state.sortOpts
    newOpts[target.name] = target.checked

    this.setState({
      sortOpts: newOpts,
      useGalleryDefault: false
    })
  }

  handleChange(event){
    const target = event.target;
    const name = target.name;
    var value;

    if (target.type === "checkbox") {
      value = target.checked

      this.setState({
        [name]: value,
        useGalleryDefault: false
      })

    } else {
      if (name === "hideAnonAndGuest") {
        value = !this.state.sortOpts.hideAnonAndGuest
      } else if (target.getAttribute('data-value')) {
        value = target.getAttribute('data-value')
      } else {
        value = target.value
      };

      var opts = this.state.sortOpts
      opts[name] = value

      this.setState({
        sortOpts: opts,
        useGalleryDefault: false
      })
    }
  };

  handleRevertSettings(event){
    const target = event.target;
    const name = target.name;
    const value = target.checked;

    this.setState({
      useGalleryDefault: value,
      sortOpts: {
        sortDir: 'desc',
        sortType: 'created_at',
        notFilterList: [],
        filterList: [],
        commentsFrom: "",
        votesFrom: "",
        gender: "",
        ageRange: ""
      },
      censor: "",
      showCensoredComments: true
    })
  }

  clearFilters(){
    var opts = this.state.sortOpts;
    opts.notFilterList = [];
    opts.filterList = [];
    this.setState({ sortOpts: opts })
  }

  handleFilterByClick(event){
    const target = event.target;
    const name = target.name;
    var value;
    var opts = this.state.sortOpts

    switch (name) {
      case "gender":
        value = target.getAttribute('value')
        if (value === opts.gender) {
          value = ""
        }
        break;

      case "ageRange":
        value = target.value
        if (value === "15") {
          value = "13"
        } else if (value === "10") {
          value = ""
        }
        break;
      default:
        value = target.value
    }



    opts[name] = value;
    opts.page = 1

    this.setState({
      sortOpts: opts,
      useGalleryDefault: false
    })
  }

  handleFilterClick(event){
    event.preventDefault();
    const target = event.target;
    const name = target.getAttribute('data-value');
    var opts = this.state.sortOpts

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

    this.setState({
      sortOpts: opts,
      useGalleryDefault: false
    })
  }

  handleSortDirClick(event){
    event.preventDefault();
    var value = (this.state.sortOpts.sortDir == "asc") ? "desc" : "asc"

    var opts = this.state.sortOpts
    opts.sortDir = value

    this.setState({
      sortOpts: opts,
      useGalleryDefault: false
    })
  }

  handleSubmit(event){
    event.preventDefault();

    var { sortDir, sortType, notFilterList, filterList, commentsFrom, votesFrom, hideAnonAndGuest, gender, ageRange } = this.state.sortOpts;
    var { censor, showCensoredComments, useGalleryDefault } = this.state;

    var user = new FormData();
    user.append("user[sort_dir]", sortDir);
    user.append("user[sort_type]", sortType);
    user.append("user[not_filter_list]", notFilterList);
    user.append("user[filter_list]", filterList);
    user.append("user[comments_from]", commentsFrom);
    user.append("user[votes_from]", votesFrom);
    user.append("user[censor]", censor);
    user.append("user[show_censored_comments]", showCensoredComments)
    user.append("user[settings_updated]", !useGalleryDefault)
    user.append("user[hide_anon_and_guest]", hideAnonAndGuest)
    user.append("user[age_range_search]", ageRange)

    switch (gender) {
      case "female":
          gender = 0
        break;
      case "other":
          gender = 1
        break;
      case "male":
          gender = 2
        break;
    }
    user.append("user[gender_search]", gender)

    hideAnonAndGuest
    FetchWithPush(this, `${this.props.globalSettings.baseUrl}/api/v1/users/${this.props.userId}.json`, '', 'PATCH', 'saveErrors', user)
    .then(body => {
      if (!body.errors) {
        this.setState({ saveErrors: {} })
        alert(`${body.message}`)
      }
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  clearFilters(){
    var opts = this.state.sortOpts;
    opts.notFilterList = [];
    opts.filterList = [];
    this.setState({ sortOpts: opts })
  }

  render(){

    var sortButtons = UserSortButtons(this);

    return(
      <div id="cf-user-edit-settings-container">
        <br />
        <Checkbox
          onChange={this.handleRevertSettings}
          name={"useGalleryDefault"}
          label={"Check to use the settings chosen by the websites I visit"}
          checked={this.state.useGalleryDefault}
        />
        <div className="row cf-vote-row justify-content-center" >
          {sortButtons}
          <SortDir
            value={this.state.sortOpts.sortDir}
            onClick={this.handleSortDirClick}
            image={ImageSelector(this.state.sortOpts.sortDir)}
            />
        </div>
        <CommentFilters
          className={"cf-margin-top-10px"}
          sortOpts={this.state.sortOpts}
          handleFilterSubmit={this.handleChange}
          handleSortDirClick={this.handleSortDirClick}
          clearFilters={this.clearFilters}
          handleFilterClick={this.handleFilterClick}
          handleFilterByClick={this.handleFilterByClick}
          clearFilters={this.clearFilters}
          filtersExpanded={true}
          onChange={this.handleChange}
          hideFilterLink={true}
          globalSettings={this.props.globalSettings}
        />
        <Checkbox
          onChange={this.handleChange}
          name={"censor"}
          label={"Censor all text?"}
          checked={this.state.censor}
        />
        <Checkbox
          onChange={this.handleChange}
          name={"showCensoredComments"}
          label={"Show Comment if Censored?"}
          checked={this.state.showCensoredComments}
        />
        <div className="cf-margin-top-10px cf-text-center">
          <button className="btn btn-sm cf-float-right btn-dark" onClick={this.handleSubmit}>
            Update
          </button>
          <button className="btn btn-sm btn-dark cf-float-left" onClick={ this.props.updateDisplay }>
            Back
          </button>
        </div>
      </div>
    )
  }
}


export default UserEditSettingsContainer;
