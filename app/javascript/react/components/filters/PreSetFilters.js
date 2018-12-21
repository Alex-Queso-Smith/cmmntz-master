import React from 'react';

class PreSetFilters extends React.Component {
  state = {}

  render(){
    return(
      <div id="preset-filters-selector">
        <div className="preset-filter-row row">
          <h4 className="text-medium margin-right-5px">Need a suggestion? Show: </h4>
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
        </div>
      </div>
    )
  }
}

export default PreSetFilters;
