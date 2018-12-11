import React from 'react'

import { SortDir, SortButton } from '../../components/filters/SortSelect'
import { ImageSelector } from '../../util/VoteUtil';
import { SortButtons, FilterButtonsRowOne, FilterButtonsRowTwo, FilterCommentsBy, FilterVotesBy } from '../../util/FilterUtil'
import GeoSelect from '../filters/GeoSelect'

class CommentFilters extends React.Component {
  render(){

    var sortButtons = SortButtons(this)
    var filterButtonsRowOne = FilterButtonsRowOne(this)
    var filterButtonsRowTwo = FilterButtonsRowTwo(this)

    const { showAdvancedFilters, radius, x, y, latitude, longitude, geoPin } = this.props.sortOpts

    var advancedFilters, advancedFiltersToggle;
    if (!this.props.hideAdvancedLink == true) {

      if (showAdvancedFilters == true) {
        advancedFilters =
        <div id="advanced-filters">
          <GeoSelect
            parentSetLatLongClick={this.props.parentSetLatLongClick}
            />
        </div>

        advancedFiltersToggle =
        <div className="row">
          <div className="col-sm-12">
            <button onClick={this.props.handleAdvancedFiltershow} className="btn show-filters-button float-left">
              hide advanced filters
            </button>
          </div>
        </div>
      } else {
        advancedFiltersToggle =
        <div className="row">
          <div className="col-sm-12">
            <button onClick={this.props.handleAdvancedFiltershow}  className="btn show-filters-button float-left">
              show advanced filters
            </button>
          </div>
        </div>
      }
    }

    return(
      <div className={`cf-filter-block ${this.props.className}`}>
        <div className="row vote-row" >
          <h4 className="col-2 col-sm-2 col-md-2">Sort</h4>

          {sortButtons}
          <SortDir
            value={this.props.sortOpts.sortDir}
            onClick={this.props.handleSortDirClick}
            image={ImageSelector(this.props.sortOpts.sortDir)}
          />
        </div>
        <br/>
        <div className="row">
          <div className="col-sm-6">
            <h4>Filters</h4>
          </div>
          <div className="col-sm-6">
            <button className="cf-clear-button btn btn-sm float-right" onClick={this.props.clearFilters}>Clear</button>
          </div>
        </div>
        <div className="row vote-row">
          {filterButtonsRowOne}
        </div>
        <div className="row vote-row">
          {filterButtonsRowTwo}
        </div>
        <br/>
        <div className="row">
          <div className="col-12">
            <h4>Show only comments from:</h4>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <FilterCommentsBy
              commentsFrom={this.props.sortOpts.commentsFrom}
              onClick={this.props.handleFilterByClick}
              />
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-12">
            <h4>Show only Votes By:</h4>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <FilterVotesBy
              votesFrom={this.props.sortOpts.votesFrom}
              onClick={this.props.handleFilterByClick}
              />
          </div>
        </div>
        {advancedFiltersToggle}
        {advancedFilters}
      </div>
    )
  }
};

export default CommentFilters
