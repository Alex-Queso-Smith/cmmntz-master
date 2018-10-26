import React from 'react'

import { SortDir, SortButton } from '../../components/filters/SortSelect'
import { ImageSelector } from '../../util/VoteUtil';
import { SortButtons, FilterButtonsRowOne, FilterButtonsRowTwo } from '../../util/FilterUtil'

class CommentFilters extends React.Component {
  state = {
    sortDir: 'desc',
    sortType: 'created_at',
    filterList: [],
    page: 1
  }

  handleChange = this.handleChange.bind(this);
  handleFilterSubmit = this.handleFilterSubmit.bind(this);
  handleSortDirClick = this.handleSortDirClick.bind(this);
  handleFilterClick = this.handleFilterClick.bind(this);
  submitterMan = this.submitterMan.bind(this);

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

    this.setState({
      [name]: value,
      page: 1
    })
  };

  handleFilterSubmit(event){
    this.handleChange(event)

    this.submitterMan(event)
  }

  handleSortDirClick(event){
    event.preventDefault();
    var value = (this.state.sortDir == "asc") ? "desc" : "asc"
    this.setState({
      sortDir: value,
      page: 1
    })

    this.submitterMan(event)
  }

  submitterMan(event){
    setTimeout(function() { //Start the timer
      var {sortDir, page, sortType, filterList } = this.state;
      this.props.handleSubmit(event, sortDir, sortType, filterList, page);
    }.bind(this), 1)
  }

  handleFilterClick(event){
    event.preventDefault();
    const target = event.target;
    const name = target.getAttribute('data-value');

    var updatedFilters = this.state.filterList

    if (updatedFilters.includes(name)){
      updatedFilters = updatedFilters.filter(v => v != name)
    } else {
      updatedFilters.push(name)
    }

    this.setState({ filterList: updatedFilters })
    this.submitterMan(event)
  }

  render(){

    var sortButtons = SortButtons(this)
    var filterButtonsRowOne = FilterButtonsRowOne(this)
    var filterButtonsRowTwo = FilterButtonsRowTwo(this)
    return(
      <div className="cf-filter-block">
        <h4>Sort</h4>
        <div className="row">

          {sortButtons}
          <SortDir
            value={this.state.sortDir}
            onClick={this.handleSortDirClick}
            image={ImageSelector(this.state.sortDir, 'Selected')}
          />
        </div>

        <h4>Filters</h4>
        <div className="row">
          {filterButtonsRowOne}
        </div>
        <div className="row">
          {filterButtonsRowTwo}
        </div>
      </div>
    )
  }
};

export default CommentFilters
