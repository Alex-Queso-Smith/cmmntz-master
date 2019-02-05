import React from 'react';

const UserThemeSelector = props => {
  var leftStyle = {
    float: "right",
    marginRight: "13px"
  }

  var rightStyle = {
    marginLeft: "13px"
  }

  return(
    <div className="user-theme-selector">

      <div className="row" id="cf-theme-selector-options-wrapper">
        <div className="col-6" id="cf-theme-selector-options-left">
          <label style={leftStyle} className="cf-text-medium cf-theme-select">
            Theme:
            <br />
            <br />
            <select name="colorTheme" value={props.colorTheme} onChange={props.onChange} className="form-control">
              <option value="cf-light">Light</option>
              <option value="cf-dark">Dark</option>
            </select>
          </label>
        </div>

        <div className="col-6" id="cf-theme-selector-options-right">
          <label style={rightStyle} className="cf-text-medium cf-theme-select">
          Font:
          <br />
          <br />
          <select name="font" value={props.font} onChange={props.onChange} className="form-control">
            <option value="cf-serif" className="cf-serif">Serif</option>
            <option value="cf-sans-serif" className="cf-sans-serif">Sans-Serif</option>
          </select>
          </label>
        </div>
      </div>

      <br />
      <div id="cf-theme-selector-demo-wrapper" className={`cf-bordered ${props.colorTheme} ${props.font}`}>
        <div className="cf-bordered">
          AaBbCc
        </div>
      </div>
    </div>
  );
};

export default UserThemeSelector;
