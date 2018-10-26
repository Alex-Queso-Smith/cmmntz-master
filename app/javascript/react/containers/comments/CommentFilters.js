import React from 'react'

import { SortDir, SortButton } from '../../components/filters/SortSelect'
import { ImageSelector } from '../../util/VoteUtil';

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
    var { sortDir, sortType } = this.state

    var sortTypes = [
      ["top_count", "top"],
      ["love_count", "love"],
      ["like_score", "like"],
      ["smart_count", "smart"],
      ["funny_count", "funny"],
      ["created_at", "created_at"],
      ["comment_length", "length"]
    ]

    var sortButtons = sortTypes.map((type) => {
      var image;

      if (sortType == type[0]) {
        image = ImageSelector(type[1], 'Selected')
      } else {
        image = ImageSelector(type[1], 'Unselected')
      }

      return(
        <SortButton
          key={`sort_${type[1]}`}
          value={type[0]}
          onClick={this.handleFilterSubmit}
          image={image}
          visibility=''
          />
      )
    })

    var rowOneFilterTypes = [
      ["top", "Top"],
      ["love", "Love"],
      ["like_a_lot", "Like A Lot"],
      ["like", "Like"],
      ["indifferent", "Indifferent"],
      ["dislike", "Dislike"],
      ["dislike_a_lot", "Dislike A Lot"],
      ["trash", "Trash"],
      ["warn", "Warn"]
    ]

    var rowTwoFilterTypes = [
      ["blank1", "blank1"],
      ["smart", "Smart"],
      ["funny", "Funny"],
      ["happy", "Happy"],
      ["shocked", "Shocked"],
      ["sad", "Sad"],
      ["boring", "Boring"],
      ["angry", "Angry"],
      ["blank2", "blank2"]
    ]

    var filterButtonsRowOne = rowOneFilterTypes.map((type) => {
      var image;

      if (this.state.filterList.includes(`${type[0]}_percent`)) {
        image = ImageSelector(type[0], 'Selected')
      } else {
        image = ImageSelector(type[0], 'Unselected')
      }
      return(
        <SortButton
          key={`filter_${type[1]}`}
          value={`${type[0]}_percent`}
          onClick={this.handleFilterClick}
          image={image}
          visibility=''
          />
      )
    })

    var filterButtonsRowTwo = rowTwoFilterTypes.map((type) => {
      var image, visibility;

      if (type[0] == "blank1" || type[0] == "blank2"){
        visibility = "visibility-hidden"
      }

      if (this.state.filterList.includes(`${type[0]}_percent`)) {
        image = ImageSelector(type[0], 'Selected')
      } else {
        image = ImageSelector(type[0], 'Unselected')
      }

      return(
        <SortButton
          key={`filter_${type[1]}`}
          value={`${type[0]}_percent`}
          onClick={this.handleFilterClick}
          image={image}
          visibility={visibility}
          />
      )
    })


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
