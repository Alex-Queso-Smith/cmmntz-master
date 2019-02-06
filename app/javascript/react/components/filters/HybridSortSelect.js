import React from 'react';

import { ImageSelector } from '../../util/VoteUtil';
import { SortDir } from './SortSelect';
import { SortButtons } from '../../util/FilterUtil';

class HybridSortSelect extends React.Component {
  state = {
    expand: false
  }

  render(){
    var { expand } = this.state;

    var expandImg = expand ? "minus.png" : "plus.png"

    var sortTypes = [
      ["top_percent-desc", "Top Comments"],
      ["love_percent-desc", "Most Loved"],
      ["like_score-desc", "Most Liked"],
      ["smart_percent-desc", "Smartest"],
      ["funny_percent-desc", "Funniest"],
      ["created_at-desc", "Newest"],
      ["created_at-asc", "Oldest"],
      ["comment_length-asc", "Shortest"],
      ["comment_length-desc", "Longest"]
    ]

    var options = sortTypes.map((type) => {
      return(
        <option key={type[1]} value={type[0]} className="filter-list-item">
          {type[1]}
        </option>
      )
    })

    var sortButtons = SortButtons(this)
    var sort;
    if (this.state.expand) {
      sort =
      <div className="row cf-vote-row justify-content-center cf-margin-top-10px" >
        {sortButtons}
        <SortDir
          value={this.props.sortOpts.sortDir}
          onClick={this.props.handleSortDirClick}
          image={ImageSelector(this.props.sortOpts.sortDir, this.props.globalSettings.baseImageUrl)}
          />
      </div>
    }

    var handleSelectChange = (event) => {
      this.props.onChange(event);
      this.setState({ expand: true })
    }

    var selectStyle = {
      marginTop: "10px",
      float: "right"
    }

    var marginLeft22px = {
      marginLeft: "22px"
    }

    var span = <span style={marginLeft22px}>&#9658;</span>
    if (this.state.expand) {
      var span = <span style={marginLeft22px}>&#9660;</span>
    }

    return(
      <div className="cf-sort-container">
        <div className="row cf-vote-row" >
          <div className="col-2">
            <button onClick={ () => { this.setState({ expand: !this.state.expand }) } } className="cf-sort-filter-button btn btn-sm cf-cursor-pointer cf-float-left">Sort{span}</button>
          </div>
          <div className="col">
            <select style={selectStyle} name="hybridSortSelect" value={this.props.option} onChange={handleSelectChange}>
              <option value="" />
              {options}
            </select>
          </div>
        </div>
        {sort}
      </div>
    )
  }
}


export default HybridSortSelect;
