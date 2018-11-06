import React from 'react'

import { SortDir, SortButton } from '../../components/filters/SortSelect'
import { ImageSelector } from '../../util/VoteUtil';
import { SortButtons, FilterButtonsRowOne, FilterButtonsRowTwo } from '../../util/FilterUtil'

class CommentFilters extends React.Component {
  render(){

    var sortButtons = SortButtons(this)
    var filterButtonsRowOne = FilterButtonsRowOne(this)
    var filterButtonsRowTwo = FilterButtonsRowTwo(this)

    return(
      <div className="cf-filter-block">
        <div className="row">
          <h4 className="col-2 col-sm-2 col-md-2">Sort</h4>

          {sortButtons}
          <SortDir
            value={this.props.sortOpts.sortDir}
            onClick={this.props.handleSortDirClick}
            image={ImageSelector(this.props.sortOpts.sortDir)}
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
