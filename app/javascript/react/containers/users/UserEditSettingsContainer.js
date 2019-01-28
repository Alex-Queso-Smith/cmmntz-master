import React from 'react';

import CommentFilters from '../comments/CommentFilters';
import { FetchWithPush, FetchDidMount } from '../../util/CoreUtil';
import { Checkbox } from '../../components/form/FormComponents';
import { UserSortButtons } from '../../util/FilterUtil';
import { ImageSelector } from '../../util/VoteUtil';
import { SortDir } from '../../components/filters/SortSelect'

class UserEditSettingsContainer extends React.Component {
  state = { }

  render(){
    var { sortOpts } = this.props;

    var sortButtons = UserSortButtons(this);
    var sortStyle = {
      fontWeight: "bold"
    }
    return(
      <div id="cf-user-edit-settings-container">
        <br />
        <Checkbox
          onChange={this.props.handleRevertSettings}
          name={"useGalleryDefault"}
          label={"Check to use the settings chosen by the websites I visit"}
          checked={this.props.useGalleryDefault}
        />
      <h4 style={sortStyle} className="cf-margin-top-5px">Sort</h4>
        <div className="row cf-vote-row justify-content-center" >
          {sortButtons}
          <SortDir
            value={sortOpts.sortDir}
            onClick={this.props.handleSortDirClick}
            image={ImageSelector(sortOpts.sortDir, this.props.globalSettings.baseUrl)}
            />
        </div>
        <CommentFilters
          className={"cf-margin-top-10px"}
          sortOpts={sortOpts}
          handleFilterSubmit={this.props.handleChange}
          handleSortDirClick={this.props.handleSortDirClick}
          clearFilters={this.props.clearFilters}
          handleFilterClick={this.props.handleFilterClick}
          handleFilterByClick={this.props.handleFilterByClick}
          clearFilters={this.props.clearFilters}
          filtersExpanded={true}
          onChange={this.props.handleChange}
          hideFilterLink={true}
          widgetFilters={false}
          globalSettings={this.props.globalSettings}
        />
        <Checkbox
          onChange={this.props.handleChange}
          name={"censor"}
          label={"Censor all text?"}
          checked={this.props.censor}
        />
        <Checkbox
          onChange={this.props.handleChange}
          name={"showCensoredComments"}
          label={"Show Comment if Censored?"}
          checked={this.props.showCensoredComments}
        />
      <hr />
        <div className="">
          <button className="btn btn-sm cf-float-right btn-dark" onClick={this.props.handleSubmit}>
            Update
          </button>
          <button className="btn btn-sm btn-dark cf-float-left" onClick={ this.props.updateDisplay }>
            Close
          </button>
        </div>
      </div>
    )
  }
}


export default UserEditSettingsContainer;
