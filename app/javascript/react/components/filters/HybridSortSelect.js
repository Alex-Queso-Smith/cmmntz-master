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
      ["comment_length-desc", "Shortest"],
      ["comment_length-asc", "Longest"]
    ]

    var options = sortTypes.map((type) => {
      return(
        <option key={type[1]} value={type[0]} className="filter-list-item">
          {type[1]}
        </option>
      )
    })

    var sortStyle = {
      fontWeight: "bold",
      fontSize: "1em"
    }

    var expandStyle = {
      height: '12px',
      width: '12px'
    }

    var sortButtons = SortButtons(this)
    var sort;
    if (this.state.expand) {
      sort =
      <div className="row cf-vote-row justify-content-center" >
        {sortButtons}
        <SortDir
          value={this.props.sortOpts.sortDir}
          onClick={this.props.handleSortDirClick}
          image={ImageSelector(this.props.sortOpts.sortDir)}
          />
      </div>
    }

    var handleSelectChange = (event) => {
      this.props.onChange(event);
      this.setState({ expand: true })
    }

    return(
      <div>
        <div className="row cf-vote-row" >
          <div  className="col-1 col-sm-1" id="cf-sort-selector">
            <h4 style={sortStyle} >Sort</h4>
          </div>
          <div className="col-2 col-sm-1">
            <img className="cf-cursor-pointer" style={expandStyle} src={`/images/icons-v2/${expandImg}`} onClick={ () => { this.setState({ expand: !this.state.expand }) } } />
          </div>
          <div  className="cf-padding-cancel col-8 col-sm-10 cf-margin-bottom-10px" id="cf-sort-selector">
            <select name="hybridSortSelect" value={this.props.option} onChange={handleSelectChange}>
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
