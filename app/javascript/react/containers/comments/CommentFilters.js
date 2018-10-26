import React from 'react'

import { SortDir, SortButton } from '../../components/filters/SortSelect'
import { ImageSelector } from '../../util/VoteUtil';

class CommentFilters extends React.Component {
  state = {
    sortDir: 'desc',
    sortType: 'created_at',
    page: 1
  }

  handleChange = this.handleChange.bind(this);
  handleFilterSubmit = this.handleFilterSubmit.bind(this);
  handleSortDirClick = this.handleSortDirClick.bind(this);

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

    setTimeout(function() { //Start the timer
      var {sortDir, page, sortType } = this.state;
      this.props.handleSubmit(event, sortDir, sortType, page);
    }.bind(this), 1)
  }

  handleSortDirClick(event){
    event.preventDefault();
    var value = (this.state.sortDir == "asc") ? "desc" : "asc"
    this.setState({
      sortDir: value,
      page: 1
    })

    setTimeout(function() { //Start the timer
      var {sortDir, page, sortType } = this.state;
      this.props.handleSubmit(event, sortDir, sortType, page);
    }.bind(this), 1)
  }

  render(){
    var { sortDir, sortType } = this.state

    var sortTypes = [
      ["top_count", "top"],
      ["love_count", "love"],
      ["like_count", "like"],
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
          key={`filter_${type[1]}`}
          value={type[0]}
          onClick={this.handleFilterSubmit}
          image={image}
          />
      )
    })

    var sortImage = ImageSelector(this.state.sortDir, 'Selected')

    return(
      <div className="cf-filter-block">
        <h4>Filters</h4>
        <div className="row">
          {sortButtons}
          <SortDir
            value={this.state.sortDir}
            onClick={this.handleSortDirClick}
            image={sortImage}
          />
        </div>

      </div>
    )
  }
};

export default CommentFilters
