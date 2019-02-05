import React from 'react';

import { FetchDidMount, FetchWithPush, FetchDeleteBasic } from '../../util/CoreUtil';
import Tabs from '../../components/settings/Tabs';
import UserEditSettingsContainer from './UserEditSettingsContainer';
import UserEditAccountContainer from './UserEditAccountContainer';
import UserEditLooksContainer from './UserEditLooksContainer';
import UserEditDemographicsContainer from './UserEditDemographicsContainer';
import UserEditPasswordContainer from './UserEditPasswordContainer';
import FeedbackFormContainer from '../FeedbackFormContainer';

class UserEditContainer extends React.Component {
  state = {
    display: "",
    userName: '',
    email: '',
    avatar: '',
    gender: '',
    ageRange: '',
    latitude: '',
    longitude: '',
    x: '',
    y: '',
    geoPin: { x: '', y: '' },
    font: '',
    colorTheme: '',
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
    locationAnon: false,
    ageRangeAnon: false,
    genderAnon: false,
    saveErrors: {}
  }

  _isMounted = false;
  handleTabClick = this.handleTabClick.bind(this);
  handleChange = this.handleChange.bind(this);
  handleDemoChange = this.handleDemoChange.bind(this);
  handleSortOptCheckChange = this.handleSortOptCheckChange.bind(this);
  handleSortOptChange = this.handleSortOptChange.bind(this);
  clearFilters = this.clearFilters.bind(this);
  handleSliderChange = this.handleSliderChange.bind(this);
  handleRevertSettings = this.handleRevertSettings.bind(this);
  handleAvatarClick = this.handleAvatarClick.bind(this);
  handleFilterByClick = this.handleFilterByClick.bind(this);
  handleDeleteAccount = this.handleDeleteAccount.bind(this);
  handleFilterClick = this.handleFilterClick.bind(this);
  handleSortDirClick = this.handleSortDirClick.bind(this);
  setLatLongClick = this.setLatLongClick.bind(this);
  handleSubmit = this.handleSubmit.bind(this);

  componentDidMount(){
    this._isMounted = true;

    var { userId } = this.props;

    FetchDidMount(this, `${this.props.globalSettings.baseUrl}/api/v1/users/${userId}.json`)
    .then(body => {
      var { sort_dir, sort_type, comments_from, votes_from, filter_list, not_filter_list, censor, show_censored_comments, hide_anon_and_guest, age_range_search, gender_search } = body.user.sort_opts
      var user = body.user;
      var x = ( (user.longitude + 180) / (180 / 150) )
      var y = ( ((user.latitude / -1) + 180) / (180 / 100) )
      var noLocation = user.latitude === "" ? true : false;
      var userFont = user.font.replace("cf-", '');
      var userTheme = user.color_theme.replace("cf-", '');

      var gender;
      switch (user.gender) {
        case 0:
            gender = "female"
          break;
        case 1:
            gender = "other"
          break;
        case 2:
            gender = "male"
          break;
        default:
          gender = ""
      }

      var censored = censor === "true" || censor == true ? true : false;
      var showCenComment = show_censored_comments === "false" ? false : true;

      var opts = this.state.sortOpts;

      opts.sortDir = sort_dir.length != 0 ? sort_dir : "desc";
      opts.sortType = sort_type.length != 0 ? sort_type : "created_at";
      opts.commentsFrom = comments_from;
      opts.votesFrom = votes_from;
      opts.filterList = filter_list.length != 0 ? filter_list.split(',') : [];
      opts.notFilterList = not_filter_list.length != 0 ? not_filter_list.split(',') : [];
      opts.hideAnonAndGuest = hide_anon_and_guest;
      opts.ageRange = age_range_search;

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
          userName: user.user_name,
          email: user.email,
          avatar: user.avatar_image,
          gender: gender,
          ageRange: user.age_range,
          latitude: user.latitude,
          longitude: user.longitude,
          x: x,
          y: y,
          geoPin: { x: x - 6, y: y - 6 },
          font: userFont,
          colorTheme: userTheme,
          sortOpts: opts,
          censor: censored,
          showCensoredComments: showCenComment,
          locationAnon: noLocation,
          ageRangeAnon: user.age_range === "",
          genderAnon: user.gender === ""
        })
      }
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  handleChange(event){
    event.preventDefault();
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({ [name]: value })
  }

