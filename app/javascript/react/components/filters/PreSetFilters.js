import React from 'react';

class PreSetFilters extends React.Component {
  state = {
    expand: false
  }

  render(){
    var { expand } = this.state;

    var expandImg = expand ? "minus.png" : "plus.png";

    var selectStyle = {
      marginRight: "15px"
    }

    var dropDown;
    if (expand) {
      dropDown =
      <select style={selectStyle} className="col cf-margin-top-10px" name="presetFilter" value={this.props.option} onChange={this.props.onChange}>
        <option  value='0' />
        <option value="1" className="filter-list-item">
          Funny comments posted near me
        </option>
        <option value="2" className="filter-list-item">
          No trash, flagged, or disliked a lot
        </option>
        <option value="3" className="filter-list-item">
          Loved comments that aren't boring
        </option>
        <option value="4" className="filter-list-item">
          Angry comments that are flagged
        </option>
        <option value="5" className="filter-list-item">
          Comments liked a lot, no trash
        </option>
      </select>
    }

    var span = <span className="cf-margin-left-10px">&#9658;</span>
    if (this.state.expand) {
      var span = <span className="cf-margin-left-10px">&#9660;</span>
    }

    return(
      <div id="cf-preset-filters-selector">
        <div className="cf-preset-filter-row row">

          <div className="col">
            <button className="cf-cursor-pointer cf-sort-filter-button btn btn-sm cf-float-left" onClick={ () => { this.setState({ expand: !this.state.expand }) } }>Suggestions{span}</button>
          </div>
          {dropDown}
        </div>
      </div>
    )
  }
}

export default PreSetFilters;
