import React from 'react'

import { Checkbox } from '../../components/form/FormComponents';
import { SortDir, SortButton } from '../../components/filters/SortSelect'
import { ImageSelector } from '../../util/VoteUtil';
import { SortButtons, FilterButtonsRowOne, FilterButtonsRowTwo, FilterCommentsBy, FilterVotesBy } from '../../util/FilterUtil'
import GeoSelect from '../filters/GeoSelect';

class CommentFilters extends React.Component {
  state = {
    hideAnonAndGuest: this.props.sortOpts.hideAnonAndGuest,
    filtersExpanded: false
  }

  expandFilters = this.expandFilters.bind(this);

  componentDidUpdate(prevProps, prevState){
    if (this.props.sortOpts.hideAnonAndGuest != this.state.hideAnonAndGuest) {
      this.setState({ hideAnonAndGuest: this.props.sortOpts.hideAnonAndGuest })
    }
  }

  expandFilters(){
    this.setState({ filtersExpanded: !this.state.filtersExpanded })
  }

  render(){

    var sortButtons = SortButtons(this)
    var filterButtonsRowOne = FilterButtonsRowOne(this)
    var filterButtonsRowTwo = FilterButtonsRowTwo(this)

    const { showAdvancedFilters, radius, x, y, latitude, longitude, geoPin, hideAnonAndGuest } = this.props.sortOpts

    var advancedFilters, advancedFiltersToggle;
    if (!this.props.hideAdvancedLink == true) {

      if (showAdvancedFilters == true) {
        advancedFilters =
        <div id="advanced-filters">
          <GeoSelect
            parentSetLatLongClick={this.props.parentSetLatLongClick}
            radius={radius}
            userLat={this.props.userInfo.latitude}
            userLong={this.props.userInfo.longitude}
            />
        </div>

        advancedFiltersToggle =
        <div className="row">
          <div className="col-sm-12">
            <button onClick={this.props.handleAdvancedFiltershow} className="btn cf-fade-button cf-float-left">
              hide advanced filters
            </button>
          </div>
        </div>
      } else {
        advancedFiltersToggle =
        <div className="row">
          <div className="col-sm-12">
            <button onClick={this.props.handleAdvancedFiltershow}  className="btn cf-fade-button cf-float-left">
              show advanced filters
            </button>
          </div>
        </div>
      }
    }

    var spanExpand = <span className="cf-cursor-pointer" onClick={this.expandFilters}>  +  </span>
    if (this.state.filtersExpanded) {
      spanExpand = <span className="cf-cursor-pointer" onClick={this.expandFilters}>  -  </span>
    }

    var filters;
    if (this.state.filtersExpanded) {
      filters =
      <div className="cf-filters-container">
        <div className="row justify-content-center cf-vote-row">
          {filterButtonsRowOne}
        </div>
        <div className="row justify-content-center cf-vote-row">
          {filterButtonsRowTwo}
        </div>
        <br/>
        <div className="row cf-checkbox-row">
          <Checkbox
            className="col-12 cf-margin-top-bottom-10px"
            name={"hideAnonAndGuest"}
            checked={this.state.hideAnonAndGuest}
            label="Hide Anonymous and Guest Comments"
            onChange={this.props.onChange}
          />
        </div>
      </div>
    }

    const marginTop0 = {
      marginTop: "0px"
    }

    return(
      <div className={`cf-filter-block ${this.props.className}`}>

        <div className="row cf-vote-row" >
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
          <div className="col-6">
            <h4 className="cf-line-height-2-25">Filters{spanExpand}</h4>
          </div>
          <div className="col-6">
            <button style={marginTop0} className="cf-fade-button btn btn-sm cf-float-right" onClick={this.props.clearFilters}>Clear</button>
          </div>
        </div>
        {filters}
        <div className="row">
          <div className="col-sm-6 cf-filter-from-section">
            <h4>Show only comments from:</h4>
            <FilterCommentsBy
              commentsFrom={this.props.sortOpts.commentsFrom}
              onClick={this.props.handleFilterByClick}
              />
          </div>
          <div className="col-sm-6 cf-filter-from-section">
            <h4>Count only Votes By:</h4>
            <FilterVotesBy
              votesFrom={this.props.sortOpts.votesFrom}
              onClick={this.props.handleFilterByClick}
              />
          </div>
        </div>
        <br />
        {advancedFiltersToggle}
        {advancedFilters}
        <hr />
      </div>
    )
  }
};

export default CommentFilters
