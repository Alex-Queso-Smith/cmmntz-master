import React from 'react';

import CommentFilters from '../comments/CommentFilters';
import { FetchWithPush, FetchDidMount } from '../../util/CoreUtil';
import { Checkbox } from '../../components/form/FormComponents';

class UserEditSettingsContainer extends React.Component {
  state = {
    sortOpts: {
      sortDir: 'desc',
      sortType: 'created_at',
      notFilterList: [],
      filterList: [],
      commentsFrom: "",
      votesFrom: ""
    },
    censor: false,
    showCensoredComments: true
  }

  handleFilterByClick = this.handleFilterByClick.bind(this);
  handleFilterClick = this.handleFilterClick.bind(this);
  handleSortDirClick = this.handleSortDirClick.bind(this);
  handleChange = this.handleChange.bind(this);
  handleSubmit = this.handleSubmit.bind(this);

  componentDidMount(){
    FetchDidMount(this, `/api/v1/users/${this.props.match.params.id}.json`)
    .then(userData => {
      var opts = this.state.sortOpts
      var { sort_dir, sort_type, comments_from, votes_from, filter_list, not_filter_list, censor, show_censored_comments } = userData.user
      var censored = censor === "true" ? true : false;
      var showCenComment = show_censored_comments === "false" ? false : true;

      opts.sortDir = sort_dir
      opts.sortType = sort_type
      opts.commentsFrom = comments_from
      opts.votesFrom = votes_from
      if (filter_list) {
        opts.filterList = filter_list.split(',')
      }
      if (not_filter_list) {
        opts.notFilterList = not_filter_list.split(',')
      }

      this.setState({
        sortOpts: opts,
        censor: censored,
        showCensoredComments: showCenComment
      })
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  handleChange(event){
    const target = event.target;
    const name = target.name;

    var value;
    if (target.type === "checkbox") {
      value = target.checked

      this.setState({
        [name]: value
      })
      
    } else {
      if (target.getAttribute('data-value')) {
        value = target.getAttribute('data-value')
      } else {
        value = target.value
      };

      var opts = this.state.sortOpts
      opts[name] = value

      this.setState({ sortOpts: opts })
    }
  };

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
  }

  handleSortDirClick(event){
    event.preventDefault();
    var value = (this.state.sortOpts.sortDir == "asc") ? "desc" : "asc"

    var opts = this.state.sortOpts
    opts.sortDir = value

    this.setState({
      sortOpts: opts
    })
  }

  handleSubmit(event){
    event.preventDefault();

    var { sortDir, sortType, notFilterList, filterList, commentsFrom, votesFrom } = this.state.sortOpts;
    var { censor, showCensoredComments } = this.state;

    var user = new FormData();
    user.append("user[sort_dir]", sortDir);
    user.append("user[sort_type]", sortType);
    user.append("user[not_filter_list]", notFilterList);
    user.append("user[filter_list]", filterList);
    user.append("user[comments_from]", commentsFrom);
    user.append("user[votes_from]", votesFrom);
    user.append("user[censor]", censor);
    user.append("user[show_censored_comments]", showCensoredComments)

    FetchWithPush(this, `/api/v1/users/${this.props.match.params.id}.json`, '/', 'PATCH', 'saveErrors', user)
    .then(redirect => window.location = '/articles')
    .then(redirect => { alert('Settings updated!') })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  render(){
    return(
      <div id="user-edit-settings-container">
        <h5 className="text-center">Choose default sort and filter settings</h5>
        <br />
        <CommentFilters
          sortOpts={this.state.sortOpts}
          handleFilterSubmit={this.handleChange}
          handleSortDirClick={this.handleSortDirClick}
          handleFilterClick={this.handleFilterClick}
          handleFilterByClick={this.handleFilterByClick}
        />
      <div className="row">
        <Checkbox
          className={"col-6"}
          onChange={this.handleChange}
          name={"censor"}
          label={"Censor all text?"}
          checked={this.state.censor}
          />
        <Checkbox
          className={"col-6"}
          onChange={this.handleChange}
          name={"showCensoredComments"}
          label={"Show Comment if Censored?"}
          checked={this.state.showCensoredComments}
        />
      </div>
        <div className="margin-top-10px text-center">
          <button className="btn btn-med btn-primary" onClick={this.handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    )
  }
}


export default UserEditSettingsContainer;
