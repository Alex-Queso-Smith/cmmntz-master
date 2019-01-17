import React from 'react'

import { AgeRangeSelector, AgeSlider, GenderSelector, Checkbox  } from '../../components/form/FormComponents';
import { SortDir, SortButton } from '../../components/filters/SortSelect'
import { ImageSelector } from '../../util/VoteUtil';
import { SortButtons, FilterButtonsRowOne, FilterButtonsRowTwo, FilterCommentsBy, FilterVotesBy } from '../../util/FilterUtil'
import GeoSelect from '../filters/GeoSelect';
import PreSetFilters from '../../components/filters/PreSetFilters';

class CommentFilters extends React.Component {
  state = {
    hideAnonAndGuest: this.props.sortOpts.hideAnonAndGuest,
    filtersExpanded: this.props.filtersExpanded
  }

  expandFilters = this.expandFilters.bind(this);

  componentDidUpdate(prevProps, prevState){
    if (this.props.sortOpts.hideAnonAndGuest != this.state.hideAnonAndGuest) {
      this.setState({ hideAnonAndGuest: this.props.sortOpts.hideAnonAndGuest })
    }

    if (this.props.filtersExpanded != prevProps.filtersExpanded) {
      this.setState({ filtersExpanded: this.props.filtersExpanded })
    }
  }

  expandFilters(){
    this.setState({ filtersExpanded: !this.state.filtersExpanded })
  }

  render(){

    var filterButtonsRowOne = FilterButtonsRowOne(this)
    var filterButtonsRowTwo = FilterButtonsRowTwo(this)

    const { showAdvancedFilters, radius, x, y, latitude, longitude, geoPin, hideAnonAndGuest } = this.props.sortOpts;

    var expandImg = this.state.filtersExpanded ? "minus.png" : "plus.png"
    var spanExpand;
    if (!this.props.hideFilterLink){
      spanExpand =
      <span className="cf-cursor-pointer cf-open-close" onClick={this.expandFilters}>
        Filters <img src={`/images/icons-v2/${expandImg}`} />
      </span>
    } else {
      spanExpand =
      <span className="cf-open-close">
        Filters
      </span>
    }

    var anonCheckBox;
    var imageSrc = `/images/icons-v2/anonymous-unselected.png`

    if (!hideAnonAndGuest) {
      imageSrc = `/images/icons-v2/anonymous-selected.png`
    }
    anonCheckBox =
    <div className="col-2">
      <img className={`cf-vote-btn cf-cursor-pointer cf-margin-top-10px`} onClick={this.props.onChange} name='hideAnonAndGuest' src={imageSrc} />
      {this.state.hideAnonAndGuest}
    </div>

    var filters;
    if (this.state.filtersExpanded) {
      var geoShow;
      if (this.props.showGeo) {
        geoShow =
        <div id="advanced-filters">
          <br />
          <GeoSelect
            parentSetLatLongClick={this.props.parentSetLatLongClick}
            radius={radius}
            userInfo={this.props.userInfo}
            sortOpts={this.props.sortOpts}
            />
        </div>
      }

      filters =
      <div className="cf-filters-container">
        <div className="row justify-content-center cf-vote-row">
          {filterButtonsRowOne}
        </div>
        <div className="row justify-content-center cf-vote-row">
          {filterButtonsRowTwo}
        </div>

        <hr />

        <div className="row">
          <div className="col-6 cf-filter-from-section">
            <h4 className="cf-open-close">Show only comments from:</h4>
            <FilterCommentsBy
              commentsFrom={this.props.sortOpts.commentsFrom}
              onClick={this.props.handleFilterByClick}
              />
          </div>
          <div className="col-6 cf-filter-from-section">
            {anonCheckBox}
          </div>
        </div>

        <hr />
        <div className="row cf-justify-content-center">
          <div className="col-12 cf-filter-gender-section">
            <GenderSelector
              name="gender"
              label="Gender"
              onChange={this.props.handleFilterByClick}
              value={this.props.sortOpts.gender}
            />
          </div>
        </div>

        <hr />
        <div className="row cf-justify-content-center">
          <div className="col-12 cf-filter-age-range-section">
            <AgeSlider
              name="ageRange"
              label="Age Range"
              onChange={this.props.handleFilterByClick}
              value={this.props.sortOpts.ageRange}

              noRangeMessageOverride="No Preference"
            />
          </div>
        </div>
        <hr />
        {geoShow}
        <hr />
      </div>

    }

    const marginTop0 = {
      marginTop: "0px"
    }

    var handlePresetFilter = (event) => {
      this.props.handlePresetFilterChange(event);
      this.setState({ filtersExpanded: true })
    }

    return(
      <div className={`cf-filter-block ${this.props.className}`}>
        <br/>
        <div className="row">
          <div className="col-6">
            <h4 className="cf-line-height-2-25">{spanExpand}</h4>
          </div>
          <div className="col-6">
            <button style={marginTop0} className="cf-fade-button btn btn-sm cf-float-right" onClick={this.props.clearFilters}>Clear</button>
          </div>
        </div>
        {filters}
        <PreSetFilters
          onChange={handlePresetFilter}
          option={this.props.option}
        />
      </div>
    )
  }
};

export default CommentFilters
