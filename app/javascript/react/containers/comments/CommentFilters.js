import React from 'react'

import { AgeRangeSelector, AgeSlider, GenderSelector, Checkbox } from '../../components/form/FormComponents';
import { SortDir, SortButton } from '../../components/filters/SortSelect'
import { ImageSelector } from '../../util/VoteUtil';
import { SortButtons, FilterButtonsRowOne, FilterButtonsRowTwo, FilterCommentsBy, FilterVotesBy } from '../../util/FilterUtil'
import GeoSelect from '../filters/GeoSelect';
import PreSetFilters from '../../components/filters/PreSetFilters';

class CommentFilters extends React.Component {
  state = {
    hideAnonAndGuest: this.props.sortOpts.hideAnonAndGuest,
    filtersExpanded: this.props.filtersExpanded,
    commentsFromExpanded: false
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

    var filters, clearButton, commentInfo;
    if (!this.props.widgetFilters) {
      var sortStyle = {
        fontWeight: "bold"
      }

      var alignBottom = {
        alignSelf: "flex-end"
      }

      filters =
      <div className="cf-filters-container">

        <div className="row">
          <div style={alignBottom} className="col-6">
            <h4 style={sortStyle}>Filters</h4>
          </div>
          <div className="col-6">
            <button className="cf-fade-button cf-fade-button-purple btn btn-sm cf-float-right" onClick={this.props.clearFilters}>Clear</button>
          </div>
        </div>
        <div className="row justify-content-center cf-vote-row">
          {filterButtonsRowOne}
        </div>
        <div className="row justify-content-center cf-vote-row">
          {filterButtonsRowTwo}
        </div>
        <hr />

      </div>
    } else {

      if (this.state.filtersExpanded) {

        var filterBy;
        if (this.props.followedUsers.length > 2) {
          filterBy =
          <div className="col-6 cf-filter-from-section cf-text-center">
            <FilterCommentsBy
              commentsFrom={this.props.sortOpts.commentsFrom}
              onClick={this.props.handleFilterByClick}
              />
          </div>
        }

        var imageSrc = `${this.props.globalSettings.baseImageUrl}/images/icons-v2/anonymous-unselected.png`
        var anonMessage = "Show from Anonymous and Guest"

        if (!hideAnonAndGuest) {
          imageSrc = `${this.props.globalSettings.baseImageUrl}/images/icons-v2/anonymous-selected.png`
          anonMessage = "Hide from Anonymous and Guest"
        }

        var commentsFrom;
        if (this.state.commentsFromExpanded) {
          var containerStyle = {
            margin: "auto",
            width: "19%"
          }

          commentsFrom =
          <div>
            <div className="row justify-content-center">
              {filterBy}
              <div className="col-6 cf-filter-from-section justify-content-center">
                <div style={containerStyle} className="cf-tooltip-container">
                  <img className={`cf-vote-btn cf-cursor-pointer`} onClick={this.props.onChange} name='hideAnonAndGuest' src={imageSrc} />
                  <span className="cf-tooltip-content-top">{anonMessage}</span>
                </div>
              </div>
            </div>

            <div className="row cf-justify-content-center">
              <div className="col-12 cf-filter-gender-section">
                <GenderSelector
                  name="gender"
                  label=""
                  onChange={this.props.handleFilterByClick}
                  value={this.props.sortOpts.gender}
                  baseUrl={this.props.globalSettings.baseUrl}
                  baseImageUrl={this.props.globalSettings.baseImageUrl}
                  />
              </div>
            </div>

            <div className="row cf-justify-content-center">
              <div className="col-12 cf-filter-age-range-section">
                <AgeSlider
                  name="ageRange"
                  label="Age Range"
                  onChange={this.props.handleFilterByClick}
                  value={this.props.sortOpts.ageRange}
                  baseUrl={this.props.globalSettings.baseUrl}
                  baseImageUrl={this.props.globalSettings.baseImageUrl}

                  noRangeMessageOverride="No Preference"
                  />
              </div>
            </div>

            <div id="advanced-filters">
              <br />
              <GeoSelect
                parentSetLatLongClick={this.props.parentSetLatLongClick}
                radius={radius}
                userInfo={this.props.userInfo}
                sortOpts={this.props.sortOpts}
                />
            </div>
          </div>
        }

        var handlePresetFilter = (event) => {
          this.props.handlePresetFilterChange(event);
          this.setState({ filtersExpanded: true })
        }

        var { commentsFromExpanded } = this.state;

        var expandImg = commentsFromExpanded ? "minus.png" : "plus.png";

        var span = <span className="cf-margin-left-10px">&#9658;</span>
        if (this.state.commentsFromExpanded) {
          var span = <span className="cf-margin-left-10px">&#9660;</span>
        }

        filters =
        <div className="cf-filters-container">

          <div className="row justify-content-center cf-vote-row">
            {filterButtonsRowOne}
          </div>
          <div className="row justify-content-center cf-vote-row">
            {filterButtonsRowTwo}
          </div>
          <PreSetFilters
            onChange={handlePresetFilter}
            option={this.props.option}
            globalSettings={this.props.globalSettings}
            />

          <div className="row cf-margin-bottom-10px">
            <div className="col">
              <button className="cf-cursor-pointer cf-sort-filter-button btn btn-sm cf-float-left" onClick={ () => { this.setState({ commentsFromExpanded: !this.state.commentsFromExpanded }) } }>Show only comments from{span}</button>
            </div>
          </div>
          {commentsFrom}
        </div>

        var checkXStyle = {
          width: "15px",
          height: "15px"
        }

        var greenStyle = {
          color: "#009E09"
        }

        var redStyle = {
          color: "#DF3939"
        }

        var purpleStyle = {
          color: "#544382"
        }

        var smallFont = {
          fontSize: ".75em"
        }

        clearButton = <button className="cf-fade-button btn btn-sm cf-float-right" onClick={this.props.clearFilters}>Clear</button>
      }

    }

    var expandImg = this.state.filtersExpanded ? "minus.png" : "plus.png";

    var filterRow;
    if (!this.props.hideFilterLink) {

      var span = <span className="cf-margin-left-10px">&#9658;</span>
      if (this.state.filtersExpanded) {
        var span = <span className="cf-margin-left-10px">&#9660;</span>
      }

      filterRow =
      <div className="row">
        <div className="col-2">
          <button onClick={this.expandFilters} className="btn cf-sort-filter-button cf-cursor-pointer btn-sm">Filters{span}</button>
        </div>

        <div className="col">
          {clearButton}
        </div>
      </div>

    } else {
      filterRow =
        <div className="row">
        </div>
    }

    return(
      <div className={`cf-filter-block ${this.props.className}`}>
        <br/>
        {filterRow}
        {filters}
      </div>
    )
  }
};

export default CommentFilters
