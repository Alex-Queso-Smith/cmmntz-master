import React from 'react';

import CommentFilters from '../comments/CommentFilters';
import { FetchWithPush, FetchDidMount } from '../../util/CoreUtil';

class UserEditSettingsContainer extends React.Component {
  state = {
    sortOpts: {
      sortDir: 'desc',
      sortType: 'created_at',
      notFilterList: [],
      filterList: [],
      commentsFrom: "",
      votesFrom: ""
    }
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
      
      opts.sortDir = userData.user.sort_dir
      opts.sortType = userData.user.sort_type
      opts.commentsFrom = userData.user.comments_from
      opts.votesFrom = userData.user.votes_from
      opts.filterList = userData.user.filter_list.split(',')
      opts.notFilterList = userData.user.not_filter_list.split(',')
      this.setState({ sortOpts: opts })
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  handleChange(event){
    event.preventDefault();
    const target = event.target;
    const name = target.name;

    var value;
    if (target.getAttribute('data-value')) {
      value = target.getAttribute('data-value')
    } else {
      value = target.value
    };

    var opts = this.state.sortOpts
    opts[name] = value

    this.setState({ sortOpts: opts })
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

    var user = new FormData();
    user.append("user[sort_dir]", sortDir);
    user.append("user[sort_type]", sortType);
    user.append("user[not_filter_list]", notFilterList);
    user.append("user[filter_list]", filterList);
    user.append("user[comments_from]", commentsFrom);
    user.append("user[votes_from]", votesFrom);

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
