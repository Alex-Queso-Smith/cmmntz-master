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

    var anonCheckBox;
    var imageSrc = `${this.props.globalSettings.baseUrl}/images/icons-v2/anonymous-unselected.png`
    var anonMessage = "Show from Anonymous and Guest"

    if (!hideAnonAndGuest) {
      imageSrc = `${this.props.globalSettings.baseUrl}/images/icons-v2/anonymous-selected.png`
      anonMessage = "Hide from Anonymous and Guest"
    }
    anonCheckBox =
    <div className="cf-tooltip-container">
      <img className={`cf-vote-btn cf-cursor-pointer`} onClick={this.props.onChange} name='hideAnonAndGuest' src={imageSrc} />
      <span className="cf-tooltip-content-top cf-tooltip-content-top-anon-filter">{anonMessage}</span>
    </div>

    var filters, clearButton, commentInfo;


    if (!this.props.widgetFilters) {
      var sortStyle = {
        fontWeight: "bold"
      }

      filters =
      <div className="cf-filters-container">

        <h4 style={sortStyle}>Filters</h4>
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

        var commentsFrom;
        if (this.state.commentsFromExpanded) {
          commentsFrom =
          <div>
            <div className="row">
              <div className="col-6 cf-filter-from-section cf-text-center">
                <FilterCommentsBy
                  commentsFrom={this.props.sortOpts.commentsFrom}
                  onClick={this.props.handleFilterByClick}
                  />
              </div>
              <div className="col-6 cf-filter-from-section justify-content-center">
                {anonCheckBox}
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
            <hr />
          </div>
        }

        var handlePresetFilter = (event) => {
          this.props.handlePresetFilterChange(event);
          this.setState({ filtersExpanded: true })
        }

        var expandStyle = {
          height: '12px',
          width: '12px',
          marginLeft: "35px"
        }

        var fromStyle = {
          fontWeight: "bold",
          fontSize: "1em",
          marginBottom: "0px",
          lineHeight: "1.6",
          marginLeft: "20px"
        }

        var { commentsFromExpanded } = this.state;

        var expandImg = commentsFromExpanded ? "minus.png" : "plus.png"

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
            />
          <hr />

          <div className="row cf-margin-bottom-10px">
            <div className="col-1 col-sm-1 cf-cursor-pointer" onClick={ () => { this.setState({ commentsFromExpanded: !this.state.commentsFromExpanded }) } }>
              <img style={expandStyle} src={`/images/icons-v2/${expandImg}`} />
            </div>
            <div className="col-11 col-sm-11 cf-cursor-pointer" onClick={ () => { this.setState({ commentsFromExpanded: !this.state.commentsFromExpanded }) } }>
              <h4 style={fromStyle} className="cf-open-close">Show only comments from</h4>
            </div>
          </div>
          <hr />
          {commentsFrom}
        </div>

        var clearButtonStyle = {
          marginTop: "-2px"
        }

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
          color: "#800080"
        }

        clearButton =
        <button style={clearButtonStyle} className="cf-fade-button cf-fade-button-purple btn btn-sm" onClick={this.props.clearFilters}>Clear</button>

        commentInfo =
        <span>
          <span style={purpleStyle}>{this.props.grandTotalComments}</span> <img style={checkXStyle} src={`${this.props.globalSettings.baseUrl}/images/icons-v2/speech-bubble.png`} /> | <span style={greenStyle}>{this.props.totalComments}</span> <img style={checkXStyle} src={`${this.props.globalSettings.baseUrl}/images/icons-v2/check.png`} /> | <span style={redStyle}>{this.props.filteredCount}</span> <img style={checkXStyle} src={`${this.props.globalSettings.baseUrl}/images/icons-v2/x.png`} />
        </span>
      }

    }

    var expandImg = this.state.filtersExpanded ? "minus.png" : "plus.png";

    var filterRow;
    if (!this.props.hideFilterLink) {

      var expandStyle = {
        height: '12px',
        width: '12px',
        marginLeft: "10px"
      }

      var sortStyle = {
        fontWeight: "bold",
        fontSize: "1em",
        marginBottom: "0px",
        lineHeight: "1.6"
      }

      filterRow =
      <div className="row">
        <div onClick={this.expandFilters} className="col-1 cf-cursor-pointer">
          <img style={expandStyle} src={`/images/icons-v2/${expandImg}`} />
        </div>
        <div onClick={this.expandFilters} className="col-2 cf-cursor-pointer">
          <h4 style={sortStyle} >Filters</h4>
        </div>
        <div className="col-3">
          {clearButton}
        </div>
        <div className="col-6">
          <div className="cf-float-right">
            {commentInfo}
          </div>
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
