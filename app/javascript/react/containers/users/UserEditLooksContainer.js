import React from 'react';

import UserThemeSelector from '../../components/form/UserThemeSelector';
import { FetchDidMount, FetchWithPush } from '../../util/CoreUtil';

class UserEditLooksContainer extends React.Component {
  state = {}

  render(){
    var { font, colorTheme } = this.props;

    return(
      <div id="cf-user-edit-looks-container">
        <form className="form" id="cf-user-edit-looks-form" onSubmit={this.props.handleSubmit}>
          <UserThemeSelector
            onChange={this.props.handleChange}
            font={font}
            colorTheme={colorTheme}
            />
          <hr />
          <div className="form-group actions">
            <button id="cf-user-edit-looks-button" type="submit" className="btn btn-sm btn-dark cf-float-right" value="Submit">
              Update
            </button>
            <button className="btn btn-sm btn-dark cf-float-left" onClick={ this.props.updateDisplay }>
              Close
            </button>
          </div>
        </form>
      </div>
    )
  }
}

export default UserEditLooksContainer;
