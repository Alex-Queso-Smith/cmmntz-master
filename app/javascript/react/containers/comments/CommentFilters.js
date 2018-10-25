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
  handleFilterSubmit = this.handleFilterSubmit.bind(this)

  handleChange(event){
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
      page: 1
    })
  };

  handleFilterSubmit(event){
    this.handleChange(event)

    setTimeout(function() { //Start the timer
      var {sortDir, page} = this.state;
      this.props.handleSubmit(event, sortDir, page);
    }.bind(this), 1)
  }

  render(){
    var { sortDir, sortType } = this.state

    var sortTypes = [
      ["top", "Top"],
      ["love", "Love"],
      ["like", "Like"],
      ["smart", "Smart"],
      ["funny", "Funny"],
      ["created_at", "Date"],
      ["length", "Length"]
    ]

    var sortButtons = sortTypes.map((type) => {
      var image;

      if (sortType == type[0]) {
        image = ImageSelector(type[0], 'Selected')
      } else {
        image = ImageSelector(type[0], 'Unselected')
      }

      return(
        <SortButton
          key={`filter_${type[0]}`}
          name={type[0]}
          label={type[1]}
          onClick={this.handleFilterSubmit}
          image={image}
          />
      )
    })

    return(
      <div className="cf-filter-block">
        <h4>Filters</h4>
        <div className="row">
          {sortButtons}
          <SortDir
            content={this.state.sortDir}
            onChange={this.handleFilterSubmit}
          />
        </div>

      </div>
    )
  }
};

export default CommentFilters
