import React from 'react';

class PreSetFilters extends React.Component {
  state = {
    expand: false
  }

  render(){
    var { expand } = this.state;

    var expandImg = expand ? "minus.png" : "plus.png"

    var dropDown;
    if (expand) {
      dropDown =
      <select name="presetFilter" value={this.props.option} onChange={this.props.onChange}>
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

    var expandStyle = {
      height: "12px",
      width: "12px",
      marginRight: "10px"
    }

    var suggestionStyle = {
      marginRight: "5px",
      fontWeight: "bold"
    }

    return(
      <div id="cf-preset-filters-selector">
        <div className="cf-preset-filter-row row">
          <h4 style={suggestionStyle}>Suggestions</h4>
          <span><img className="cf-cursor-pointer" style={expandStyle} src={`/images/icons-v2/${expandImg}`} onClick={ () => { this.setState({ expand: !this.state.expand }) } }></img></span>
          {dropDown}
        </div>
      </div>
    )
  }
}

export default PreSetFilters;