  handleDemoChange(event){
    const target = event.target;
    var value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    switch (name) {
      case "location":
        this.setState({
          latitude: "",
          longitude: "",
          x: "",
          y: "",
          geoPin: { x: "", y: "" },
          locationAnon: value
        })
        break;
      case "gender":
        value = target.getAttribute('value')
        this.setState({
          [name]: value,
          genderAnon: false
        })
        break;
      case "ageRangeAnon":
        this.setState({
          ageRange: "",
          ageRangeAnon: value
        })
        break;
      case "genderAnon":
        this.setState({
          gender: "",
          genderAnon: value
        })
        break;
      default:
        this.setState({ [name]: value })
    }
  }

  handleSliderChange(event){
    const target = event.target;
    var value = target.value;
    const name = target.name;
    var anon;
    if (value === "15") {
      value = "13"
      anon = false
    } else if (value === "10") {
      value = ""
      anon = true
    } else {
      anon = false
    }

    this.setState({
      [name]: value,
      ageRangeAnon: anon
    })
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

  handleSortOptChange(event){
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

  handleAvatarClick(event){
    event.preventDefault();

    const target = event.target;
    const value = target.name;
    this.setState({ avatar: value } )
  }

  setLatLongClick(x, y){

    var longitude = Math.round((x * (180 / 150)) - 180)
    var latitude = Math.round(((y * (180 / 100)) - 180) * -1)

    this.setState({
      latitude: latitude,
      longitude: longitude,
      geoPin: { x: x - 6, y: y - 6 },
      locationAnon: false
     })
  }

  handleTabClick(event){
    const target = event.target;
    const value = target.getAttribute('data-value');

    this.setState({ display: value })
  }

  handleSubmit(event){
    event.preventDefault();

    var { userId } = this.props;
    var { sortDir, sortType, notFilterList, filterList, commentsFrom, votesFrom, hideAnonAndGuest } = this.state.sortOpts;
    var { gender, ageRange } = this.state;

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

    var user = new FormData();

    user.append("user[user_name]", this.state.userName);
    user.append("user[email]", this.state.email);
    user.append("user[base_image]", this.state.avatar);
    user.append("user[age_range]", this.state.ageRange);
    user.append("user[latitude]", this.state.latitude);
    user.append("user[longitude]", this.state.longitude);
    user.append("user[gender]", gender);
    user.append("user[font]", this.state.font);
    user.append("user[color_theme]", this.state.colorTheme);
    user.append("user[sort_dir]", sortDir);
    user.append("user[sort_type]", sortType);
    user.append("user[not_filter_list]", notFilterList);
    user.append("user[filter_list]", filterList);
    user.append("user[comments_from]", commentsFrom);
    user.append("user[votes_from]", votesFrom);
    user.append("user[censor]", this.state.censor);
    user.append("user[show_censored_comments]", this.state.showCensoredComments)
    user.append("user[settings_updated]", !this.state.useGalleryDefault)
    user.append("user[hide_anon_and_guest]", hideAnonAndGuest)
    user.append("user[age_range_search]", this.state.sortOpts.ageRange)
    user.append("user[gender_search]", this.state.sortOpts.gender)

    FetchWithPush(this, `${this.props.globalSettings.baseUrl}/api/v1/users/${userId}.json`, '', 'PATCH', 'saveErrors', user)
    .then(body => {
      if (!body.errors) {
        this.setState({ saveErrors: {} })
        this.props.updateDisplay("")
      } else {
        alert("Please fix errors before submitting again")
      }
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  handleDeleteAccount(event){
    event.preventDefault();

    var confirm1 = confirm("Are you sure you wish to delete your account? Deleting your account is irreversible. Once you delete your accounts, all of your comments and interactions will become anonymous.");

    if (confirm1 == true) {
      FetchDeleteBasic(this, `${this.props.globalSettings.baseUrl}/api/v1/users/${this.props.userId}.json`)
      .then(finished => {

        this.props.updateSpaId(finished.user_id);
        this.props.updateDisplay("")
        }
      )
    }
  }

  render(){
    var { display, saveErrors } = this.state;
    var { userId } = this.props;

    var updateDisplayPassword = (event) => {
      this.props.updateDisplay("password", event)
    }

    var updateDisplayComments = (event) => {
      this.props.updateDisplay("", event)
    }

    var page;
    switch (display) {
      case "":
        var { userName, email, avatar } = this.state;
        page =
        <UserEditAccountContainer
          userId={ userId }
          userName={userName}
          email={email}
          avatar={avatar}
          saveErrors={saveErrors}
          updateDisplay={updateDisplayComments}
          globalSettings={this.props.globalSettings}
          updateDisplayPassword={updateDisplayPassword}
          handleChange={this.handleChange}
          handleDeleteAccount={this.handleDeleteAccount}
          handleAvatarClick={this.handleAvatarClick}
          handleSubmit={this.handleSubmit}
        />
      break;
      case "looks":
        var { font, colorTheme } = this.state;
        page =
        <UserEditLooksContainer
          userId={ userId }
          updateDisplay={updateDisplayComments}
          font={font}
          colorTheme={colorTheme}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
          globalSettings={this.props.globalSettings}
        />
      break;
      case "demographics":
        var { ageRange, gender, x, y, latitude, longitude, geoPin, locationAnon, genderAnon, ageRangeAnon } = this.state;
        page =
        <UserEditDemographicsContainer
          userId={ userId }
          ageRange={ageRange}
          gender={gender}
          x={x}
          y={y}
          latitude={latitude}
          longitude={longitude}
          geoPin={geoPin}
          locationAnon={locationAnon}
          genderAnon={genderAnon}
          ageRangeAnon={ageRangeAnon}
          handleSliderChange={this.handleSliderChange}
          setLatLongClick={this.setLatLongClick}
          handleDemoChange={this.handleDemoChange}
          handleSubmit={this.handleSubmit}
          updateDisplay={updateDisplayComments}
          globalSettings={this.props.globalSettings}
        />
      break;
      case "settings":
        var { sortOpts, censor, showCensoredComments, useGalleryDefault } = this.state;
        page =
        <UserEditSettingsContainer
          userId={ userId }
          sortOpts={sortOpts}
          censor={censor}
          showCensoredComments={showCensoredComments}
          useGalleryDefault={useGalleryDefault}
          handleChange={this.handleSortOptChange}
          handleSortDirClick={this.handleSortDirClick}
          handleRevertSettings={this.handleRevertSettings}
          handleSortDirClick={this.handleSortDirClick}
          clearFilters={this.clearFilters}
          handleFilterClick={this.handleFilterClick}
          handleFilterByClick={this.handleFilterByClick}
          handleSubmit={this.handleSubmit}
          updateDisplay={updateDisplayComments}
          globalSettings={this.props.globalSettings}
        />
        break;
      default:
        page =
        <UserEditAccountContainer
          userId={ userId }
          updateDisplay={updateDisplayComments}
          globalSettings={this.props.globalSettings}
        />
    }

    return(
      <div id="cf-user-edit-container">
        <Tabs
          display={this.state.display}
          onClick={this.handleTabClick}
        />

        {page}

        <hr />

        <FeedbackFormContainer
          userId={this.state.userId}
          globalSettings={this.props.globalSettings}
        />

      </div>
    )
  }
}

export default UserEditContainer;
