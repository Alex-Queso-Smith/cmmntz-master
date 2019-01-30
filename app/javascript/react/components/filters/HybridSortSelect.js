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

    var sortStyle = {
      fontWeight: "bold",
      fontSize: "1em",
      marginBottom: "0px",
      lineHeight: "1.6"
    }

    var expandStyle = {
      height: '12px',
      width: '12px',
      marginLeft: "10px"
    }

    var selectStyle = {
      marginTop: "2px"
    }

    return(
      <div>
        <div className="row cf-vote-row" >
          <div className="col-1 col-sm-1 cf-cursor-pointer" onClick={ () => { this.setState({ expand: !this.state.expand }) } }>
            <img style={expandStyle} src={`/images/icons-v2/${expandImg}`} />
          </div>
          <div className="col-2 col-sm-2 cf-cursor-pointer" id="cf-sort-selector" onClick={ () => { this.setState({ expand: !this.state.expand }) } }>
            <h4 style={sortStyle} >Sort</h4>
          </div>
          <div className="col-8 col-sm-9" id="cf-sort-selector">
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
